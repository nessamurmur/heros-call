import {copy, htmlCopy, COPY} from './copy.mjs';
import {createHero, resolveHero, cardIdentity, callingKey, selectedAncestry} from './hero.mjs';

// Presentation copy only. The native creator owns all rules and selections.
// Calling art is illustrative; the native builder owns all character rules.
const CALLINGS = COPY.callings;

function node(tag, className, value) {
  const element = document.createElement(tag);
  element.className = className;
  if (value) element.textContent = value;
  return element;
}

function brief(card) {
  const description = card.querySelector('.nimble-card__description')?.textContent.trim() || copy('ui.calling.fallbackDescription');
  const sentences = description.match(/[^.!?]+[.!?]+/g)?.slice(0,2).join(' ').trim() || description;
  return sentences.length > 250 ? `${sentences.slice(0,247).replace(/\s+\S*$/, '')}…` : sentences;
}

export function createCalling(state, {openRules, openCredits}) {
  const backdrop = node('div','heros-call-scene');
  backdrop.setAttribute('aria-hidden','true');

  const element = node('section','heros-call-calling');
  element.setAttribute('aria-label',copy('ui.calling.title'));
  const copyPanel = node('div','heros-call-calling-copy');
  copyPanel.innerHTML = `<span class="heros-call-calling-eyebrow">${htmlCopy('ui.calling.eyebrow')}</span><p class="heros-call-calling-prompt">${htmlCopy('ui.calling.title')}</p><h1 class="heros-call-calling-name"></h1><p class="heros-call-calling-motto"></p><div class="heros-call-calling-rule" aria-hidden="true"></div><p class="heros-call-calling-description"></p><p class="heros-call-calling-theme"></p><div class="heros-call-calling-complexity"></div><button type="button" class="heros-call-calling-rules">${htmlCopy('ui.calling.explore')} <span aria-hidden="true">↗</span></button>`;
  copyPanel.querySelector('button').addEventListener('click', () => {
    if (current?.card.isConnected) openRules(current.card);
  });
  const hero = createHero({openCredits});
  const rosterPanel = node('div','heros-call-roster-panel');
  const roster = node('div','heros-call-roster');
  roster.setAttribute('role','group'); roster.setAttribute('aria-label',copy('ui.calling.rosterLabel'));
  rosterPanel.append(roster);
  const footer = node('footer','heros-call-calling-footer');
  const hint = node('p','heros-call-calling-hint',copy('ui.calling.hint'));
  const confirm = node('button','heros-call-calling-confirm');
  confirm.type='button'; confirm.innerHTML=`${htmlCopy('ui.calling.confirm')} <span aria-hidden="true">→</span>`;
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
  footer.append(hint,confirm); element.append(copyPanel,hero.element,rosterPanel,footer);
  let current, cards=[], retryTimer;

  function select(entry) {
    current=entry;
    const title=entry.card.querySelector('.nimble-card__title')?.textContent.trim() || copy('ui.calling.fallbackName');
    // Homebrew options keep their own native description, including when their
    // name happens to match a bundled class.
    const key=callingKey(cardIdentity(entry.card));
    const flavor=CALLINGS[key];
    state.root.dataset.herosCallCalling=key || 'custom';
    hero.set(resolveHero(cardIdentity(entry.card), selectedAncestry(state)));
    const values={'.heros-call-calling-name':title,'.heros-call-calling-motto':flavor?.motto || copy('ui.calling.fallbackMotto'),'.heros-call-calling-description':flavor?.copy || brief(entry.card),'.heros-call-calling-theme':flavor?.theme || copy('ui.calling.fallbackTheme')};
    for(const [selector,value] of Object.entries(values)) copyPanel.querySelector(selector).textContent=value;
    const complexity=entry.card.querySelector('.nimble-card__complexity');
    const diamonds=complexity?.querySelectorAll('.fa-diamond').length || (complexity?.textContent.match(/◆/g)||[]).length;
    copyPanel.querySelector('.heros-call-calling-complexity').textContent=copy('ui.calling.complexity', {rating: diamonds ? '◆'.repeat(diamonds)+'◇'.repeat(Math.max(0,3-diamonds)) : '—'});
    confirm.setAttribute('aria-label',copy('ui.common.chooseAndContinue', {title}));
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
        const title=card.querySelector('.nimble-card__title')?.textContent.trim() || copy('ui.calling.fallbackClass');
        const image=node('img',''); image.src=card.querySelector('img')?.getAttribute('src') || ''; image.alt='';
        const label=node('span','',title); button.append(image,label);
        const source=card.querySelector('.nimble-card__source-label')?.textContent.trim();
        button.setAttribute('aria-label',source ? copy('ui.common.previewWithSource', {title, source}) : copy('ui.common.preview', {title}));
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
