# Authoring Hero’s Call copy

The existing AI-authored or AI-assisted interface wording has been moved into
four editable content files. The extraction preserves the current words so the
creator keeps working while you replace them. **Moving text does not make it
human-authored. Every entry starts pending in [COPY-INVENTORY.md](COPY-INVENTORY.md).**
That checklist is a conservative review scope, including ordinary functional
labels and the user-selected project name; it is not a claim that AI invented
every individual word or proper name.

## Start here

| File | Entries | What to write | Where it appears |
| --- | ---: | --- | --- |
| [callings.mjs](../content/callings.mjs) | 33 | Motto, theme keywords, and introduction for each of the 11 classes | Calling page when browsing a built-in class |
| [chapters.mjs](../content/chapters.mjs) | 36 | Navigation label, heading, introductory sentence, and default footer hint for each of the nine chapters | Chapter navigation, page introductions, review labels, and footer |
| [interface.mjs](../content/interface.mjs) | 141 | Buttons, instructions, accessibility labels, tooltips, fallback text, credit explanations, and status messages | Throughout the creator, portrait gallery, credits dialog, and module settings |
| [artwork.mjs](../content/artwork.mjs) | 126 | Subject description and modification/framing notice for each of the 63 illustrations | Portrait labels, image descriptions, and each artwork’s credit entry |

Start with `callings.mjs` and `chapters.mjs` for the most visible creative prose.
Then work through the interface groups and artwork descriptions. Use the
inventory to record completion for each key; check an item only after you have
authored its wording or established that it is an appropriate human-authored
name or factual label. The tools do not automatically mark anything human-authored.

## Editing and previewing

These `.mjs` files are small, data-only configuration modules: a JSON-shaped
object between `export default` and the final semicolon. They contain no UI
logic. Both Foundry and the checks import these exact files; there is no compiled
copy, duplicate English fallback, network service, or build step to keep in sync.

1. Open a content file and change the text on the right of a key. Keep the keys,
   commas, braces, double quotes, and outer `export default ...;` wrapper.
2. Keep any `{placeholder}` names exactly as written. You can move them within
   your sentence. The inventory lists the required placeholders for every entry.
3. Run `npm run check` from the repository root. It reports missing keys,
   empty values, malformed configuration, or changed placeholders. Checks accept
   new wording; they do not judge authorship or certify policy compliance.
4. Refresh the Foundry browser tab and reopen the creator. The development
   installation must point at this checkout; for a separate installation, copy
   the changed content files into its `modules/heros-call/content/` folder first.
   If the browser keeps old files, use a hard refresh.
5. Mark the corresponding entries in [COPY-INVENTORY.md](COPY-INVENTORY.md).
   Before sharing a new release, run `npm test` and `npm run build` and check the
   affected screens. Longer wording can need layout adjustments.

For example, edit the value after `mage.motto` in `callings.mjs`; leave `mage`
and `motto` intact. That value appears under Mage’s name on the Calling page.
Changing `ui.common.chooseAndContinue` affects screen-reader confirmation labels
on both the Calling and Ancestry/Background pages, with `{title}` supplied by the
selected native option.

All entries are **plain text**, not Markdown or HTML. Apostrophes are fine inside
the double-quoted values. Write an embedded double quote as `\"`, a backslash as
`\\`, and a line break as `\n`; do not put a literal newline inside a quoted
value. Markup characters are displayed as text. Avoid leaving entries blank;
removing a UI element intentionally requires a small code change.

Chapter counters and decorative arrows are handled by the UI. Some existing
button strings include arrows; preserve or reposition them as appropriate.
Chapter labels may be displayed in uppercase or lowercase by the interface.
Keep action wording clear about previewing versus confirming a choice, and keep
screen-reader labels meaningful when read without the surrounding screen.

## Interface file map

| Group in `interface.mjs` | Location and purpose |
| --- | --- |
| `calling` | First chapter eyebrow, prompt, complexity label, explore/confirm buttons, footer, and homebrew/no-description fallbacks |
| `common` | Shared preview and confirmation accessibility labels, credits button, close button, unnamed-option fallback |
| `journey` | Chapters after Calling: roster counts, back/return/confirm actions, ancestry gift/variant introductions, readiness messages, and context-specific footer hints |
| `details` | Loading, missing-description and unavailable-details messages, detail panel headings, and rules-dialog fallback title |
| `controls` | Screen-reader labels for selecting/assigning attribute modifiers and spending skill points; includes singular and plural forms |
| `review` | Begin chapter: overview/details toggle, Change buttons, empty selections, ancestry gift summary, equipment/gold labels, skill-point total, and default language label |
| `hero` | Illustration captions, image alternative text, credit links/accessibility labels, and image-load failure messages |
| `scenes` | Chapter art captions/tooltips, symbol fallbacks, equipment subjects, and qualified ancestry-example captions |
| `credits` | Art & credits introduction, license explanation, source-link labels, emblem explanation, and independence notice |
| `gallery` | Portrait chooser title, instructions, automatic-art option, selection accessibility label, and license note |
| `portrait` | Right-hand preview heading, unnamed hero/origin text, portrait actions, and tooltips |
| `shell` | Brand display, system subtitle, Classic view, chapter navigation/counters, and rail invitation |
| `submit` | Create Character availability tooltips and the failed-submission notification |
| `settings` | Foundry module setting name/help and fallback notification when enhancement fails |

Default chapter hints live in `chapters.mjs`. More specific hints, such as an
attribute modifier awaiting assignment, override them from `interface.mjs`.
Class names and selected ancestry/background descriptions come from Nimble.

## Artwork wording and attribution facts

`artwork.mjs` is keyed by stable artwork IDs. Each `subject` is our editorial
description, used in portrait choices and image alternative text. Each `changes`
entry explains how that particular image is presented in the module. Rewrite
these descriptions while keeping them factually accurate: original image files
remain unchanged; framing, scaling, masks, and transitions are CSS effects.

Original artwork titles, artist names, collections, licenses, source URLs,
checksums, and identity mappings stay in the attribution/source records. They
are facts to verify and preserve, not creative prose to replace. Runtime records
combine those facts with the text from `artwork.mjs`. Do not rename artwork IDs
or edit `licenses/*art-sources.json` merely to change a caption.

Ancestry captions in `interface.mjs` deliberately identify examples or
inspiration. Retain an accurate distinction between a representative image and
an exact depiction, particularly for paired ancestries and symbol fallbacks.

## Copy already in editable files

These files did not need extraction from JavaScript:

| File/location | Authorship work |
| --- | --- |
| [module.json](../module.json): `description` | AI-authored package summary shown in Foundry; replace directly in the manifest. |
| [module.json](../module.json): `title`, `authors[].name` | Confirm your chosen display title and author attribution. These are identity fields; preserve the technical `id` and release URLs. |
| [README.md](../README.md) | Existing AI-assisted overview/features, instructions, screenshot alt text, and captions are already Markdown. Review the public-facing prose here; edit the file directly. |
| [CREDITS.md](../CREDITS.md) | AI-assisted introductory and redistribution explanations are already Markdown. Preserve the sourced artist/title/license table and factual obligations. |
| [ART-REVIEW.md](../ART-REVIEW.md) | AI-assisted artwork-selection descriptions and research notes; preserve dates, citations, and the distinction between findings and uncertainty. |
| [licenses/ancient-beast-notice.md](../licenses/ancient-beast-notice.md) | An AI-assisted summary of upstream attribution requirements, already Markdown. Preserve the underlying facts and links. |
| [QA.md](../QA.md), [CHANGELOG.md](../CHANGELOG.md), [CONTRIBUTING.md](../CONTRIBUTING.md), [RELEASING.md](../RELEASING.md), [RELEASE-READINESS.md](../RELEASE-READINESS.md) | AI-assisted technical documentation, already Markdown. Edit in place if desired; keep test results, release history, and limitations accurate. |
| This guide and [COPY-INVENTORY.md](COPY-INVENTORY.md) | AI-authored technical authoring aids, not replacements for your UI prose. |
| Foundry website listing | Write the description yourself when submitting. It is separate from this repository; the module does not publish it. |
| [README screenshots](screenshots/) | They contain the current interface wording. Capture replacements after rewriting the UI if you want the listing/README to show the new text. |

The inventory has a separate checklist for these locations. This organization
does not assert that all documentation must be rewritten under Foundry’s policy;
technical documentation and prepared UI/marketing text are different categories.
See [Foundry’s current policy](https://foundryvtt.com/article/ai-policy/) when
preparing the official listing. AI-assisted development remains part of this
project’s history after the wording is replaced.

## Text intentionally outside the authoring files

- Nimble rules, option names/descriptions, native confirmation buttons, attribute
  names, skills, languages, and character data are read from the installed system
  and packs. The module does not author or redistribute those rule descriptions.
- Artwork titles, artist names, license names, original notices, and full license
  texts are sourced attribution. Do not paraphrase the license texts or upstream
  copyright notices as an authorship exercise.
- CSS selectors, native identity names used for matching, image paths, action
  IDs, console diagnostics, and code comments remain implementation details.
  For example, the native `New Character` fallback is used to identify the actor
  being created, not to supply a new label in our UI.
- The two supplied screenshots and third-party illustration pixels were not
  rewritten or processed during this extraction.

## Developer notes

`scripts/copy.mjs` reads the four content modules and formats named placeholders.
`copy()` returns text for `textContent` and attributes; `htmlCopy()` escapes both
authored text and replacements for use inside an HTML skeleton. Never insert
raw authored strings into `innerHTML`.

`tools/copy-contract.json` records required keys and placeholder names, without
duplicating prose. It is a developer schema, not another place to edit wording.
New slots require a consumer, a contract entry, and an inventory entry. The
packager includes the content modules and these two guides. Original asset
checksums and attribution facts continue to be validated separately.
