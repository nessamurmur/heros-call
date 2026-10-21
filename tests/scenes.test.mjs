import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolveChapterArt, chapterFocusFromTarget} from '../scripts/scenes.mjs';
import {CHAPTER_ARTWORK} from '../scripts/chapter-art.mjs';
const hunter={name:'Hunter',image:'systems/nimble/assets/classImages/hunter.webp'};
const elf={name:'Elf',image:'icons/consumables/plants/dried-leaf-stem-twig-green.webp'};
const human={name:'Human',image:'icons/environment/people/commoner.webp'};
const backgrounds=JSON.parse(readFileSync(new URL('./fixtures/background-identities.json',import.meta.url)));
const background=name=>({name,image:backgrounds[name]});
const scene=(chapter,extra={})=>resolveChapterArt({chapter,calling:hunter,ancestry:elf,background:background('Survivalist'),...extra});

test('the default journey changes art at each chapter boundary and returns to the hero at review',()=>{
 const scenes=Array.from({length:9},(_,chapter)=>scene(chapter));
 for(let i=1;i<scenes.length;i++)assert.notEqual(scenes[i].key,scenes[i-1].key);
 assert.equal(new Set(scenes.map(s=>s.key)).size,8);
 assert.equal(scenes[0].key,scenes[8].key);
 assert.equal(scenes[7].art.artist,'Kaitlyn Peavler');
});
test('ancestry artwork changes with the browsed ancestry instead of retaining the class portrait',()=>{
 assert.notEqual(scene(1,{ancestry:human}).key,scene(1,{ancestry:elf}).key);
 assert.equal(scene(1,{ancestry:elf}).key,'sitting-elf');
 assert.equal(scene(1,{ancestry:elf}).chapterArt,true);
});
test('background pictures distinguish woodland, sea, study and a haunted past',()=>{
 const scenes=['Survivalist','Home at Sea','Academy Dropout','Haunted Past'].map(name=>scene(2,{background:background(name)}));
 assert.equal(new Set(scenes.map(s=>s.key)).size,4);
 assert.deepEqual(scenes.map(s=>s.subject),['Survivalist','Home at Sea','Academy Dropout','Haunted Past']);
});
test('unknown and homebrew ancestry identities retain their own artwork instead of an unrelated landscape',()=>{
 for(const ancestry of [{name:'Bunbun',image:'custom-bunbun.png'},{...elf,image:'worlds/test/elf.png'}]){
  const s=scene(1,{ancestry});assert.equal(s.image,ancestry.image);assert.match(s.note,/Ancestry symbol/);assert.equal(s.matched,false);
 }
});
test('gold and class equipment preview different themes without implying inventory',()=>{
 const gear=scene(3,{focus:'equipment'}),gold=scene(3,{focus:'gold'});
 assert.notEqual(gear.key,gold.key);assert.match(gear.explanation,/actual inventory/);assert.equal(gold.subject,'Starting gold');
});
test('attributes and skills respond to the particular native option in focus',()=>{
 assert.notEqual(scene(5,{focus:'strength'}).key,scene(5,{focus:'dexterity'}).key);
 assert.notEqual(scene(6,{focus:'perception'}).key,scene(6,{focus:'stealth'}).key);
 assert.equal(scene(6,{focus:'perception'}).subject,'Perception');
});
test('stat-array keys and language previews have deterministic art',()=>{
 assert.notEqual(scene(4,{focus:'standard'}).key,scene(4,{focus:'balanced'}).key);
 assert.equal(scene(4,{focus:'minMax'}).key,'whirlwind');
 assert.notEqual(scene(7,{focus:'Sylvan'}).key,scene(7,{focus:'Infernal'}).key);
});
test('all chapter artwork has original bytes and individual source and license records',()=>{
 assert.equal(new Set(CHAPTER_ARTWORK.map(a=>a.id)).size,CHAPTER_ARTWORK.length);
 for(const art of CHAPTER_ARTWORK){
  const bytes=readFileSync(new URL('../'+art.image.replace('modules/heros-call/',''),import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),art.sha256);
  assert.ok(art.artist&&art.source.startsWith('https://')&&/^https:\/\/(creativecommons.org|www.gnu.org)\//.test(art.licenseUrl));
  assert.match(art.changes,/Original file unchanged/);
 }
 assert.ok(CHAPTER_ARTWORK.some(a=>a.license==='GPL-2.0-or-later'));
});

test('all built-in background choices have distinct illustrations',()=>{
 const pictures=Object.keys(backgrounds).map(name=>scene(2,{background:background(name)}));
 assert.equal(pictures.length,24);
 assert.equal(new Set(pictures.map(s=>s.image)).size,pictures.length);
});

test('all ancestry choices have distinct art and uncovered choices use their own symbols',()=>{
 const ancestries=JSON.parse(readFileSync(new URL('./fixtures/ancestry-identities.json',import.meta.url)));
 const pictures=Object.entries(ancestries).map(([name,image])=>scene(1,{ancestry:{name,image}}));
 assert.equal(pictures.length,24);
 assert.equal(new Set(pictures.map(s=>s.image)).size,24);
 assert.equal(pictures.filter(s=>s.art).length,15);
 for(const p of pictures) {
  assert.notEqual(p.key,'elven-forest');
  if(!p.art)assert.equal(p.kind,'emblem');
 }
});

test('paired ancestry choices never label a tree as a shroomling, a satyr as a minotaur, or ooze as a construct',()=>{
 const ancestries=JSON.parse(readFileSync(new URL('./fixtures/ancestry-identities.json',import.meta.url)));
 for(const [name,ancestryVariant] of [['Dryad/Shroomling','Shroomling'],['Minotaur/Beastfolk','Minotaur'],['Oozeling/Construct','Construct']]){
  const result=scene(1,{ancestry:{name,image:ancestries[name]},ancestryVariant});
  assert.equal(result.art,null);assert.match(result.note,new RegExp(ancestryVariant));
 }
});

test('native Nimble skill and language keys have relevant artwork',()=>{
 assert.equal(scene(6,{focus:'might'}).key,'warrior-study');
 assert.equal(scene(6,{focus:'naturecraft'}).key,'elven-forest');
 assert.equal(scene(7,{focus:'thievesCant'}).key,'scout');
 assert.equal(scene(7,{focus:'deepSpeak'}).key,'island-cove');
 assert.equal(scene(7,{focus:'deepSpeak'}).subject,'Deep Speak');
});
test('native translated option labels resolve through their CONFIG localization keys',()=>{
 const previous=globalThis.game;
 globalThis.game={i18n:{localize:key=>({'NIMBLE.skills.might':'Puissance','NIMBLE.languages.thievesCant':"Thieves’ Cant"})[key]||key}};
 try {
  const target=text=>({closest:()=>({querySelector:()=>({textContent:text}),textContent:text})});
  assert.equal(chapterFocusFromTarget(target('Puissance'),6,{skills:{might:'NIMBLE.skills.might'}}),'might');
  assert.equal(chapterFocusFromTarget(target("Thieves’ Cant"),7,{languages:{thievesCant:'NIMBLE.languages.thievesCant'}}),'thievesCant');
 } finally {globalThis.game=previous;}
});
