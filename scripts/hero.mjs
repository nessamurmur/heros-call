import {copy} from './copy.mjs';
import {ARTWORK, CALLING_ART} from './art-credits.mjs';

const BASE = 'modules/heros-call';
const ANCESTRIES = {
  Human:'icons/environment/people/commoner.webp',
  Elf:'icons/consumables/plants/dried-leaf-stem-twig-green.webp',
  Dwarf:'icons/commodities/stone/boulder-grey-blue.webp',
  Orc:'icons/equipment/shield/heater-wooden-brown-axe.webp',
  Celestial:'icons/magic/holy/angel-winged-humanoid-blue.webp'
};
const assetPath = value => String(value || '').split(/[?#]/)[0];
export function callingKey(calling) {
  return assetPath(calling?.image).match(/(?:^|\/)systems\/nimble\/assets\/classImages\/([^/]+)\.webp$/)?.[1];
}
export function cardIdentity(card) {
  return card ? {name:card.querySelector('.nimble-card__title')?.textContent.trim() || '', image:card.querySelector('img')?.getAttribute('src') || ''} : null;
}
export function selectedAncestry(state) {
  return cardIdentity(state.body.querySelector('[id$="-stage-1a"] .nimble-card[data-card-option="non-clickable"]'));
}
export function selectedAncestryLabel(state) {
  return state.body.querySelector('[id$="-stage-1c"] .nimble-ancestry-choice__granted .nimble-ancestry-choice__icon + strong')?.textContent.trim() || selectedAncestry(state)?.name || '';
}
export function resolveHero(calling, ancestry, preview = false) {
  const key = callingKey(calling);
  const defaultArt = ARTWORK.find(a => a.id === CALLING_ART[key]);
  const ancestryPath = ANCESTRIES[ancestry?.name];
  const path = assetPath(ancestry?.image);
  const knownAncestry = ancestryPath && (path === ancestryPath || path.endsWith('/'+ancestryPath));
  // Both built-in identity and curated subject must match. Homebrew choices
  // keep their own illustration instead of being guessed from a name alone.
  const matches = knownAncestry ? ARTWORK.filter(a => a.ancestry === ancestry.name && a.classes.includes(key)) : [];
  const art = matches.find(a => a.id === defaultArt?.id) || matches[0] || defaultArt;
  const matched = matches.includes(art);
  return {
    art, key:art?.id || 'native', matched, preview,kind:art?.kind || 'vignette',
    image:art?.image || calling?.image || `${BASE}/assets/heros-call.svg`,
    fallback:calling?.image || `${BASE}/assets/heros-call.svg`,
    label:art?.subject || calling?.name || copy('ui.hero.fallbackLabel'),
    note:art ? (preview ? copy('ui.hero.previewPrefix') : '') + (matched ? copy('ui.hero.matchedIllustration', {ancestry: ancestry.name, calling: calling.name}) : copy('ui.hero.callingIllustration', {ancestry: art.ancestry})) : copy('ui.hero.installedIllustration')
  };
}
export function selectedHero(state) {
  const calling = cardIdentity(state.body.querySelector('[id$="-stage-0"] .nimble-card[data-card-option="non-clickable"]'));
  const selected = selectedAncestry(state);
  const preview = state.chapter === 1 && state.previewAncestry?.isConnected && !selected ? cardIdentity(state.previewAncestry) : null;
  return resolveHero(calling, preview || selected, !!preview);
}
export function createHero({compact = false, openCredits} = {}) {
  const element = document.createElement('figure');
  element.className = `heros-call-art-hero${compact ? ' is-compact' : ''}`;
  element.innerHTML = '<div class="heros-call-hero-art"><img class="heros-call-character-art" alt=""></div><figcaption><span class="heros-call-avatar-note"></span><button type="button" class="heros-call-avatar-credit"></button></figcaption>';
  const img = element.querySelector('img');
  const note = element.querySelector('.heros-call-avatar-note');
  const credit = element.querySelector('button');
  let current, signature, request = 0, alive = true;
  credit.addEventListener('click', () => openCredits?.(current?.art));
  return {element, set(hero) {
    const next = JSON.stringify(hero);
    if (next === signature) return;
    signature = next; current = hero;
    const ticket = ++request;
    element.dataset.heroKey = hero.key;
    element.dataset.match = hero.chapterArt ? 'chapter' : hero.matched ? 'ancestry-class' : 'calling';
    element.dataset.artKind = hero.kind || 'vignette';
    element.title = hero.explanation || '';
    note.textContent = hero.note;
    credit.textContent = hero.art ? `${hero.art.artist} · ${hero.art.license} ↗` : hero.chapterArt ? copy('ui.hero.installedAncestryCredits') : copy('ui.hero.creditsLink');
    credit.setAttribute('aria-label', hero.art ? copy('ui.hero.artCreditsLabel', {title: hero.art.title, artist: hero.art.artist}) : copy('ui.common.credits'));
    // The incoming subject and credit must stay together during rapid browsing.
    img.hidden = true;
    element.classList.remove('is-entering');
    const incoming = new Image();
    incoming.onload = () => {
      if (!alive || ticket !== request) return;
      img.src = incoming.src;
      img.alt = copy('ui.hero.imageDescription', {label: hero.label, note: hero.note});
      img.hidden = false;
      element.classList.add('is-entering');
    };
    incoming.onerror = () => {
      if (!alive || ticket !== request) return;
      current = {...hero, art:null};
      credit.textContent = copy('ui.hero.creditsLink');
      credit.setAttribute('aria-label',copy('ui.common.credits'));
      note.textContent = hero.fallbackNote || copy('ui.hero.installedClassIllustration');
      incoming.onerror = () => {if (alive && ticket === request) note.textContent = copy('ui.hero.unavailable');};
      incoming.onload = () => {
        if (!alive || ticket !== request) return;
        img.src = incoming.src; img.alt = hero.fallbackNote || copy('ui.hero.installedClassAlt'); img.hidden = false;
      };
      incoming.src = hero.fallback;
    };
    incoming.src = hero.image;
  },destroy(){alive = false; request++; element.remove();}};
}
