"""Build a local Foundry package; never publish or edit the source manifest."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parents[1]
DOCUMENTS = (
    'module.json', 'LICENSE', 'README.md', 'CREDITS.md', 'ART-REVIEW.md',
    'QA.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'RELEASING.md', 'RELEASE-READINESS.md',
    'docs/COPY-AUTHORING.md', 'docs/COPY-INVENTORY.md',
)
DIRECTORIES = {'scripts': {'.mjs'}, 'styles': {'.css'},
               'assets': {'.png', '.jpg', '.jpeg', '.webp', '.svg'},
               'licenses': {'.txt', '.json', '.md'}, 'content': {'.mjs'}}


def runtime_files(root):
    result = []
    for name in DOCUMENTS:
        path = root / name
        if path.is_symlink() or not path.is_file():
            raise ValueError(f'Missing or non-regular release document: {name}')
        result.append(path)
    for directory, extensions in DIRECTORIES.items():
        base = root / directory
        if base.is_symlink() or not base.is_dir():
            raise ValueError(f'Missing or linked runtime directory: {directory}')
        for path in base.rglob('*'):
            if path.is_symlink():
                raise ValueError(f'Symlinks cannot be packaged: {path.relative_to(root)}')
            if path.is_dir():
                continue
            if (not path.is_file() or path.suffix not in extensions
                    or any(part.startswith('.') for part in path.relative_to(root).parts)):
                raise ValueError(f'Unexpected runtime file: {path.relative_to(root)}')
            result.append(path)
    return sorted(result, key=lambda p: p.relative_to(root).as_posix())


def release_manifest(manifest, repository=None):
    result = dict(manifest)
    if repository:
        repository = repository.rstrip('/')
        if not re.fullmatch(r'https://github\.com/[A-Za-z0-9][A-Za-z0-9-]*/[A-Za-z0-9_][A-Za-z0-9_.-]*', repository):
            raise ValueError('Use the actual https://github.com/OWNER/REPOSITORY URL')
        if repository.endswith('.git') or repository.endswith('/OWNER/REPOSITORY'):
            raise ValueError('Use a real repository web URL, without .git or placeholders')
        version = result['version']
        result.update(url=repository, bugs=f'{repository}/issues',
                      changelog=f'{repository}/releases',
                      manifest=f'{repository}/releases/latest/download/module.json',
                      download=f'{repository}/releases/download/v{version}/heros-call-{version}.zip')
    return result


def write_archive(root, output, manifest):
    encoded = (json.dumps(manifest, indent=2, ensure_ascii=False) + '\n').encode()
    with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in runtime_files(root):
            relative = path.relative_to(root).as_posix()
            info = zipfile.ZipInfo(f'{manifest["id"]}/{relative}', date_time=(2000, 1, 1, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            archive.writestr(info, encoded if relative == 'module.json' else path.read_bytes(),
                             compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
    with zipfile.ZipFile(output) as archive:
        if archive.testzip() is not None:
            raise ValueError('Archive integrity check failed')
    return encoded


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repository', help='Actual public GitHub repository URL (optional for manual installs)')
    args = parser.parse_args()
    subprocess.run(['node', str(ROOT / 'tools/check.mjs')], cwd=ROOT, check=True)
    source = json.loads((ROOT / 'module.json').read_text())
    repository = args.repository or source.get('url')
    manifest = release_manifest(source, repository)
    output = ROOT / 'dist'
    if output.is_symlink():
        raise ValueError('dist/ must be a local directory, not a symlink')
    output.mkdir(exist_ok=True)
    archive = output / f'heros-call-{manifest["version"]}.zip'
    encoded = write_archive(ROOT, archive, manifest)
    (output / 'module.json').write_bytes(encoded)
    checksums = ''.join(f'{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.name}\n'
                        for path in [archive, output / 'module.json'])
    (output / 'SHA256SUMS').write_text(checksums)
    print(f'Built {archive.name} ({archive.stat().st_size / 2**20:.2f} MiB) in dist/')
    print('Release URLs configured.' if repository else 'Manual-install candidate; no public release URLs configured.')


if __name__ == '__main__':
    main()
