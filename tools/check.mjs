import assert from 'node:assert/strict';
import {readFileSync, readdirSync, lstatSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {ARTWORK} from '../scripts/art-credits.mjs';
import {CHAPTER_ARTWORK} from '../scripts/chapter-art.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(resolve(root, path), 'utf8');
const json = path => JSON.parse(read(path));
const hash = path => createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
const existsFile = path => {
  assert.ok(typeof path === 'string' && path && !path.includes('\\'), `Invalid path: ${path}`);
  const absolute = resolve(root, path);
  assert.ok(absolute.startsWith(root), `Path escapes module: ${path}`);
  assert.ok(lstatSync(absolute).isFile(), `Not a regular file: ${path}`);
};
function files(directory) {
  return readdirSync(resolve(root, directory)).filter(name => name !== '__pycache__').sort().flatMap(name => {
    const path = `${directory}/${name}`;
    const stat = lstatSync(resolve(root, path));
    assert.ok(!stat.isSymbolicLink(), `Symlink in publication tree: ${path}`);
    return stat.isDirectory() ? files(path) : [path];
  });
}

const manifest = json('module.json');
assert.equal(manifest.id, 'heros-call');
assert.match(manifest.version, /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/);
assert.ok(manifest.title && manifest.description && manifest.authors?.every(a => a.name));
assert.ok(manifest.compatibility?.minimum && manifest.compatibility?.verified);
assert.ok(manifest.relationships?.systems?.some(s => s.id === 'nimble'));
assert.ok(manifest.esmodules?.length && manifest.styles?.length);
for (const path of [...manifest.esmodules, ...manifest.styles, manifest.license, manifest.readme]) existsFile(path);
assert.equal(json('package.json').private, true);
for (const doc of ['README.md', 'CHANGELOG.md', 'QA.md']) {
  assert.ok(read(doc).includes(manifest.version), `${doc} does not describe current version`);
}

// The source folder is the publication boundary, not the parent workspace.
const directories = new Set(['scripts', 'styles', 'assets', 'licenses', 'tests', 'tools', '.github']);
const rootFiles = new Set(['module.json', 'package.json', 'LICENSE', 'README.md', 'CREDITS.md',
  'ART-REVIEW.md', 'QA.md', 'CONTRIBUTING.md', 'CHANGELOG.md', 'RELEASING.md',
  'RELEASE-READINESS.md', '.gitignore', '.gitattributes']);
const localOnly = new Set(['.git', 'dist', 'node_modules', '.idea', '.vscode', '.DS_Store', 'Thumbs.db']);
for (const name of readdirSync(root)) {
  if (localOnly.has(name)) continue;
  assert.ok(directories.has(name) || rootFiles.has(name), `Unexpected publication-root entry: ${name}`);
}
const publishedFiles = [...rootFiles, ...[...directories].flatMap(files)];
const sourceExtensions = {scripts: /\.mjs$/, styles: /\.css$/, assets: /\.(png|jpe?g|webp|svg)$/,
  licenses: /\.(txt|json|md)$/, tests: /\.(mjs|json|py)$/, tools: /\.(mjs|py)$/,
  '.github': /\.(ya?ml|md)$/};
for (const path of publishedFiles) {
  existsFile(path);
  const directory = path.split('/')[0];
  if (sourceExtensions[directory]) assert.match(path, sourceExtensions[directory], `Unexpected source file: ${path}`);
  assert.ok(!path.split('/').some(part => part === '__pycache__' || part === '.env'), `Private/generated file: ${path}`);
  assert.ok(lstatSync(resolve(root, path)).size < 100 * 1024 * 1024, `File too large for ordinary Git: ${path}`);
}

const art = [...ARTWORK, ...CHAPTER_ARTWORK];
assert.equal(new Set(art.map(a => a.id)).size, art.length, 'Duplicate artwork IDs');
assert.equal(new Set(art.map(a => a.image)).size, art.length, 'Duplicate artwork paths');
assert.deepEqual(json('licenses/art-sources.json'), ARTWORK, 'Runtime/source art records diverge');
assert.deepEqual(json('licenses/chapter-art-sources.json'), CHAPTER_ARTWORK, 'Runtime/source chapter records diverge');
const licenseTexts = {
  'CC BY 3.0': 'CC-BY-3.0.txt', 'CC BY 4.0': 'CC-BY-4.0.txt',
  'CC BY-SA 3.0': 'CC-BY-SA-3.0.txt', 'CC BY-SA 4.0': 'CC-BY-SA-4.0.txt',
  'CC0 1.0': 'CC0-1.0.txt', 'GPL-2.0-or-later': 'GPL-2.0.txt'
};
const credits = read('CREDITS.md');
const inventory = json('licenses/asset-checksums.json');
assert.equal(new Set(inventory.map(a => a.file)).size, inventory.length);
assert.deepEqual(inventory.map(a => a.file).sort(), files('assets').sort(), 'Asset inventory differs from bundled files');
assert.deepEqual([...art.map(a => a.image.replace('modules/heros-call/', '')), 'assets/heros-call.svg'].sort(),
  files('assets').sort(), 'Asset has no attribution record');
for (const item of inventory) assert.equal(hash(item.file), item.sha256, `Changed original: ${item.file}`);
for (const item of art) {
  assert.ok(item.image.startsWith('modules/heros-call/assets/'), `Wrong asset namespace: ${item.id}`);
  const path = item.image.replace('modules/heros-call/', '');
  assert.equal(hash(path), item.sha256, `Artwork/source hash mismatch: ${item.id}`);
  assert.ok(item.artist && item.title && item.changes, `Incomplete attribution: ${item.id}`);
  for (const link of [item.source, item.licenseUrl]) assert.equal(new URL(link).protocol, 'https:');
  assert.ok(licenseTexts[item.license], `Unreviewed license: ${item.id}`);
  existsFile(`licenses/${licenseTexts[item.license]}`);
  assert.ok(credits.includes('`' + path + '`') && credits.includes(item.artist), `Missing visible credit: ${item.id}`);
}
const wesnoth = json('licenses/wesnoth-art-notice.json');
for (const item of art.filter(a => a.license === 'GPL-2.0-or-later')) {
  const notice = wesnoth.find(n => n.id === item.id);
  assert.ok(notice?.upstreamEmbeddedCopyright && notice.upstreamEmbeddedArtist, `Missing GPL notice: ${item.id}`);
  assert.equal(notice.sha256, item.sha256);
  assert.equal(notice.bundledSource, item.source);
}

for (const path of publishedFiles.filter(path => path.endsWith('.mjs'))) {
  execFileSync(process.execPath, ['--check', resolve(root, path)], {stdio: 'inherit'});
}
// Catch old implementation namespaces and accidental workstation paths in source.
const retiredName = ['em', 'bers'].join('');
const retired = new RegExp('nimble-' + retiredName + '|\\b' + retiredName + '[-.]|\\b' + retiredName + '[A-Z]|data-action-' + retiredName);
for (const path of publishedFiles.filter(p => /\.(mjs|css|json|md)$/.test(p) && !p.startsWith('licenses/'))) {
  const content = read(path);
  if (!path.startsWith('tools/')) assert.ok(!retired.test(content), `Retired namespace in ${path}`);
  assert.ok(!/(?:\/var)?\/home\/[^/]+\/(?:Documents|\.codex)\//.test(content), `Workstation path in ${path}`);
}
console.log(`Validated ${manifest.id} ${manifest.version}: ${art.length} illustrations, ${inventory.length} credited assets, source hashes, licenses, paths and syntax.`);
