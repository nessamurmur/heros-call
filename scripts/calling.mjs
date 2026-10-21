import {createHero, resolveHero, cardIdentity, callingKey, selectedAncestry} from './hero.mjs';

// Presentation copy only. The native creator owns all rules and selections.
// Calling art is illustrative; the native builder owns all character rules.
const CALLINGS = {
  berserker: {motto:'Meet the world with fury.',theme:'Rage · Resilience · Relentless strength',copy:'Throw yourself into the heart of battle. Turn mounting rage into overwhelming strength, and keep fighting when others would fall.'},
  commander: {motto:'Give them someone to follow.',theme:'Leadership · Tactics · Martial mastery',copy:'Stand at the centre of the fight and bring out the best in your companions. A sharp mind can be as decisive as a sharpened blade.'},
  hunter: {motto:'Answer the call of the wild.',theme:'Instinct · Precision · The hunt',copy:'Walk the old paths, read the signs, and find your quarry. The wild rewards patience, a steady hand, and respect for its creatures.'},
  mage: {motto:'Reach for the extraordinary.',theme:'Study · Elemental power · Spellcraft',copy:'Discover the power woven through all things. Through study and practice, shape the elements into a magic that is your own.'},
  oathsworn: {motto:'Become the promise you made.',theme:'Devotion · Protection · Radiant strength',copy:'Let your oath guide your blade. Stand beside your companions, confront evil, and draw strength from a purpose greater than yourself.'},
  shadowmancer: {motto:'Some doors are best left open.',theme:'Secrets · Forbidden power · Cunning',copy:'Reach into the dark for power others fear to touch. Ancient horrors have much to offer those clever enough to take it.'},
  shepherd: {motto:'Be a light for wandering souls.',theme:'Restoration · Guidance · Life and death',copy:'Mend what is broken and offer courage to the weary. Guide your companions through the uncertain space between life and what lies beyond.'},
  songweaver: {motto:'Make the world feel something.',theme:'Inspiration · Wit · Enchantment',copy:'Turn a spark of inspiration into something extraordinary. Rouse your companions and sway your enemies with wit, charm, and art.'},
  stormshifter: {motto:'The storm has a wild heart.',theme:'Storm · Fang · The living wild',copy:'Carry the power of storm and beast. Guard the ancient wilds and answer those who threaten them with nature’s untamed strength.'},
  'the-cheat': {motto:'There is always another way in.',theme:'Stealth · Ingenuity · A well-placed dagger',copy:'Trust your quick hands and quicker thinking. Slip past danger, find an opening, and turn an unfair situation to your advantage.'},
  zephyr: {motto:'Move like the wind.',theme:'Momentum · Discipline · Unrelenting speed',copy:'Make motion your weapon and your shield. Hone body and mind until each step flows into the next, too swift for your foes to follow.'}
};

function node(tag, className, value) {
  const element = document.createElement(tag);
  element.className = className;
  if (value) element.textContent = value;
  return element;
}

function brief(card) {
  const description = card.querySelector('.nimble-card__description')?.textContent.trim() || 'Explore this calling and the possibilities it brings to your story.';
  const sentences = description.match(/[^.!?]+[.!?]+/g)?.slice(0,2).join(' ').trim() || description;
  return sentences.length > 250 ? `${sentences.slice(0,247).replace(/\s+\S*$/, '')}…` : sentences;
}

export function createCalling(state, {openRules, openCredits}) {
  const backdrop = node('div','heros-call-scene');
  backdrop.setAttribute('aria-hidden','true');

  const element = node('section','heros-call-calling');
  element.setAttribute('aria-label','Choose your calling');
  const copy = node('div','heros-call-calling-copy');
  copy.innerHTML = '<span class="heros-call-calling-eyebrow">THE FIRST CHAPTER</span><p class="heros-call-calling-prompt">Choose your calling</p><h1 class="heros-call-calling-name"></h1><p class="heros-call-calling-motto"></p><div class="heros-call-calling-rule" aria-hidden="true"></div><p class="heros-call-calling-description"></p><p class="heros-call-calling-theme"></p><div class="heros-call-calling-complexity"></div><button type="button" class="heros-call-calling-rules">Explore this class <span aria-hidden="true">↗</span></button>';
  copy.querySelector('button').addEventListener('click', () => {
    if (current?.card.isConnected) openRules(current.card);
  });
  const hero = createHero({openCredits});
  const rosterPanel = node('div','heros-call-roster-panel');
  const roster = node('div','heros-call-roster');
  roster.setAttribute('role','group'); roster.setAttribute('aria-label','Class previews');
  rosterPanel.append(roster);
  const footer = node('footer','heros-call-calling-footer');
  const hint = node('p','heros-call-calling-hint','Every legend begins with a choice.');
  const confirm = node('button','heros-call-calling-confirm');
  confirm.type='button'; confirm.innerHTML='Choose this calling <span aria-hidden="true">→</span>';
  confirm.addEventListener('click', () => {
    // Invoke the still-mounted native button, retaining Svelte's optional class
    // feature/spell branches and validation without copying the rules engine.
    if (!current?.card.isConnected || confirm.disabled) return;
    confirm.disabled=true;
    state.callingConfirmed=true;
    current.card.click();
    clearTimeout(retryTimer);
    retryTimer=setTimeout(() => {if(current?.card.isConnected) {confirm.disabled=false;state.callingConfirmed=false;}},1500);
  });
  footer.append(hint,confirm); element.append(copy,hero.element,rosterPanel,footer);
  let current, cards=[], retryTimer;

  function select(entry) {
    current=entry;
    const title=entry.card.querySelector('.nimble-card__title')?.textContent.trim() || 'Your calling';
    // Homebrew options keep their own native description, including when their
    // name happens to match a bundled class.
    const key=callingKey(cardIdentity(entry.card));
    const flavor=CALLINGS[key];
    state.root.dataset.herosCallCalling=key || 'custom';
    hero.set(resolveHero(cardIdentity(entry.card), selectedAncestry(state)));
    const values={'.heros-call-calling-name':title,'.heros-call-calling-motto':flavor?.motto || 'Write the beginning of your story.','.heros-call-calling-description':flavor?.copy || brief(entry.card),'.heros-call-calling-theme':flavor?.theme || 'A calling from your world'};
    for(const [selector,value] of Object.entries(values)) copy.querySelector(selector).textContent=value;
    const complexity=entry.card.querySelector('.nimble-card__complexity');
    const diamonds=complexity?.querySelectorAll('.fa-diamond').length || (complexity?.textContent.match(/◆/g)||[]).length;
    copy.querySelector('.heros-call-calling-complexity').textContent=diamonds ? `CLASS COMPLEXITY   ${'◆'.repeat(diamonds)}${'◇'.repeat(Math.max(0,3-diamonds))}` : 'CLASS COMPLEXITY   —';
    confirm.setAttribute('aria-label',`Choose ${title} and continue`);
    for(const button of roster.children) button.setAttribute('aria-pressed', String(button===entry.button));

  }

  function sync() {
    const nextCards=[...state.body.querySelectorAll('section[id$="-stage-0"] .nimble-document-list button.nimble-card')];
    const active=state.chapter===0 && nextCards.length>0;
    state.root.classList.toggle('heros-call-calling-active',active);
    element.hidden=!active;
    if(!active) return;
    if(cards.length!==nextCards.length || cards.some((entry,index)=>entry.card!==nextCards[index])) {
      const previousTitle=current?.card.querySelector('.nimble-card__title')?.textContent;
      roster.replaceChildren(); confirm.disabled=false;
      cards=nextCards.map(card => {
        const button=node('button','heros-call-class-choice'); button.type='button';
        const title=card.querySelector('.nimble-card__title')?.textContent.trim() || 'Class';
        const image=node('img',''); image.src=card.querySelector('img')?.getAttribute('src') || ''; image.alt='';
        const label=node('span','',title); button.append(image,label);
        const source=card.querySelector('.nimble-card__source-label')?.textContent.trim();
        button.setAttribute('aria-label',`Preview ${title}${source ? ` (${source})` : ''}`);
        button.title=title+(source ? ` · ${source}` : '');
        const entry={card,button};
        button.addEventListener('click',()=>select(entry));
        button.addEventListener('focus',()=>select(entry));
        button.addEventListener('keydown',event=>{
          const index=cards.indexOf(entry);
          const next={ArrowRight:(index+1)%cards.length,ArrowLeft:(index+cards.length-1)%cards.length,Home:0,End:cards.length-1}[event.key];
          if(next!==undefined){event.preventDefault();cards[next].button.focus();}
        });
        roster.append(button); return entry;
      });
      select(cards.find(entry=>entry.card.querySelector('.nimble-card__title')?.textContent===previousTitle) || cards.find(entry=>/\/mage\.webp$/.test(entry.card.querySelector('img')?.getAttribute('src') || '')) || cards[0]);
    } else if(current) select(current);
  }
  return {element,backdrop,sync,destroy(){clearTimeout(retryTimer);hero.destroy();element.remove();backdrop.remove();delete state.root.dataset.herosCallCalling;state.root.classList.remove('heros-call-calling-active');}};
}
