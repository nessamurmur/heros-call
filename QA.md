# QA — Hero’s Call 0.1.0

## First public version

The 2026-10-21 readiness pass resets the first public version to 0.1.0 and
renames the package, files, asset paths, settings, actor flags and styling hooks
to `heros-call`. Earlier iteration numbers were never public releases.

Run `npm test` for routing, identity, artwork and release-tool tests. Run
`npm run build` for syntax, manifest, asset-hash, attribution and publication
checks and a validated ZIP. Tests require Node.js 22+ and Python 3.10+; no
Foundry installation or proprietary fixtures are required for these commands.

Results on 2026-10-21 with Node 24.15.0 and Python 3.14.6:

- All 24 Node assertions and four Python packaging tests passed. Node assertions
  were also run in-process because this workspace restricts child-process pipes.
- All ten module scripts passed syntax checks. All 64 credited asset hashes and
  the matching runtime/source license records passed validation.
- An offline Happy DOM run passed 13 interaction checks across the nine chapters,
  including new-namespace portrait attribution, 63 artwork credit entries and
  Classic-view cleanup. Image loading was simulated; this does not test browser
  rendering, native Foundry rules or real actor creation. The fixture remains
  private and is not part of the public test suite.
- The release ZIP built successfully and passed its integrity check. Synthetic
  packaging tests verify reproducible bytes, manifest agreement and rejection of
  symlinks/unrecognised runtime files. Hosted CI has not run yet.

A fresh native smoke test of this renamed package remains unverified.
The test-installation link points to the new folder, but the server must discover
and enable the new ID. This pass could not inspect the live UI because browser
permissions could not be verified. It did not restart the active world or
rewrite its database. Prior private test actors and macros may retain old paths;
this is not a migration release for other users.

## Earlier private validation

These are historical observations of the implementation before the package-ID
rename, not claims of a new native test on the renamed version.

**2026-10-20 — artwork and dark interface:**

- 24 Node tests passed. Browser fixture checks covered all 11 class, 24 ancestry
  and 24 background previews, distinct roster image URLs, credit display, image
  loading, non-committing browsing and rapid keyboard navigation.
- The nine-chapter fixture journey covered selection, confirmations, attribute
  assignment, training, languages, review, rules, gallery and credits.
- All nine chapters fit at 1440×1000, 1024×768 and 800×700 without horizontal
  overflow or header/action overlap. Classic view retained the draft.
- 473 active text samples had minimum computed solid-background contrast of
  6.35:1. This was a spot check, not a full accessibility audit.
- All 30 portrait choices were present. Ratfolk and GPL Paladin selections
  retained actor/token paths and artist, source and license flags in mocked
  submission. Temporary hooks were removed. No native actors were created.
- Original artwork grids and revised class/ancestry screenshots were inspected.

**2026-10-19 — actual Foundry 14.369 / Nimble 0.10.0:**

- Two temporary Hunter characters were created: Elf / Survivalist with class
  equipment and an explicit portrait, and Shroomling / Academy Dropout with
  size, spell, starting gold and native portrait choices.
- Inspected real actor data for ancestry variants, equipment or gold, attributes,
  training, languages and portrait attribution. Zero Intelligence correctly
  skipped bonus languages. Temporary actors were removed afterward.
- Shared confirmations, keyboard/click/drag attributes, final-review editing,
  name validation, reduced motion and Classic view passed in the native creator.
- No browser page errors were observed during those builds. Existing actors
  remained intact. These checks did not exhaust every calling or optional branch.

The private fixture, screenshots and detailed development logs are intentionally
not distributed: they depend on installed Foundry/Nimble content. Public test
fixtures contain only option names and icon paths.

## Native release smoke test

Use a disposable world and the built archive, with Foundry 14 and Nimble 0.10.0.

1. Restart Foundry after installing; confirm **Hero’s Call**, ID `heros-call`,
   version 0.1.0, is enabled and opens through Create Actor → Character.
2. Browse classes, ancestries and backgrounds without committing them. Check the
   four revised classes, artwork fallbacks, paired ancestry variants and credits.
3. Complete all nine chapters, including an optional ancestry/background choice,
   equipment versus gold, attribute assignment, skill limits and languages.
4. Change an earlier choice from the final overview; confirm that native details
   and validation reflect it. Test a zero-bonus-language build as well.
5. Create a temporary hero with a chosen portrait. Inspect actor and token paths
   under `modules/heros-call/`, and `flags.heros-call.portraitCredit` attribution.
   Also create a hero keeping the native portrait. Remove only temporary actors.
6. Test keyboard navigation, reduced motion, modal Escape, and Classic view with
   a draft in progress. Confirm no browser errors or broken asset requests.
7. Check the creator at the three viewport sizes above. Record versions, date,
   results and any untested branches before publishing.

## Known limits

English additions, desktop-focused layout, no persistent drafts, no controller
or audio flow, and compatibility limited to Nimble 0.10.0. Nine ancestry portrait
gaps and three paired-variant gaps use documented symbols; see ART-REVIEW.md.
Homebrew packs, translations, every class branch, multiplayer permissions and
third-party module combinations have not been exhaustively tested.
