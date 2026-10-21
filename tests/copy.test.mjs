import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {COPY, copy, formatCopy, htmlCopy, withArtworkCopy} from '../scripts/copy.mjs';
import {validateCopy} from '../tools/copy-validation.mjs';

const contract = JSON.parse(readFileSync(new URL('../tools/copy-contract.json', import.meta.url)));

test('editable copy covers every runtime slot and retains its placeholders', () => {
  const entries = validateCopy(COPY, contract);
  for (const [key, placeholders] of Object.entries(contract)) {
    const values = Object.fromEntries(placeholders.map(name => [name, `value-${name}`]));
    assert.equal(copy(key, values), formatCopy(entries[key], values));
  }
});

test('authoring validation detects lost keys, placeholders, and non-text values', () => {
  for (const mutate of [
    data => delete data.ui.common.chooseAndContinue,
    data => {data.ui.common.chooseAndContinue = 'Continue with {name}';},
    data => {data.ui.common.chooseAndContinue = 'Continue';},
    data => {data.callings.mage.motto = '';},
    data => {data.chapters.calling.title = 12;}
  ]) {
    const data = structuredClone(COPY);
    mutate(data);
    assert.throws(() => validateCopy(data, contract));
  }
});

test('replacement text can reorder placeholders without replacing user data twice', () => {
  assert.equal(formatCopy('{source}: {title}', {title:'{source} & <b>Title</b>', source:'A pack'}),
    'A pack: {source} & <b>Title</b>');
  assert.throws(() => formatCopy('{title}'), /Missing copy placeholder/);
  assert.throws(() => copy('ui.unknown'), /Missing copy entry/);
  assert.throws(() => copy('ui.common'), /Missing copy entry/);
});

test('HTML-bound copy escapes authored text and substituted character names', () => {
  const original = COPY.ui.common.chooseAndContinue;
  try {
    COPY.ui.common.chooseAndContinue = 'Choose "{title}" <&> \'continue\'';
    assert.equal(htmlCopy('ui.common.chooseAndContinue', {title:'<img src=x onerror=alert(1)>'}),
      'Choose &quot;&lt;img src=x onerror=alert(1)&gt;&quot; &lt;&amp;&gt; &#39;continue&#39;');
  } finally { COPY.ui.common.chooseAndContinue = original; }
});

test('artwork descriptions come from the authoring file without altering attribution facts', () => {
  const source = {id:'elf-mage', title:'Upstream title', artist:'Original artist', license:'CC BY-SA 4.0'};
  const art = withArtworkCopy(source);
  assert.equal(art.subject, COPY.artwork['elf-mage'].subject);
  assert.equal(art.changes, COPY.artwork['elf-mage'].changes);
  assert.equal(art.artist, source.artist);
  assert.equal(art.title, source.title);
  assert.deepEqual(source, {id:'elf-mage', title:'Upstream title', artist:'Original artist', license:'CC BY-SA 4.0'});
});
