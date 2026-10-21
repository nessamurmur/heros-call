"""Test release boundaries using synthetic data, without Foundry or artwork copies."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

SPEC = importlib.util.spec_from_file_location('release_package', Path(__file__).resolve().parents[1] / 'tools/package.py')
package = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(package)


class PackagingTest(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.manifest = {'id': 'heros-call', 'version': '0.1.0'}
        for name in package.DOCUMENTS:
            (self.root / name).write_text('Synthetic public document')
        (self.root / 'module.json').write_text(json.dumps(self.manifest))
        for directory in package.DIRECTORIES:
            (self.root / directory).mkdir()
        (self.root / 'assets/portrait.png').write_bytes(b'synthetic unchanged artwork')

    def test_private_research_and_tools_cannot_leak_into_archive(self):
        for directory in ('work', 'userdata', 'tests', '.git', 'tools'):
            (self.root / directory).mkdir()
            (self.root / directory / 'private.txt').write_text('must not ship')
        output = self.root / 'candidate.zip'
        package.write_archive(self.root, output, self.manifest)
        with zipfile.ZipFile(output) as archive:
            self.assertTrue(all(name.startswith('heros-call/') for name in archive.namelist()))
            self.assertFalse(any('private' in name for name in archive.namelist()))
            self.assertEqual(archive.read('heros-call/assets/portrait.png'), b'synthetic unchanged artwork')

    def test_symlinked_assets_and_unrecognised_files_are_rejected(self):
        extra = self.root / 'assets/unreviewed.pdf'
        extra.write_bytes(b'do not distribute')
        with self.assertRaisesRegex(ValueError, 'Unexpected runtime file'):
            package.runtime_files(self.root)
        extra.unlink()
        link = self.root / 'assets/linked.png'
        link.symlink_to(self.root / 'README.md')
        with self.assertRaisesRegex(ValueError, 'Symlinks cannot be packaged'):
            package.runtime_files(self.root)

    def test_archives_are_reproducible_and_manifests_match(self):
        manifest = package.release_manifest(self.manifest, 'https://github.com/example/hero-creator')
        a, b = self.root / 'a.zip', self.root / 'b.zip'
        encoded = package.write_archive(self.root, a, manifest)
        package.write_archive(self.root, b, manifest)
        self.assertEqual(a.read_bytes(), b.read_bytes())
        with zipfile.ZipFile(a) as archive:
            self.assertEqual(archive.read('heros-call/module.json'), encoded)
        self.assertEqual(json.loads((self.root / 'module.json').read_text()), self.manifest)
        self.assertEqual(manifest['download'], 'https://github.com/example/hero-creator/releases/download/v0.1.0/heros-call-0.1.0.zip')

    def test_manual_manifest_has_no_invented_urls_and_invalid_urls_fail(self):
        self.assertEqual(package.release_manifest(self.manifest), self.manifest)
        for url in ('http://github.com/example/repo', 'https://github.com/OWNER/REPOSITORY',
                    'https://github.com/example/repo.git', 'https://github.com/example/repo?token=secret',
                    'https://github.com/example/repo/releases'):
            with self.subTest(url=url), self.assertRaises(ValueError):
                package.release_manifest(self.manifest, url)
