import {copy} from './copy.mjs';
import {CHAPTERS,groupForSection} from './model.mjs';
import {selectedAncestryLabel} from './hero.mjs';
const text=node=>node?.textContent.trim()||'';
const make=(tag,cls,value)=>{const n=document.createElement(tag);n.className=cls;if(value)n.textContent=value;return n;};
export function createReview(state,navigate){
  const element=make('section','heros-call-final-review');element.setAttribute('aria-label',copy('ui.review.regionLabel'));
  const toolbar=make('div','heros-call-review-toolbar');
  const toggle=make('button','heros-call-text-button',copy('ui.review.readDetails'));toggle.type='button';toggle.setAttribute('aria-expanded','false');
  const content=make('div','heros-call-review-cards');toolbar.append(toggle);element.append(toolbar,content);
  let details=false,signature='',wasActive=false;
  toggle.addEventListener('click',()=>{details=!details;sync();});
  const section=id=>state.body.querySelector(`section[id$="-stage-${id}"]`);
  const edit=(source,chapter)=>{navigate(chapter);if(source?.isConnected)source.click();};
  function card(label,value,stage,extra=''){
    const sectionNode=section(stage),source=sectionNode?.querySelector('header button[data-button-variant="icon"]');
    const row=make('article','heros-call-summary-card');
    const h=make('header','');h.append(make('span','heros-call-eyebrow',label));
    if(source){const b=make('button','heros-call-summary-edit',copy('ui.review.change'));b.type='button';b.setAttribute('aria-label',copy('ui.review.changeLabel', {label: label.toLowerCase()}));b.addEventListener('click',()=>edit(source,groupForSection(sectionNode.id)));h.append(b);}
    row.append(h,make('p','heros-call-summary-value',value||copy('ui.review.none')));if(extra)row.append(make('p','heros-call-summary-extra',extra));content.append(row);return row;
  }
  function sync(){
    const active=state.chapter===8;
    if(!active){details=false;signature='';}
    const unknown=[...state.body.children].some(s=>s.tagName==='SECTION'&&groupForSection(s.id)===null);
    if(unknown)details=true;toggle.hidden=unknown;
    element.hidden=!active;
    state.root.classList.toggle('heros-call-summary-active',active&&!details);
    state.root.classList.toggle('heros-call-details-active',active&&details);
    content.hidden=details;
    toggle.textContent=details?copy('ui.review.back'):copy('ui.review.readDetails');toggle.setAttribute('aria-expanded',String(details));
    if(!active){wasActive=false;return;}
    if(!wasActive)state.nameInput.focus({preventScroll:true});wasActive=true;
    const current=state.body.textContent;
    if(current===signature)return;signature=current;content.replaceChildren();
    const title=id=>text(section(id)?.querySelector('.nimble-card[data-card-option="non-clickable"] .nimble-card__title'));
    card(CHAPTERS[0].label,title('0'),'0');
    card(CHAPTERS[1].label,selectedAncestryLabel(state),'1a',title('1b')?copy('ui.review.ancestryGift', {gift: title('1b')}):'');
    card(CHAPTERS[2].label,title('2'),'2');
    const equipment=section('3');
    card(CHAPTERS[3].label,equipment?.querySelector('.fa-coins')?copy('ui.review.gold'):copy('ui.review.equipment'),'3');
    const stats=card(CHAPTERS[5].label,text(section('4')?.querySelector('.stat-array h4')),'5');
    const values=make('dl','heros-call-summary-stats');
    section('5')?.querySelectorAll('.nimble-cc-ability-score').forEach(s=>{const cell=make('div','');cell.append(make('dt','',text(s.querySelector('h4'))),make('dd','',text(s.querySelector('.nimble-cc-ability-score__value'))));values.append(cell);});stats.append(values);
    const trained=[...(section('6')?.querySelectorAll('.nimble-skill')||[])].map(node=>({node,points:node.querySelectorAll('.nimble-skill-point-star__icon:not(.nimble-skill-point-star__icon--inactive)').length})).filter(s=>s.points>0);
    const skills=card(copy('ui.review.training'),copy('ui.review.pointsInvested', {count: trained.reduce((n,s)=>n+s.points,0)}),'6');
    const list=make('dl','heros-call-summary-skills');trained.forEach(({node:s,points})=>{const row=make('div','');row.append(make('dt','',`${text(s.querySelector('.nimble-skill__name'))} · ${points}`),make('dd','',text(s.querySelector('.nimble-skill__value'))));list.append(row);});skills.append(list);
    const languages=[...(section('7')?.querySelectorAll('.nimble-language-tag,.nimble-tag')||[])].map(text);
    const lang=card(CHAPTERS[7].label,languages.length?languages.join(' · '):text(section('7')?.querySelector('.nimble-language-tags'))||copy('ui.review.defaultLanguage'),'7');lang.classList.add('heros-call-summary-wide');
  }
  return {element,sync,destroy(){element.remove();state.root.classList.remove('heros-call-summary-active','heros-call-details-active');}};
}
