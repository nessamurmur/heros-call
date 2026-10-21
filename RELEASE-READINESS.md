# Open-source readiness review — 0.1.0

Reviewed 2026-10-21, followed by setup of the public repository and tag-based
release workflow at [nessamurmur/heros-call](https://github.com/nessamurmur/heros-call).
This document records the source review and its limits; current publication and
CI status are available on the repository’s Releases and Actions pages.

## Findings and changes

| Area | Finding and disposition |
| --- | --- |
| Publication boundary | The surrounding workspace contains private fixtures, research and superseded assets. Only this module folder is the public source root. An explicit packaging allowlist and Git ignores exclude private work and generated archives. |
| Identity and version | Renamed the folder, manifest ID, settings, actor flags, asset paths, entrypoint and styling hooks to `heros-call`. Set the first unreleased version to 0.1.0. No public users require compatibility with private iteration IDs or versions. |
| Original source license | MIT license and contributor copyright notice are present. Original code/documentation and third-party art are explicitly distinguished. |
| Artwork | All 63 illustrations plus the emblem have individual attribution and checksum coverage; applicable CC/GPL texts and source notices are included. Original art bytes are preserved. Removed unrelated promotional content from the Ancient Beast notice while retaining artwork attribution and license evidence. |
| Artist policies | ART-REVIEW.md records dated public-source checks and their limits. This readiness pass verifies the records, not a new exhaustive artist-policy search. Silence is not approval, and unchanged artists are not all covered by the latest search. |
| Proprietary content | No Foundry runtime, Nimble compendiums/rule descriptions, PDF extracts or private browser fixtures are included in this folder. Public test fixtures contain option names and image paths only. |
| Sensitive data and runtime | A bounded scan found no credential-shaped secrets in the reviewed text files. No telemetry, remote scripts, external fonts or direct external data requests were found in the module source. Artist/source hyperlinks remain external. The initial source snapshot was reviewed before Git history was created. |
| Repeatable validation | Added offline manifest, source syntax, asset hash, attribution and file-boundary checks; release-tool regression tests; deterministic ZIP construction; and CI for Node 22/24. Tagged releases reuse these checks before publishing assets. |
| Public documentation | Removed local world/session instructions and stale release claims. Added contributor, release, versioning and privacy guidance; preserved historical QA dates and limitations. |
| Download size | Original art is about 227 MiB uncompressed, with the largest file about 15.6 MiB. Large but usable for an initial release; compression/derivative assets can be considered later with the source/license implications recorded. |

## Release setup and remaining acceptance coverage

Local checks passed: 24 Node assertions, four packaging tests, 13 offline DOM
interaction checks, all module syntax checks, all 64 credited asset hashes, and
release ZIP integrity. See QA.md for dates and what each check does not establish.

The repository and release URLs are configured for `nessamurmur/heros-call`.
The source folder is the Git root, and the release workflow publishes matching
manifest, ZIP and checksum assets from a version tag. The workflow refuses to
overwrite an already public release. RELEASING.md describes the process.

A **fresh native installation smoke test of the renamed package remains
unverified**. The earlier readiness pass updated the local installation link but
could not verify browser permissions to activate it. The active world was not
restarted and its database was not edited. Earlier native character-creation
checks predate the ID rename. The release notes retain this limitation; automated
checks alone do not establish native integration quality.

The nine missing ancestry portraits, paired-variant gaps and limited system
compatibility are documented product limitations, not hidden release claims.

## Reference checks

Foundry’s [module manifest documentation](https://foundryvtt.com/article/module-development/)
specifies stable manifest and version-specific download URLs. GitHub documents
[release asset links](https://docs.github.com/en/repositories/releasing-projects-on-github/linking-to-releases)
and [repository file limits](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github).
Individual artwork evidence is linked in CREDITS.md and ART-REVIEW.md.
