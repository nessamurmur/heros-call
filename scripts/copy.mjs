import callings from '../content/callings.mjs';
import chapters from '../content/chapters.mjs';
import ui from '../content/interface.mjs';
import artwork from '../content/artwork.mjs';

// These data-only modules are the authoring source, imported directly by both
// Foundry and offline checks. No compiler, fetch, or generated copy is involved.
export const COPY = {callings, chapters, ui, artwork};

export function formatCopy(template, values = {}) {
  if (typeof template !== 'string') throw new TypeError('Copy must be a string');
  return template.replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g, (_, key) => {
    if (!Object.hasOwn(values, key)) throw new Error(`Missing copy placeholder: ${key}`);
    return String(values[key]);
  });
}

export function copy(key, values) {
  const template = key.split('.').reduce((value, part) =>
    value && Object.hasOwn(value, part) ? value[part] : undefined, COPY);
  if (typeof template !== 'string') throw new Error(`Missing copy entry: ${key}`);
  return formatCopy(template, values);
}

export const escapeHTML = value => String(value).replace(/[&<>"']/g,
  character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]));

// Authored copy is always plain text, even when placed in an HTML template.
export const htmlCopy = (key, values) => escapeHTML(copy(key, values));

export function withArtworkCopy(art) {
  return {...art,
    subject: copy(`artwork.${art.id}.subject`),
    changes: copy(`artwork.${art.id}.changes`)
  };
}
