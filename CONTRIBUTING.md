# Contributing

Hero’s Call is an independent, open-source interface for Nimble’s native
character creator. Original code and documentation contributions use the MIT
license in LICENSE; artwork retains its individual license.

## Development

Use Node.js 22+ and Python 3.10+. No package installation or compilation is needed.
Run `npm test` and `npm run build` from this folder. The generated `dist/` directory
is ignored by Git. The manifest is the single source of the release version;
package.json exists only to provide development commands and disables npm publishing.

For interactive testing, use your own licensed Foundry VTT 14 installation and
Nimble 0.10.0. Copy or link this folder to `Data/modules/heros-call`, restart
Foundry so it discovers the module, enable it in a disposable Nimble world, then
choose Create Actor → Character. Keep world data and proprietary files outside
this repository. The checked-in test fixtures contain names and icon paths only.

Changes to native control handling need an actual Foundry smoke test using the
checklist in QA.md. Record the versions and steps tested. Do not broaden the
compatibility range without testing the corresponding versions. Keep all Svelte
controls mounted and delegate rules and submission to Nimble.

## Artwork

For each proposed asset, include its title, artist, original source, exact license,
any required collection attribution, modifications and SHA-256 checksum. Use a
license that permits redistribution and commercial use; preserve applicable
share-alike and source requirements. NonCommercial and NoDerivatives-only art
does not meet this project’s asset policy. Do not submit Foundry or Nimble art.

Check the artist’s identifiable public profiles for a statement excluding their
work from projects developed with AI assistance. Record where and when you
looked, and any unavailable sources. Silence is not consent or endorsement. An
explicit project-wide exclusion disqualifies an asset under our selection policy.
The existing art has not been processed with generative image tools.

Add records to the corresponding `licenses/*art-sources.json` file and exported
array in `scripts/art-credits.mjs` or `scripts/chapter-art.mjs`, update
`licenses/asset-checksums.json`, and add the work to CREDITS.md. Include the full
license and any upstream notices. Update ART-REVIEW.md for visual coverage and
policy evidence. `npm run check` detects missing, changed or unattributed assets.

## Reporting problems

Use the [repository’s issue tracker](https://github.com/nessamurmur/heros-call/issues). Include the Hero’s Call,
Foundry and Nimble versions, the failing chapter, steps to reproduce, and whether
Classic view works. Remove private character data and credentials from examples.
Use synthetic test data or your own shareable content in screenshots and fixtures.
