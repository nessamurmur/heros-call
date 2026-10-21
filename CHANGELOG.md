# Changelog

## 0.1.0 — 2026-10-21

First public release of Hero’s Call, intended for early testing. Earlier private iteration
numbers were development labels, not public releases.

- Guided character creation across all nine Nimble chapters, with a dark theme,
  keyboard navigation, explicit confirmations and an editable final overview.
- Choice-driven artwork with individual attribution, 30 selectable character
  portraits, and documented symbol fallbacks for uncovered ancestries.
- Classic view restores Nimble’s native creator. Native controls and submission
  remain responsible for rules and character creation.
- Package ID, folder, settings, actor flags and asset paths use `heros-call`.
- MIT source code, separately licensed CC/GPL art, source records and full
  license texts; dependency-free tests and reproducible release packaging.

Requires Foundry VTT 14 and Nimble 0.10.0. See README.md and ART-REVIEW.md for
limitations and QA.md for test coverage. Automated checks cover the renamed
package; native character creation was tested during private development before
the ID rename. A fresh native installation smoke test remains unverified.

Install through Foundry using:
https://github.com/nessamurmur/heros-call/releases/latest/download/module.json
