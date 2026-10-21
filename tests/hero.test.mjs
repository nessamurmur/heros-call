import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolveHero} from '../scripts/hero.mjs';
import {ARTWORK,CALLING_ART} from '../scripts/art-credits.mjs';
import {copy} from '../scripts/copy.mjs';

const calling = (name,key) => ({name,image:`systems/nimble/assets/classImages/${key}.webp`});
const human = {name:'Human',image:'icons/environment/people/commoner.webp'};
const elf = {name:'Elf',image:'icons/consumables/plants/dried-leaf-stem-twig-green.webp'};
const orc = {name:'Orc',image:'icons/equipment/shield/heater-wooden-brown-axe.webp'};
const hunter = calling('Hunter','hunter');

test('ancestry selection changes the Hunter illustration while preserving the calling',()=>{
  const elven=resolveHero(hunter,elf), humanHero=resolveHero(hunter,human);
  assert.equal(elven.key,'elf-hunter'); assert.equal(humanHero.key,'falconer');
  assert.equal(elven.matched,true); assert.equal(humanHero.matched,true);
});
test('Orc Mage has a distinct illustration from the initial Elf example',()=>{
  assert.equal(resolveHero(calling('Mage','mage'),null).key,'elf-mage');
  const hero=resolveHero(calling('Mage','mage'),orc,true);
  assert.equal(hero.key,'orc-shaman'); assert.equal(hero.matched,true);
  assert.equal(hero.note,copy('ui.hero.previewPrefix')+copy('ui.hero.matchedIllustration',{ancestry:'Orc',calling:'Mage'}));
});
test('unsupported ancestry is identified as a class example, never a matching avatar',()=>{
  const hero=resolveHero(hunter,{name:'Bunbun',image:'icons/creatures/mammals/rabbit-movement-glowing-green.webp'});
  assert.equal(hero.matched,false);
  assert.equal(hero.note,copy('ui.hero.callingIllustration',{ancestry:'Elf'}));
  assert.equal(hero.key,'elf-hunter');
});
test('homebrew names cannot silently substitute a built-in class or ancestry',()=>{
  const hero=resolveHero({name:'Hunter',image:'worlds/test/custom-hunter.webp'},elf);
  assert.equal(hero.art,undefined); assert.equal(hero.image,'worlds/test/custom-hunter.webp');
  assert.equal(resolveHero(hunter,{name:'Human',image:'worlds/test/custom-human.webp'}).matched,false);
});
test('route prefixes and asset cache parameters do not break built-in matching',()=>{
  const hero=resolveHero({...hunter,image:'https://example.test/foundry/'+hunter.image+'?v=1'}, {...human,image:'https://example.test/foundry/'+human.image+'?v=1'});
  assert.equal(hero.key,'falconer'); assert.equal(hero.matched,true);
});
test('all bundled art retains source hashes, individual attribution and license',()=>{
  assert.equal(new Set(ARTWORK.map(a=>a.id)).size,ARTWORK.length);
  for(const art of ARTWORK) {
    const path=new URL('../'+art.image.replace('modules/heros-call/',''),import.meta.url);
    assert.ok(existsSync(path),art.image);
    assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'),art.sha256);
    assert.ok(art.artist&&art.source.startsWith('https://'));
    assert.ok(['CC BY-SA 4.0','CC BY-SA 3.0','GPL-2.0-or-later'].includes(art.license));
  }
  for(const id of Object.values(CALLING_ART)) assert.ok(ARTWORK.some(a=>a.id===id));
  assert.equal(ARTWORK.find(a=>a.id==='elf-hunter').artist,'Kathrin Polikeit');
  assert.equal(ARTWORK.find(a=>a.id==='knight').artist,'Nico Goeminne');
});

test('ancestry changes cannot restore the misleading old depictions of the four revised classes',()=>{
 const retired=new Set(['knight','mentor','shapeshift','martial-artist','human-commander']);
 for(const key of ['oathsworn','shepherd','stormshifter','zephyr']){
  for(const ancestry of [null,human,elf,orc,{name:'Celestial',image:'icons/magic/holy/angel-winged-humanoid-blue.webp'}]){
   const hero=resolveHero(calling(key,key),ancestry);
   assert.ok(!retired.has(hero.key),`${key} / ${ancestry?.name}`);
   assert.ok(hero.art.classes.includes(key));
  }
 }
 assert.equal(new Set(Object.values(CALLING_ART)).size,11,'Each calling has its own illustration');
 assert.equal(resolveHero(calling('Zephyr','zephyr')).kind,'ink','Ink framing follows the calling artwork');
});
