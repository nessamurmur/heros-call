export const CHAPTERS = [
  {label:'Calling',title:'Choose your calling',description:'Adventure calls. How will you face the unknown?'},
  {label:'Ancestry',title:'Remember your roots',description:'Choose the people, gifts, and traditions that shaped you.'},
  {label:'Background',title:'A life before adventure',description:'Every hero brings a story. What is yours?'},
  {label:'Equipment',title:'Prepare for the road',description:'Take what you need. Leave room for what you will find.'},
  {label:'Potential',title:'Discover your potential',description:'Choose the balance of strengths that defines your hero.'},
  {label:'Attributes',title:'Make your strengths known',description:'Assign your abilities. Decide where your talent shines.'},
  {label:'Skills',title:'Show what you know',description:'Turn experience into instinct. Choose your practiced skills.'},
  {label:'Languages',title:'Find your voice',description:'The world is full of stories. Choose which you can hear.'},
  {label:'Begin',title:'A legend in the making',description:'Review your choices, give your hero a name, and begin.'}
];

export function stageFromClass(value = '') {
  const match=String(value).match(/nimble-progress-bar--stage-(\d+)/);
  return Math.min(8,Math.max(0,Number(match?.[1] ?? 0)));
}
export function chapterFromProgress(value, backgroundSpellsActive = false) {
  const stage = stageFromClass(value);
  // Nimble reuses SPELLS (0c) for both class and background spell choices.
  return stage === 0 && backgroundSpellsActive ? 2 : stage;
}
export function groupForSection(id = '') {
  if(id.endsWith('-background-spells')) return 2;
  const match=id.match(/-stage-(\d+)[a-z]*$/);
  if(!match) return null;
  const group=Number(match[1]);
  return group >= 0 && group <= 8 ? group : null;
}
