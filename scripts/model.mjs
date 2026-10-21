import chapters from '../content/chapters.mjs';

// Keep native stage order independent of the order in the editable file.
export const CHAPTERS = ["calling", "ancestry", "background", "equipment", "potential", "attributes", "skills", "languages", "begin"].map(key => chapters[key]);

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
