import {copy, htmlCopy} from './copy.mjs';
import {CHAPTERS, groupForSection} from './model.mjs';
import {selectedHero} from './hero.mjs';
import {createControls} from './controls.mjs';

const node = (tag, className, value) => {
  const element = document.createElement(tag);
  element.className = className;
  if (value) element.textContent = value;
  return element;
};

// This is a view of native choices. Only a deliberate confirmation invokes the
// original card; optional branches and all complex controls remain Svelte-owned.
export function createJourney(state, {previewCard, openRules, navigate}) {
  const intro = node('header', 'heros-call-journey-intro');
  intro.innerHTML = '<span class="heros-call-eyebrow"></span><h1 class="heros-call-journey-title" tabindex="-1"></h1><p></p>';
  const element = node('section', 'heros-call-choices');
  element.setAttribute('aria-label', copy('ui.journey.regionLabel'));
  const copyPanel = node('div', 'heros-call-choice-copy');
  copyPanel.innerHTML = `<h2 class="heros-call-choice-name"></h2><div class="heros-call-choice-description"></div><button type="button" class="heros-call-choice-rules">${htmlCopy('ui.journey.readDetails')}</button>`;
  const picker = node('div', 'heros-call-choice-picker');
  const label = node('div', 'heros-call-choice-label');
  const roster = node('div', 'heros-call-choice-roster');
  roster.setAttribute('role','group');
  picker.append(label, roster); element.append(copyPanel, picker);
  const footer = node('footer', 'heros-call-journey-footer');
  const back = node('button', 'heros-call-journey-back', copy('ui.journey.previous')); back.type='button';
  const hint = node('p','heros-call-journey-hint');hint.setAttribute('role','status');
  const action = node('button','heros-call-journey-confirm'); action.type='button';
  footer.append(back, hint, action);
  let cards=[], current, nativeConfirm, previousChapter=-1, previousBrowse=false, retryTimer, ticket=0, alive=true;
  const selected = new Map();
  const controls=createControls(state,()=>sync());
  back.addEventListener('click',()=>navigate(Math.max(0,state.chapter-1)));
  copyPanel.querySelector('button').addEventListener('click',()=>{if(current?.card.isConnected) openRules(current.card);});
  action.addEventListener('click',()=>{
    if(action.disabled) return;
    if(state.chapter<state.nativeStage) {navigate(state.nativeStage);return;}
    const source = !element.hidden ? current?.card : nativeConfirm;
    if(!source?.isConnected || source.disabled) return;
    action.disabled=true;
    controls.commit(source);
    clearTimeout(retryTimer);
    retryTimer=setTimeout(()=>{if(alive) sync();},1500);
  });

  async function select(entry) {
    current=entry;
    selected.set(state.chapter, entry.card);
    const request=++ticket;
    const title=entry.card.querySelector('.nimble-card__title')?.textContent.trim() || copy('ui.journey.fallbackName');
    copyPanel.querySelector('h2').textContent=title;
    const description=copyPanel.querySelector('.heros-call-choice-description');
    description.textContent=copy('ui.details.loading');
    for(const item of cards) item.button.setAttribute('aria-pressed',String(item===entry));
    action.setAttribute('aria-label',copy('ui.common.chooseAndContinue', {title}));
    if(state.chapter===1) state.previewAncestry=entry.card;
    if(state.chapter===2) state.previewBackground=entry.card;
    state.refreshArt();
    await previewCard(state,entry.card);
    if(!alive || request!==ticket || element.hidden) return;
    description.replaceChildren(...[...state.aside.querySelector('.heros-call-detail-body').childNodes].map(n=>n.cloneNode(true)));
    description.scrollTop=0;
  }

  function sync() {
    const active=!state.root.classList.contains('heros-call-calling-active');
    const chapter=CHAPTERS[state.chapter];
    controls.sync();
    state.root.classList.toggle('heros-call-journey-active',active);
    state.root.dataset.herosCallChapter=String(state.chapter);
    intro.hidden=footer.hidden=!active;
    intro.querySelector('span').textContent=copy('ui.journey.chapterCount', {number: String(state.chapter+1).padStart(2,'0'), total: String(CHAPTERS.length).padStart(2,'0'), label: chapter.label.toUpperCase()});
    intro.querySelector('h1').textContent=chapter.title;
    intro.querySelector('p').textContent=chapter.description;
    const section = state.body.querySelector(`[id$="-stage-${state.chapter===1?'1a':'2'}"]`);
    const candidates = [1,2].includes(state.chapter) ? [...(section?.querySelectorAll('.nimble-document-list button.nimble-card') || [])] : [];
    // If unfamiliar content appears, expose native controls instead of covering it.
    const unknown = [...state.body.children].some(s=>s.tagName==='SECTION' && groupForSection(s.id)===null);
    const browse=active && candidates.length>0 && !unknown;
    state.root.classList.toggle('heros-call-choice-active',browse);
    element.hidden=!browse;
    if(browse) {
      label.textContent=state.chapter===1 ? copy('ui.journey.ancestryCount', {count: candidates.length}) : copy('ui.journey.backgroundCount', {count: candidates.length});
      roster.setAttribute('aria-label',state.chapter===1?copy('ui.journey.ancestryPreviews'):copy('ui.journey.backgroundPreviews'));
      if(cards.length!==candidates.length || cards.some((e,i)=>e.card!==candidates[i])) {
        roster.replaceChildren();
        cards=candidates.map(card=>{
          const button=node('button','heros-call-origin-choice');button.type='button';
          const title=card.querySelector('.nimble-card__title')?.textContent.trim() || copy('ui.journey.fallbackChoice');
          const img=node('img','');img.src=card.querySelector('img')?.getAttribute('src') || '';img.alt='';
          button.append(img,node('span','',title));
          const source=card.querySelector('.nimble-card__source-label')?.textContent.trim();
          button.setAttribute('aria-label',source ? copy('ui.common.previewWithSource', {title, source}) : copy('ui.common.preview', {title}));
          const entry={card,button};
          button.addEventListener('click',()=>select(entry));
          button.addEventListener('focus',()=>select(entry));
          button.addEventListener('keydown',event=>{
            const index=cards.indexOf(entry);
            const next={ArrowRight:(index+1)%cards.length,ArrowLeft:(index+cards.length-1)%cards.length,Home:0,End:cards.length-1}[event.key];
            if(next!==undefined){event.preventDefault();cards[next].button.focus();}
          });
          roster.append(button);return entry;
        });
        const artAncestry=selectedHero(state).art?.ancestry;
        select(cards.find(e=>e.card===selected.get(state.chapter)) || cards.find(e=>state.chapter===1 && e.card.querySelector('.nimble-card__title')?.textContent.trim()===artAncestry) || cards[0]);
      } else if(previousChapter!==state.chapter && current) select(current);
    }
    state.body.querySelectorAll('.heros-call-footer-source').forEach(b=>b.classList.remove('heros-call-footer-source'));
    nativeConfirm=null;
    const live=active && state.chapter===state.nativeStage;
    const picking=live && [3,4].includes(state.chapter);
    if(live && !browse) {
      if(picking)nativeConfirm=controls.preview;
      else {
        const buttons=[...state.body.querySelectorAll('section button[data-button-variant="basic"]')].filter(b=>groupForSection(b.closest('section[id]')?.id)===state.chapter);
        if(buttons.length===1) {nativeConfirm=buttons[0];nativeConfirm.classList.add('heros-call-footer-source');}
      }
    }
    back.hidden=state.chapter===0;
    let hintText=state.chapter===8 && state.nameInput.value.trim()?copy('ui.journey.ready'):chapter.hint;
    if(picking)hintText=state.chapter===3?copy('ui.journey.equipmentHint'):copy('ui.journey.potentialHint');
    if(state.chapter===5 && controls.modifier)hintText=copy('ui.journey.assignHint', {modifier: controls.modifier.textContent.trim()});
    if(state.chapter===6 && live){
      const heading=state.body.querySelector('section[id$="-stage-6"] h3')?.textContent.trim();
      if(heading)hintText=nativeConfirm?copy('ui.journey.trainingReady'):heading.replace(/^Step \d+\.\s*/i,'');
    }
    if(state.chapter===7 && live && nativeConfirm)hintText=copy('ui.journey.languagesReady');
    if(state.chapter===1 && live && !browse){
      const bonus=state.body.querySelector('[id$="-stage-1b"] .nimble-ancestry-bonus-actions');
      intro.querySelector('h1').textContent=bonus?copy('ui.journey.ancestryGiftTitle'):copy('ui.journey.ancestryShapeTitle');
      intro.querySelector('p').textContent=bonus?copy('ui.journey.ancestryGiftDescription'):copy('ui.journey.ancestryShapeDescription');
    }
    if(hint.textContent!==hintText)hint.textContent=hintText;
    action.hidden=!active || state.chapter===8;
    action.disabled=state.submitting || (state.chapter===state.nativeStage && !browse && (!nativeConfirm||nativeConfirm.disabled));
    if(state.chapter<state.nativeStage) action.textContent=copy('ui.journey.return');
    else if(browse) action.textContent=state.chapter===1?copy('ui.journey.chooseAncestry'):copy('ui.journey.chooseBackground');
    else if(picking) action.textContent=state.chapter===3?(nativeConfirm?.querySelector('.fa-coins')?copy('ui.journey.takeGold'):copy('ui.journey.takeEquipment')):copy('ui.journey.choosePotential');
    else if(nativeConfirm) action.textContent=nativeConfirm.textContent.trim()+' →';
    else action.textContent=({5:copy('ui.journey.confirmAttributes'),6:copy('ui.journey.confirmTraining'),7:copy('ui.journey.confirmLanguages')})[state.chapter] || copy('ui.journey.completeChoices');
    action.setAttribute('aria-label',browse?copy('ui.common.chooseAndContinue', {title: current?.card.querySelector('.nimble-card__title')?.textContent.trim()||copy('ui.common.thisOption')}):action.textContent.replace(/ →$/,''));
    if(active && (previousChapter!==state.chapter || previousBrowse!==browse)) {
      state.body.scrollTop=0;
      // Keep keyboard focus in the new chapter when the native button disappears.
      intro.querySelector('h1').focus({preventScroll:true});
    }
    previousChapter=state.chapter;
    previousBrowse=browse;
  }
  return {intro,element,footer,sync,destroy(){
    alive=false;ticket++;clearTimeout(retryTimer);controls.destroy();intro.remove();element.remove();footer.remove();
    state.body.querySelectorAll('.heros-call-footer-source').forEach(b=>b.classList.remove('heros-call-footer-source'));
    state.root.classList.remove('heros-call-journey-active','heros-call-choice-active');delete state.root.dataset.herosCallChapter;
  }};
}
