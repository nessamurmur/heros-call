import {ARTWORK} from './art-credits.mjs';
import {CHAPTER_ARTWORK} from './chapter-art.mjs';
import {CHAPTERS} from './model.mjs';
import {cardIdentity, resolveHero, selectedHero, selectedAncestry, selectedAncestryLabel} from './hero.mjs';

const byId=new Map([...ARTWORK,...CHAPTER_ARTWORK].map(a=>[a.id,a]));
const normalize=value=>String(value||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const focusLabel=value=>String(value).replace(/([a-z])([A-Z])/g,'$1 $2').replace(/\b[a-z]/g,c=>c.toUpperCase());
const ancestryArt={
 Human:'innkeeper',Elf:'sitting-elf',Dwarf:'dwarf-explorer',Orc:'orc-warrior',Celestial:'shapeshift',
 Birdfolk:'feathered-traveller',Dragonborn:'dragon-adventurer','Dryad/Shroomling':'living-tree',
 Goblin:'goblin-salvager',Kobold:'scaled-augur','Minotaur/Beastfolk':'satyr',
 'Oozeling/Construct':'living-ooze',Planarbeing:'planar-jinn',Ratfolk:'rat-knight',Wyrdling:'living-flame'
};
const ancestryCaptions={
 'Dryad/Shroomling':'Dryad example · a living tree',
 'Minotaur/Beastfolk':'Beastfolk example · a satyr',
 'Oozeling/Construct':'Oozeling example · living mud',
 Kobold:'Kobold inspiration · a small reptilian spellcaster',
 Planarbeing:'Planarbeing inspiration · a jinn',
 Wyrdling:'Wyrdling inspiration · living elemental magic'
};
// Built-in identity checks prevent a homebrew option with the same name from
// being silently presented as an official ancestry/background.
const ANCESTRIES = {
  "Dwarf": "icons/commodities/stone/boulder-grey-blue.webp",
  "Elf": "icons/consumables/plants/dried-leaf-stem-twig-green.webp",
  "Gnome": "icons/commodities/tech/cog-brass.webp",
  "Halfling": "icons/sundries/gaming/dice-runed-tan.webp",
  "Human": "icons/environment/people/commoner.webp",
  "Birdfolk": "icons/creatures/birds/corvid-call-sound-blue.webp",
  "Bunbun": "icons/creatures/mammals/rabbit-movement-glowing-green.webp",
  "Celestial": "icons/magic/holy/angel-winged-humanoid-blue.webp",
  "Changeling": "icons/magic/control/silhouette-hold-change-green.webp",
  "Crystalborn": "icons/commodities/gems/gem-cluster-purple.webp",
  "Dragonborn": "icons/creatures/reptiles/dragon-horned-blue.webp",
  "Dryad/Shroomling": "icons/commodities/flowers/flowers-cherry-white.webp",
  "Fiendkin": "icons/creatures/unholy/demon-horned-winged-laughing.webp",
  "Goblin": "icons/commodities/biological/hand-clawed-green.webp",
  "Half-Giant": "icons/magic/control/buff-strength-muscle-damage-orange.webp",
  "Kobold": "icons/creatures/claws/claw-scaled-red.webp",
  "Minotaur/Beastfolk": "icons/creatures/abilities/bull-head-horns-glowing.webp",
  "Oozeling/Construct": "icons/creatures/slimes/slime-movement-dripping-pseudopods-green.webp",
  "Orc": "icons/equipment/shield/heater-wooden-brown-axe.webp",
  "Planarbeing": "icons/creatures/magical/construct-golem-stone-blue.webp",
  "Ratfolk": "icons/creatures/mammals/rodent-rat-diseaed-gray.webp",
  "Stoatling": "icons/commodities/claws/claw-bear-brown.webp",
  "Turtlefolk": "icons/creatures/reptiles/turtle-shell-glowing-green.webp",
  "Wyrdling": "icons/creatures/magical/spirit-mischief-fire-blue.webp"
};
const BACKGROUNDS = {
  "Academy Dropout": "icons/magic/light/projectile-beam-yellow.webp",
  "Accidental Acrobat": "icons/creatures/amphibians/frog-water-teal.webp",
  "Acrobat": "icons/skills/movement/feet-winged-boots-brown.webp",
  "At Home Underground": "icons/commodities/stone/stone-pile-grey.webp",
  "Back Out of Retirement": "icons/environment/settlement/blacksmith.webp",
  "Bumblewise": "icons/creatures/eyes/human-single-blue.webp",
  "Devoted Protector": "icons/equipment/shield/heater-wooden-sword-green.webp",
  "Ear to the Ground": "icons/sundries/documents/envelope-sealed-red-white.webp",
  "Fearless": "icons/environment/people/charge.webp",
  "Fey Touched": "icons/magic/light/hand-sparks-smoke-green.webp",
  "(Former) Con Artist": "icons/sundries/documents/document-sealed-brown-red.webp",
  "Haunted Past": "icons/creatures/magical/spirit-poison-smoke-green.webp",
  "History Buff": "icons/sundries/books/book-open-red.webp",
  "Home at Sea": "icons/creatures/fish/fish-bluefin-yellow-blue.webp",
  "Made a BAD Choice": "icons/commodities/currency/coins-plain-stack-gold-yellow.webp",
  "Raised by Goblins": "icons/commodities/bones/bones-stack-yellow.webp",
  "(Secretly) Undead": "icons/magic/death/hand-undead-skeleton-fire-pink.webp",
  "So Dumb I'm Smart Sometimes": "icons/commodities/biological/organ-brain-pink.webp",
  "Survivalist": "icons/consumables/vegetable/root-potato-sprout-brown.webp",
  "Taste for the Finer Things": "icons/containers/kitchenware/goblet-gold-red.webp",
  "Tradesman/Artisan": "icons/skills/trades/construction-carpentry-hammer.webp",
  "What? I've Been Around": "icons/skills/social/diplomacy-handshake.webp",
  "Wild One": "icons/commodities/flowers/blooms-pink.webp",
  "Wily Underdog": "icons/skills/melee/strike-sword-stabbed-brown.webp"
};
const backgroundArt={
 'Academy Dropout':'potion-making','Accidental Acrobat':'jump',Acrobat:'acrobat-practice',
 'At Home Underground':'gold-vein','Back Out of Retirement':'mentor',Bumblewise:'nourished-flower',
 'Devoted Protector':'knight','Ear to the Ground':'street-scout',Fearless:'conscript','Fey Touched':'fairy-druid',
 '(Former) Con Artist':'cutpurse','Haunted Past':'restless-spirits','History Buff':'scroll-raider',
 'Home at Sea':'island-cove','Made a BAD Choice':'condemned','Raised by Goblins':'goblin-wind',
 '(Secretly) Undead':'wight',"So Dumb I'm Smart Sometimes":'clockwork',Survivalist:'medical-attention',
 'Taste for the Finer Things':'aristocrat','Tradesman/Artisan':'smith',
 "What? I've Been Around":'explorer','Wild One':'botanist','Wily Underdog':'elven-coat'
};
const attributeArt={strength:'warrior-study',dexterity:'jump',intelligence:'scroll-raider',will:'squad-leader'};
const skillArt={acrobatics:'acrobat-practice',arcana:'female-elf-caster',athletics:'jump',examination:'scroll-raider',
 finesse:'dryads-flute',influence:'squad-leader',insight:'mentor',intimidation:'warrior-study',lore:'scroll-raider',
 might:'warrior-study',naturecraft:'elven-forest',nature:'elven-forest',perception:'falconer',stealth:'scout',survival:'medical-attention'};
const languageArt={common:'scroll-raider',elvish:'dryads-flute',dwarvish:'dwarf-berserker',draconic:'wizard-tower',
 goblin:'elven-forest',infernal:'skull-lodge',orcish:'orc-songweaver',primordial:'whirlwind',sylvan:'fairy-druid',celestial:'shapeshift',thievescant:'scout','thieves cant':'scout','thieves s cant':'scout',deepspeak:'island-cove','deep speak':'island-cove'};
const chapterDefaults={1:'sitting-elf',2:'wizard-tower',3:'armory',4:'whirlwind',5:'clockwork',6:'jump',7:'scroll-raider'};
function known(identity,index){
 const path=String(identity?.image||'').split(/[?#]/)[0];
 const expected=index[identity?.name];
 return !!expected && (path===expected || path.endsWith('/'+expected));
}

/** Pure, deterministic art direction. Illustration never changes game rules. */
export function resolveChapterArt({chapter,calling,ancestry,ancestryVariant,background,focus,hero}={}) {
 hero ??= resolveHero(calling,ancestry);
 if(chapter===0 || chapter===8) return {...hero,chapterArt:false};
 let id=chapterDefaults[chapter]||'sitting-elf';
 let subject=CHAPTERS[chapter]?.label||'Your story';
 let specific=false;
 const key=normalize(focus);
 if(chapter===1 && ancestry) {
   subject=ancestry.name;
   const unsupportedVariant=
     (ancestry.name==='Dryad/Shroomling' && ancestryVariant==='Shroomling') ||
     (ancestry.name==='Minotaur/Beastfolk' && ancestryVariant==='Minotaur') ||
     (ancestry.name==='Oozeling/Construct' && ancestryVariant==='Construct');
   if(known(ancestry,ANCESTRIES) && ancestryArt[ancestry.name] && !unsupportedVariant) {
     id=ancestryArt[ancestry.name];specific=true;
   } else {
     // Until a character portrait is verified, show this option's own symbol.
     // Never give unrelated ancestries a shared woodland or another people.
     const label=ancestryVariant || ancestry.name;
     return {art:null,key:`ancestry-symbol:${label}:${ancestry.image}`,image:ancestry.image,
       fallback:'modules/heros-call/assets/heros-call.svg',label,
       note:`Ancestry symbol · ${label}`,chapterArt:true,subject:label,kind:'emblem',
       matched:false,preview:!!focus,fallbackNote:'Ancestry symbol unavailable',
       explanation:'The symbol from your installed ancestry. A curated character illustration is not available for this option.'};
   }
 } else if(chapter===2 && background) {
   subject=background.name;
   if(known(background,BACKGROUNDS)) {id=backgroundArt[background.name]||id;specific=true;}
 } else if(chapter===3) {
   subject=key==='gold'?'Starting gold':key==='equipment'?'Class equipment':'Arms for the road';
   if(key==='gold')id='scroll-raider';
   else id='armory';
 } else if(chapter===4 && key) {
   id=({standard:'squad-leader',balanced:'reflection','min max':'whirlwind',minmax:'whirlwind'})[key]||id;
   subject=focusLabel(focus);
 } else if(chapter===5 && key) {id=attributeArt[key]||id;subject=focusLabel(focus);}
 else if(chapter===6 && key) {id=skillArt[key]||id;subject=focusLabel(focus);}
 else if(chapter===7 && key) {id=languageArt[key]||id;subject=focusLabel(focus);}
 const art=byId.get(id);
 return {
   art,key:id,image:art.image,fallback:'modules/heros-call/assets/heros-call.svg',label:art.subject,
   note:chapter===1&&specific?(ancestryCaptions[ancestry.name]||`Ancestry illustration · ${subject}`):`Chapter illustration · ${subject}`,
   chapterArt:true,subject,kind:art.kind||'vignette',matched:false,preview:!!focus,
   fallbackNote:'Chapter illustration unavailable',
   explanation:chapter===3?'Equipment theme; use the choices for your actual inventory.':'An illustration of this chapter, not a literal portrait of your hero.'
 };
}

export function chapterArtFor(state) {
 const calling=cardIdentity(state.body.querySelector('[id$="-stage-0"] .nimble-card[data-card-option="non-clickable"]'));
 const ancestry=state.chapter===1 && state.previewAncestry?.isConnected
   ? cardIdentity(state.previewAncestry):selectedAncestry(state);
 const background=state.chapter===2 && state.previewBackground?.isConnected
   ? cardIdentity(state.previewBackground):cardIdentity(state.body.querySelector('[id$="-stage-2"] .nimble-card[data-card-option="non-clickable"]'));
 const ancestryVariant=state.chapter===1 && !state.previewAncestry?.isConnected ? selectedAncestryLabel(state) : undefined;
 return resolveChapterArt({chapter:state.chapter,calling,ancestry,ancestryVariant,background,focus:state.artFocus?.get(state.chapter),hero:selectedHero(state)});
}

function configuredKey(label,choices) {
 const normalized=normalize(label);
 const pair=Object.entries(choices||{}).find(([key,value])=>{
   const localized=typeof value==='string' ? globalThis.game?.i18n?.localize?.(value) : undefined;
   return normalize(localized||value)===normalized || normalize(key)===normalized;
 });
 return pair?.[0] || normalized;
}
/** Read only the native control the player is inspecting, without intercepting it. */
export function chapterFocusFromTarget(target,chapter,config={}) {
 if(!target?.closest) return null;
 if(chapter===3) {
   const option=target.closest('.starting-equipment-option');
   if(!option)return null;
   // Stable native icon classes; never infer a gold choice from translated text.
   if(option.querySelector('.fa-coins'))return 'gold';
   if(option.querySelector('.fa-box-open'))return 'equipment';
   return null;
 }
 if(chapter===4) {
   const title=target.closest('.stat-array')?.querySelector('h4')?.textContent.trim();
   return title?configuredKey(title,config.statArrays):null;
 }
 if(chapter===5) {
   const title=target.closest('.nimble-cc-ability-score')?.querySelector('h4')?.textContent.trim();
   return title?configuredKey(title,config.abilityScores):null;
 }
 if(chapter===6) {
   const title=target.closest('.nimble-skill')?.querySelector('.nimble-skill__name')?.textContent.trim();
   return title?configuredKey(title,config.skills):null;
 }
 if(chapter===7) {
   const title=target.closest('.nimble-tag-group__option-button,.nimble-language-tag')?.textContent.trim();
   return title?configuredKey(title,config.languages):null;
 }
 return null;
}
