import {copy, htmlCopy, escapeHTML} from './copy.mjs';
import { createCalling } from './calling.mjs';
import {createJourney} from './journey.mjs';
import {createReview} from './review.mjs';
import {createHero, selectedAncestryLabel} from './hero.mjs';
import {ARTWORK} from './art-credits.mjs';
import {CHAPTER_ARTWORK} from './chapter-art.mjs';
import {chapterArtFor,chapterFocusFromTarget} from './scenes.mjs';
import { CHAPTERS, groupForSection, chapterFromProgress } from './model.mjs';

// Public package, settings, asset paths and actor flags share this namespace.
const ID = 'heros-call';
const BASE = `modules/${ID}`;
const instances = new Map();
const ALL_ARTWORK = [...ARTWORK,...CHAPTER_ARTWORK];
const PORTRAIT_ARTWORK = [...ARTWORK.filter(a=>a.portrait!==false),...CHAPTER_ARTWORK.filter(a=>a.portrait)];
const text = (parent, selector, value) => {
  const node = parent.querySelector(selector);
  if (node && node.textContent !== value) node.textContent = value;
};
const el = (tag, className, content) => {
  const node = document.createElement(tag);
  node.className = className;
  if (content) node.innerHTML = content;
  return node;
};

function modal(title, content, owner) {
  const dialog = el('dialog', 'heros-call-modal');
  dialog.setAttribute('aria-label', title);
  const header = el('header', 'heros-call-modal-header');
  const heading = el('h2', '');
  heading.textContent = title;
  const close = el('button', 'heros-call-text-button', `${htmlCopy('ui.common.close')} <span aria-hidden="true">×</span>`);
  close.type = 'button';
  close.addEventListener('click', () => dialog.close());
  header.append(heading, close);
  dialog.append(header, content);
  (owner || document.body).append(dialog);
  // Foundry binds Escape to dismiss the active application. Consume it here so
  // dismissing a portrait/credits modal cannot discard the character draft.
  dialog.addEventListener('keydown', event => {
    event.stopPropagation();
    if(event.key === 'Escape') {event.preventDefault();dialog.close();}
  });
  dialog.addEventListener('close', () => dialog.remove(), { once: true });
  dialog.showModal();
  return dialog;
}

export function showCredits(owner, artId) {
  const content = el('div', 'heros-call-credits', `
    <p class="heros-call-eyebrow">${htmlCopy('ui.credits.eyebrow')}</p>
    <p>${htmlCopy('ui.credits.introduction')}</p>
    <p>${htmlCopy('ui.credits.licenses')}</p>
    ${ALL_ARTWORK.map(art => `<article data-art-credit="${escapeHTML(art.id)}"><h3>${escapeHTML(art.title)}</h3><p>${escapeHTML(art.artist)}${art.collection ? ` · ${escapeHTML(art.collection)}` : ''} · <a href="${escapeHTML(art.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(art.license)}</a></p><a href="${escapeHTML(art.source)}" target="_blank" rel="noopener noreferrer">${htmlCopy('ui.credits.originalArtwork')}</a><small>${escapeHTML(art.changes)}</small></article>`).join('')}
    <article><h3>Lorc · Game-icons.net</h3><p>${htmlCopy('ui.credits.emblem')}</p><p><a href="https://game-icons.net/1x1/lorc/hunting-horn.html" target="_blank" rel="noopener noreferrer">${htmlCopy('ui.credits.originalIcon')}</a> · <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer">CC BY 3.0</a></p><small>${htmlCopy('ui.credits.emblemChanges')}</small></article>
    <p class="heros-call-legal">${htmlCopy('ui.credits.independence')}</p>`);
  const dialog = modal(copy('ui.common.credits'), content, owner);
  const target = [...content.querySelectorAll('[data-art-credit]')].find(node => node.dataset.artCredit === artId);
  if(target) target.scrollIntoView({block:'center'});
  return dialog;
}

function gallery(state) {
  const content = el('div', 'heros-call-gallery-content');
  content.append(el('p', 'heros-call-gallery-note', htmlCopy('ui.gallery.introduction')));
  const grid = el('div', 'heros-call-gallery');
  let dialog;
  const none = el('button', 'heros-call-portrait-option heros-call-no-portrait', htmlCopy('ui.gallery.automatic'));
  none.type = 'button';
  none.setAttribute('aria-pressed',String(!state.portrait));
  none.addEventListener('click', () => { state.portrait = null; updatePortrait(state); dialog.close(); });
  grid.append(none);
  const current = chapterArtFor(state);
  const preferred = state.portrait || current.art?.id;
  const choices = [...PORTRAIT_ARTWORK].sort((a,b) => Number(b.id === preferred) - Number(a.id === preferred));
  for (const art of choices) {
    const button = el('button', 'heros-call-portrait-option');
    button.type = 'button';
    button.setAttribute('aria-label', copy('ui.gallery.chooseLabel', {subject: art.subject}));
    button.setAttribute('aria-pressed', String(state.portrait === art.id));
    const img = el('img', ''); img.src = art.image; img.alt = art.subject; img.loading = 'lazy';
    const caption = el('span', ''); caption.textContent = art.subject;
    const credit = el('small',''); credit.textContent = art.artist;
    button.append(img, caption, credit);
    button.addEventListener('click', () => { state.portrait = art.id; updatePortrait(state); dialog.close(); });
    grid.append(button);
  }
  content.append(grid, el('p', 'heros-call-gallery-note', htmlCopy('ui.gallery.licenseNote')));
  dialog = modal(copy('ui.gallery.title'), content, state.root);
}

function updatePortrait(state) {
  const img = state.aside.querySelector('.heros-call-hero-portrait');
  const art = PORTRAIT_ARTWORK.find(a => a.id === state.portrait);
  const showPortrait = state.chapter === 8 && !!art;
  img.hidden = !showPortrait;
  state.hero.element.hidden = showPortrait;
  if(showPortrait) img.src = art.image;
  else img.removeAttribute('src');
  img.alt = showPortrait ? art.subject : '';
  state.aside.querySelector('.heros-call-portrait-wrap').classList.toggle('has-painted-portrait',showPortrait);
  text(state.aside, '.heros-call-portrait-credit', showPortrait ? `${art.artist} · ${art.license} ↗` : '');
  state.aside.querySelector('.heros-call-portrait-credit').hidden = !showPortrait;
  const scene=chapterArtFor(state);
  state.root.dataset.herosCallArtKind=scene.chapterArt?scene.kind:'hero';
  text(state.aside,'.heros-call-hero-meta .heros-call-eyebrow',scene.chapterArt?copy('ui.portrait.chapterLabel', {chapter: CHAPTERS[state.chapter].label.toUpperCase()}):copy('ui.portrait.heroLabel'));
  text(state.aside,'.heros-call-hero-name',scene.chapterArt?scene.subject:(state.nameInput.value.trim() || copy('ui.portrait.unnamed')));
  const identities=['0','1a','2'].map(id=>id==='1a'?selectedAncestryLabel(state):state.body.querySelector(`[id$="-stage-${id}"] .nimble-card[data-card-option="non-clickable"] .nimble-card__title`)?.textContent.trim()).filter(Boolean);
  text(state.aside,'.heros-call-hero-origin',identities.join(' · ') || copy('ui.portrait.originHint'));
  const button=state.aside.querySelector('.heros-call-portrait-button');
  button.textContent=art?copy('ui.portrait.change'):copy('ui.portrait.choose');
  button.title=state.chapter===8?copy('ui.portrait.finalTooltip'):copy('ui.portrait.chapterTooltip');
  state.hero.set(scene);
}

function previewCard(state, card) {
  if (state.previewCard === card) return state.previewPromise;
  state.previewCard = card;
  state.previewPromise = renderCardDetails(state, card);
  return state.previewPromise;
}

async function renderCardDetails(state, card) {
  const title = card.querySelector('.nimble-card__title')?.textContent?.trim();
  if (!title) return;
  text(state.aside, '.heros-call-detail-title', title);
  const target = state.aside.querySelector('.heros-call-detail-body');
  target.replaceChildren();
  const description = card.querySelector('.nimble-card__description');
  if (description) {
    // These nodes have already been enriched by Foundry's native TextEditor.
    // Avoid duplicate IDs and interactive controls when mirroring them.
    const copy = description.cloneNode(true);
    copy.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
    copy.querySelectorAll('button,input,select,textarea').forEach(node => node.remove());
    target.append(...copy.childNodes);
  }
  if (target.textContent.trim()) return;
  target.textContent = copy('ui.details.loading');
  const section = card.closest('section[id]');
  const group = groupForSection(section?.id);
  const method = section?.id.endsWith('-stage-1b') ? 'prepareAncestryBonusOptions' : {0:'prepareClassOptions',1:'prepareAncestryOptions',2:'prepareBackgroundOptions'}[group];
  try {
    if (!method || typeof state.app[method] !== 'function') throw new Error('No document index for this card');
    state.optionIndexes ??= new Map();
    if (!state.optionIndexes.has(method)) state.optionIndexes.set(method, Promise.resolve(state.app[method]()));
    const options = await state.optionIndexes.get(method);
    const entries = Array.isArray(options) ? options : Object.values(options).flat();
    const matching = entries.filter(entry => entry.name === title);
    const imagePath = card.querySelector('img')?.getAttribute('src');
    const exact = matching.filter(entry => entry.img === imagePath);
    const candidates = exact.length ? exact : matching;
    // Never guess when two packs offer the same named choice.
    if (candidates.length !== 1) throw new Error('Ambiguous or absent document');
    const doc = await fromUuid(candidates[0].uuid);
    const html = await foundry.applications.ux.TextEditor.implementation.enrichHTML(doc?.system?.description || '', {secrets:game.user.isGM,relativeTo:doc});
    if (state.previewCard !== card || !state.root.isConnected) return;
    target.innerHTML = html;
    if (!target.textContent.trim()) target.textContent = copy('ui.details.empty');
  } catch {
    if(state.previewCard === card && state.root.isConnected) target.textContent = copy('ui.details.unavailable');
  }
}

function sync(state) {
  if (!state.root.isConnected) return;
  const backgroundSpellsActive = !!state.body.querySelector('[id$="-background-spells"] > .nimble-hint');
  const nativeStage = chapterFromProgress(state.root.querySelector('.nimble-progress-bar')?.className, backgroundSpellsActive);
  if (nativeStage !== state.nativeStage) {
    state.nativeStage = nativeStage;
    state.chapter = nativeStage;
    state.body.scrollTop = 0;
    state.previewCard = null;
    state.previewAncestry = null;
    state.previewBackground = null;
    text(state.aside, '.heros-call-detail-title', copy('ui.details.title'));
    text(state.aside, '.heros-call-detail-body', copy('ui.details.hint'));
  }
  const chapter = CHAPTERS[state.chapter];
  text(state.banner, '.heros-call-chapter-title', chapter.title);
  text(state.banner, '.heros-call-chapter-subtitle', chapter.description);
  text(state.banner, '.heros-call-chapter-count', copy('ui.shell.chapterCount', {number: String(state.chapter + 1).padStart(2, '0'), total: String(CHAPTERS.length).padStart(2, '0')}));
  state.rail.querySelectorAll('[data-chapter]').forEach(button => {
    const index = Number(button.dataset.chapter);
    button.disabled = index > nativeStage;
    button.classList.toggle('is-complete', index < nativeStage);
    button.setAttribute('aria-current', index === state.chapter ? 'step' : 'false');
  });
  // Group by the system's stable stage IDs. Unknown sections stay visible so a
  // newly introduced system choice can never disappear behind the theme.
  for (const section of state.body.children) {
    if (section.tagName !== 'SECTION') continue;
    const group = groupForSection(section.id);
    section.classList.toggle('heros-call-hidden-section', state.chapter !== 8 && group !== null && group !== state.chapter);
  }
  state.body.classList.toggle('heros-call-review', state.chapter === 8);
  const leavingCalling = state.root.classList.contains('heros-call-calling-active') && state.callingConfirmed;
  state.calling?.sync();
  if(leavingCalling && !state.root.classList.contains('heros-call-calling-active')) {
    state.callingConfirmed=false;
    const heading=state.banner.querySelector('.heros-call-chapter-title');
    heading.tabIndex=-1; heading.focus({preventScroll:true});
  }
  state.journey?.sync();
  state.review?.sync();
  updatePortrait(state);
  const submit = state.root.querySelector('.nimble-sheet__footer--character-creator > button');
  // The native creator supports deliberately incomplete heroes. Hero’s Call presents
  // a complete build by default; Classic view retains that native escape hatch.
  if (submit) {
    submit.disabled = nativeStage !== 8 || !state.nameInput.value.trim() || state.submitting;
    submit.title = nativeStage !== 8 ? copy('ui.submit.incomplete') : !state.nameInput.value.trim() ? copy('ui.submit.nameRequired') : copy('ui.submit.ready');
  }
}

function enhance(app, root) {
  if (instances.has(app.id) || root.dataset.herosCallClassic) return;
  const body = root.querySelector('.nimble-sheet__body--character-creator');
  const nameInput = root.querySelector('.nimble-sheet__header--character-creator input');
  if (!body || !nameInput || typeof app.submitCharacterCreation !== 'function') return;
  const mount = body.parentElement;
  const state = {app, root, body, nameInput, nativeStage:-1, chapter:0, portrait:null, submitting:false,artFocus:new Map()};
  instances.set(app.id, state);
  root.classList.add('heros-call');
  mount.classList.add('heros-call-layout');
  state.originalPosition = {...app.position};
  state.originalSubmit = app.submitCharacterCreation;

  const banner = state.banner = el('header', 'heros-call-banner', `<div class="heros-call-brand"><img src="${BASE}/assets/heros-call.svg" alt=""><div><span class="heros-call-eyebrow">${htmlCopy('ui.shell.system')}</span><strong>${htmlCopy('ui.shell.name')}</strong></div></div><div class="heros-call-chapter-heading"><span class="heros-call-chapter-count heros-call-eyebrow"></span><h1 class="heros-call-chapter-title"></h1><p class="heros-call-chapter-subtitle"></p></div><div class="heros-call-banner-actions"><button type="button" data-heros-call-action="credits">${htmlCopy('ui.common.credits')}</button><button type="button" data-heros-call-action="classic">${htmlCopy('ui.shell.classic')}</button></div>`);
  banner.querySelector('.heros-call-brand').setAttribute('aria-label', copy('ui.shell.brandLabel'));
  const rail = state.rail = el('nav', 'heros-call-chapters', `<p class="heros-call-eyebrow">${htmlCopy('ui.shell.story')}</p>`);
  rail.setAttribute('aria-label', copy('ui.shell.chaptersLabel'));
  CHAPTERS.forEach((chapter, index) => {
    const button = el('button', 'heros-call-chapter', `<span class="heros-call-chapter-number">${String(index+1).padStart(2,'0')}</span><span>${escapeHTML(chapter.label)}</span><span class="heros-call-chapter-check" aria-hidden="true">✓</span>`);
    button.type = 'button'; button.dataset.chapter = index;
    button.setAttribute('aria-label', copy('ui.shell.chapterLabel', {number: index + 1, label: chapter.label}));
    button.title = chapter.label;
    button.addEventListener('click', () => {state.chapter = index; state.body.scrollTop = 0; sync(state);});
    rail.append(button);
  });
  rail.append(el('div', 'heros-call-rail-note', `<span class="heros-call-spark" aria-hidden="true">✧</span><p>${htmlCopy('ui.shell.railFirstLine')}<br>${htmlCopy('ui.shell.railSecondLine')}</p>`));
  const aside = state.aside = el('aside', 'heros-call-aside', `<div class="heros-call-portrait-wrap"><img class="heros-call-hero-portrait" alt=""><button type="button" class="heros-call-portrait-button">${htmlCopy('ui.portrait.shortChoose')} <span aria-hidden="true">↗</span></button><button type="button" class="heros-call-portrait-credit"></button></div><div class="heros-call-hero-meta"><span class="heros-call-eyebrow">${htmlCopy('ui.portrait.heroLabel')}</span><h2 class="heros-call-hero-name"></h2><p class="heros-call-hero-origin"></p></div><div class="heros-call-detail"><span class="heros-call-eyebrow">${htmlCopy('ui.details.eyebrow')}</span><h3 class="heros-call-detail-title">${htmlCopy('ui.details.title')}</h3><div class="heros-call-detail-body">${htmlCopy('ui.details.hint')}</div></div>`);
  state.refreshArt=()=>updatePortrait(state);
  state.hero = createHero({openCredits:art=>showCredits(root,art?.id)});
  aside.querySelector('.heros-call-portrait-wrap').prepend(state.hero.element);
  aside.setAttribute('aria-label',copy('ui.portrait.regionLabel'));
  aside.querySelector('.heros-call-portrait-button').addEventListener('click', () => gallery(state));
  aside.querySelector('.heros-call-portrait-credit').addEventListener('click', () => showCredits(root,state.portrait));
  banner.querySelector('[data-heros-call-action="credits"]').addEventListener('click', () => showCredits(root));
  banner.querySelector('[data-heros-call-action="classic"]').addEventListener('click', () => {
    root.dataset.herosCallClassic = 'true'; cleanup(app.id, true);
  });
  mount.append(banner, rail, aside);
  updatePortrait(state);
  const openRules = async card => {
      await previewCard(state, card);
      if(!root.isConnected) return;
      const content=el('div','heros-call-credits heros-call-class-rules');
      const description=state.aside.querySelector('.heros-call-detail-body').cloneNode(true);
      content.append(description);
      modal(card.querySelector('.nimble-card__title')?.textContent.trim() || copy('ui.details.modalTitle'),content,root);
  };
  state.calling = createCalling(state, {openCredits: art => showCredits(root,art?.id),openRules});
  state.journey = createJourney(state,{previewCard,openRules,navigate:chapter=>{state.chapter=chapter;sync(state);}});
  state.review=createReview(state,chapter=>{state.chapter=chapter;sync(state);});
  mount.append(state.journey.intro,state.journey.element,state.journey.footer,state.review.element);
  mount.append(state.calling.backdrop,state.calling.element);

  const controller = state.controller = new AbortController();
  const schedule = () => {
    cancelAnimationFrame(state.frame);
    state.frame = requestAnimationFrame(() => sync(state));
  };
  nameInput.addEventListener('input', schedule, {signal:controller.signal});
  for (const eventName of ['pointerover','focusin']) body.addEventListener(eventName, event => {
    const focus=chapterFocusFromTarget(event.target,state.chapter,globalThis.CONFIG?.NIMBLE);
    if(focus && state.artFocus.get(state.chapter)!==focus){state.artFocus.set(state.chapter,focus);state.refreshArt();}
    const card = event.target.closest('.nimble-card');
    if (card) {
      previewCard(state, card);
      if(state.chapter===2 && card.closest('section[id$="-stage-2"]') && card.dataset.cardOption!=='non-clickable'){state.previewBackground=card;state.refreshArt();}
      if(card.closest('section[id$="-stage-1a"]') && card.dataset.cardOption !== 'non-clickable') {
        state.previewAncestry=card; state.refreshArt();
      }
    }
  }, {signal:controller.signal});
  const clearAncestryPreview = () => {if(!root.classList.contains('heros-call-choice-active')){state.previewAncestry=null;state.refreshArt();}};
  body.addEventListener('pointerleave', clearAncestryPreview, {signal:controller.signal});
  body.addEventListener('focusout', event => {
    if(!event.relatedTarget?.closest?.('section[id$="-stage-1a"]')) clearAncestryPreview();
  }, {signal:controller.signal});
  // Observe only native Svelte nodes, never the injected interface: no feedback loop.
  state.observer = new MutationObserver(schedule);
  state.observer.observe(body, {childList:true, subtree:true, characterData:true,attributes:true,attributeFilter:['disabled']});
  const progress = root.querySelector('.nimble-progress-bar');
  if (progress) state.observer.observe(progress, {attributes:true, attributeFilter:['class']});

  app.submitCharacterCreation = async function(results) {
    if (state.submitting) return;
    state.submitting = true;
    sync(state);
    // preCreateActor is local to this initiating client. Install this only for
    // the duration of this dialog's submission and remove it even on failure.
    let captured = false;
    const portrait = PORTRAIT_ARTWORK.find(art => art.id === state.portrait);
    const hook = portrait ? Hooks.on('preCreateActor', (actor, data, options, userId) => {
      if (captured || userId !== game.user.id || data.type !== 'character' || data.name !== (results.name || 'New Character')) return;
      captured = true;
      actor.updateSource({img:portrait.image, 'prototypeToken.texture.src':portrait.image, [`flags.${ID}.portraitCredit`]:{title:portrait.title,author:portrait.artist,license:portrait.license,source:portrait.source}});
    }) : null;
    try { return await state.originalSubmit.call(this, results); }
    catch (error) { console.error(`${ID} | Character creation failed`, error); ui.notifications.error(copy('ui.submit.failed')); }
    finally { if (hook !== null) Hooks.off('preCreateActor', hook); state.submitting = false; if(root.isConnected) sync(state); }
  };

  const fit = () => app.setPosition({width:window.innerWidth,height:window.innerHeight,left:0,top:0});
  window.addEventListener('resize',fit,{signal:controller.signal});
  fit();
  sync(state);
}

function cleanup(id, restore = false) {
  const state = instances.get(id);
  if (!state) return;
  state.observer?.disconnect(); state.controller?.abort(); cancelAnimationFrame(state.frame);
  state.app.submitCharacterCreation = state.originalSubmit;
  state.journey?.destroy();
  state.review?.destroy();
  state.calling?.destroy();
  state.hero?.destroy();
  if (restore) {
    state.root.querySelectorAll('.heros-call-modal').forEach(dialog => dialog.close());
    state.banner?.remove(); state.rail?.remove(); state.aside?.remove();
    delete state.root.dataset.herosCallArtKind;
    state.root.classList.remove('heros-call'); state.body.parentElement.classList.remove('heros-call-layout');
    state.body.querySelectorAll('.heros-call-hidden-section').forEach(node => node.classList.remove('heros-call-hidden-section'));
    state.body.classList.remove('heros-call-review');
    const button=state.root.querySelector('.nimble-sheet__footer--character-creator > button');
    if(button) {button.disabled=false; button.removeAttribute('title');}
    state.app.setPosition(state.originalPosition);
  }
  instances.delete(id);
}

Hooks.once('init', () => {
  game.settings.register(ID, 'enabled', {name:copy('ui.settings.name'),hint:copy('ui.settings.hint'),scope:'client',config:true,type:Boolean,default:true});
  game.modules.get(ID).api = {open:() => CONFIG.Actor.documentClass.createDialog(),credits:() => showCredits()};
});
Hooks.on('renderApplicationV2', (app, element) => {
  if(game.system.id !== 'nimble' || !game.settings.get(ID,'enabled')) return;
  const root = element instanceof HTMLElement ? element : app.element;
  if(!root) return;
  try {enhance(app, root);} catch(error) {cleanup(app.id, true); console.error(`${ID} | Theme could not be applied`,error); ui.notifications.warn(copy('ui.settings.themeFailed'));}
});
Hooks.on('closeApplicationV2', app => cleanup(app.id));
