# Hero’s Call

**Character Creation for Nimble**

An illustrated character creator for **Foundry VTT 14 / Nimble 0.10.0**.
Version **0.1.0** is the first public release, intended for early testing.
A charcoal, ivory and gold interface pairs each choice with credited open artwork.
All 24 backgrounds have distinct illustrations, and 15 ancestry choices have
character art. Nine ancestry portraits remain unresolved and use their own
labelled symbols. See [ART-REVIEW.md](ART-REVIEW.md) for coverage and source checks.

The creator carries the guided experience through all nine chapters. Equipment
and Potential preview before confirmation; ancestry gifts use the shared action
bar; Attributes support click, keyboard and native drag assignment. Skills and
Languages keep Nimble’s limits, and Begin presents an editable hero overview with
full native details one click away. Choice-driven art and individual credits remain
visible throughout.

## Screenshots

**Calling selection — Mage**

![Hero’s Call showing the Mage class preview, its illustration, and the calling selection roster.](https://raw.githubusercontent.com/nessamurmur/heros-call/main/docs/screenshots/calling-mage.png)

**Ancestry selection — Bunbun**

![Hero’s Call showing the Bunbun ancestry preview, its symbol, and the ancestry selection roster.](https://raw.githubusercontent.com/nessamurmur/heros-call/main/docs/screenshots/ancestry-bunbun.png)

These screenshots show artwork from installed Nimble content. Available artwork
depends on the content installed in your world.

## Package identity

The module ID, installation folder, settings and actor-credit namespace are
`heros-call`. The first release archive is `heros-call-0.1.0.zip`, containing a
single `heros-call/` folder. There are no earlier public releases to migrate.

## Install and use

In Foundry's Setup screen, choose **Add-on Modules → Install Module** and paste
this manifest URL:

```text
https://github.com/nessamurmur/heros-call/releases/latest/download/module.json
```

Launch a Nimble world, enable **Hero's Call — Character Creation for Nimble** in
**Game Settings → Manage Modules**, then choose **Create Actor → Character**.

For a manual installation, download `heros-call-0.1.0.zip` from the
[release page](https://github.com/nessamurmur/heros-call/releases/tag/v0.1.0),
and extract it into your Foundry user data's `Data/modules` directory, producing
`Data/modules/heros-call/module.json`. Restart Foundry to discover a manually
installed package. After updating, refresh your browser and reopen the creator.

Source and issues: [nessamurmur/heros-call](https://github.com/nessamurmur/heros-call).
See [QA.md](QA.md) for the distinction between automated checks and historical
native testing, and [RELEASING.md](RELEASING.md) for the tag-based release workflow.

Optional macro:

```js
game.modules.get('heros-call').api.open();
```

This opens Nimble's native actor-type picker. Choose Character.

## Character creation

- Browse all eleven Calling previews with the mouse or Left/Right and Home/End.
  Previewing does not commit a class. **Explore this class** opens its native rules;
  **Choose this calling** selects it through the original Nimble control.
- Nine chapters follow the native builder: Calling, Ancestry, Background, Equipment,
  Potential, Attributes, Skills, Languages, and Begin.
- Ancestry and Background use focused rosters with descriptions. Left/Right and
  Home/End browse choices; confirmation commits through the original Nimble
  control. **Read all details** opens full rules. Art previews do not commit choices.
- Ancestry offers 15 distinct character illustrations. Uncovered ancestries use
  their own installed symbols rather than a shared landscape. Paired ancestries
  identify the illustrated example; a selected unsupported variant uses its
  symbol. See `ART-REVIEW.md` for the exact mappings and remaining gaps.
- All 24 backgrounds have distinct art: a forge for Tradesman/Artisan, mining
  tools for At Home Underground, spirits for Haunted Past, and other relevant
  scenes. Equipment previews distinguish class
  gear and gold. Hovering or focusing native arrays, attributes, skills and
  languages changes the chapter illustration. These are thematic examples, not
  exact depictions of the character, inventory or every possible ancestry.
- **Choose portrait for your hero** offers 30 character illustrations, including
  the new ancestry characters. An
  explicit portrait appears at the final Begin chapter and is applied to the
  actor and prototype token with its artist/license/source metadata. Earlier
  chapters continue to show their own art. **Keep automatic art** returns to the
  supported class/ancestry illustration at review and leaves actor portrait
  assignment to Nimble. Artwork does not alter rules or equipment.
- Equipment and Potential now preview on selection; the shared footer confirms
  through the original Nimble button. The action remains visible and disabled
  until a choice is ready. Ancestry gifts and single native confirmations use this
  same action bar. Optional size, variant, background and spell choices remain
  available beside the chapter artwork.
- In Attributes, select a modifier and then an attribute, using clicks or
  Enter/Space. Native drag/drop also works. Escape cancels a selected modifier.
  Assignment is sent through Nimble’s native drag/drop handlers; the module does
  not calculate stats or change the system’s rules.
- Skill training buttons have accessible names and selected states. Skills and
  Languages keep native limits and confirmations. Nimble skips the bonus-language
  step when Intelligence grants none.
- **Begin** shows a compact hero overview with Change actions for earlier choices.
  It reflects the chosen ancestry variant, attributes, trained skills and languages.
  **Read full character details** reveals the native review, including features,
  spells and other optional details. Complete the choices and enter a name to
  enable Create Character.
- **Return to your next choice** resumes the current step. **Classic view** restores
  the native layout, control attributes and submission without losing native
  choices; the optional Hero’s Call portrait override is discarded.
- **Art & credits** and the credit beside each figure open the attribution screen.
  Keyboard focus, modal Escape handling, and reduced-motion preferences are supported.

To use the native creator by default, turn off **Hero’s Call character creator** in module
settings, then reopen the helper.

## Implementation and limits

No build step or runtime dependency is needed. `scripts/heros-call.mjs` enhances the
native ApplicationV2 after render. Svelte-owned controls remain mounted; Nimble's
own submission method creates the character. The module includes no Nimble rules
or Originate code/assets and changes no system files.

The adapter depends on Nimble 0.10.0's stage IDs, progress classes, document-option
methods, and `submitCharacterCreation`. Compatibility is deliberately limited to
that version. Unknown sections remain visible; the Ancestry/Background roster yields to native
controls if unfamiliar sections appear. Enhancement errors attempt to
restore the native view. Interface additions are English. The final review and
creation controls were checked at 1440×1000, 1024×768 and 800×700. Small phones
are not a primary target.

Sixty-three illustrations are bundled as original PNG/JPEG/WebP files (approximately
227 MiB) to preserve source detail and redistribution records. Display scaling, soft-edge masks,
and short entrance transitions are CSS only. Paintings retain their original
colors against the dark interface. Reduced motion disables animation. Native
compendium thumbnails still come from your installed content packs.
There is no persistent draft storage, level-up flow, audio, controller support,
or custom-art configuration in this version.

## Development and validation

Use Node.js 22 or later and Python 3.10 or later. There are no dependencies to
install. Run these commands from a source checkout containing `module.json`
and `package.json` (development tools are not included in the installation ZIP):

```sh
npm test
npm run build
```

The build validates the manifest, JavaScript syntax, artwork inventory, hashes,
license records and publication boundary before creating the ZIP, a matching
manifest and checksums in `dist/`. `npm run check` runs validation without building.
Only the files inside this module folder belong in the public repository.

See [CONTRIBUTING.md](CONTRIBUTING.md), [QA.md](QA.md), and
[RELEASE-READINESS.md](RELEASE-READINESS.md) for development guidance, test coverage
and outstanding publication steps.

## Privacy

Hero’s Call includes no telemetry, remote scripts or external font requests.
Bundled artwork is loaded from your Foundry server. Rules and any custom-content
images come from your installed system and packs. Artist and license links open
external websites only when you follow them. Choosing a portrait stores its image
path and attribution on the created actor; the module does not save unfinished
drafts or send character details to an external service.

## Credits and license

Module code: MIT. Artwork has its own licenses:

- Santiago Iborra, Kathrin Polikeit, and Nico Goeminne — Arcmage / WTactics artwork,
  **CC BY-SA 4.0**.
- Kaitlyn Peavler, Sarah Carney and Amy Clare — Prismatic Art Collection,
  **CC BY-SA 3.0**.
- JAP and Eon Cire — OpenGameArt paintings, **CC0 1.0**.
- Kathrin Polikeit, Emilien Rotival and Phil Barber — selected Wesnoth portraits,
  **GPL-2.0-or-later**; Emilien Rotival's Jinn is **CC BY-SA 4.0**.
- hcjrArt — Dragon like character design, **CC BY 4.0**.
- Morgan Strauss (nubux) — Rat Knight, **CC BY 3.0**.
- AshiRox — Scavenger, Ancient Beast, **CC BY-SA 4.0**.
- Lorc — Hunting Horn emblem, **CC BY 3.0**.

See `CREDITS.md`, `licenses/art-sources.json`, `licenses/chapter-art-sources.json`,
and the included license texts. `ART-REVIEW.md` records the dated artist-policy
checks, their limits, and outstanding ancestry portraits.
These open licenses do not establish artist endorsement of this project or its
AI-assisted development workflow. No generative image processing was used.

Hero’s Call is independent of Nimble Co., Origin Studios, and ArenaNet.
