# Copy authorship inventory

All 336 extracted entries are initially pending. Check an item only after you
have authored the wording or verified its human-authored/factual provenance.
Existing drafts remain in the content files; this inventory deliberately does
not duplicate them. Editing a value or passing a check does not establish authorship.

Read [COPY-AUTHORING.md](COPY-AUTHORING.md) for editing instructions, the
difference between editable prose and source facts, and how to preview changes.
The paths below identify an exact entry; `ui` means `content/interface.mjs`.
Braced names are required placeholders. Leave the keys and placeholders intact.

## Class introductions — 33 entries

Edit [callings.mjs](../content/callings.mjs).

### Berserker

- [ ] `callings.berserker.motto` — short line below the class name.
- [ ] `callings.berserker.theme` — class theme keywords.
- [ ] `callings.berserker.copy` — class introduction paragraph.

### Commander

- [ ] `callings.commander.motto` — short line below the class name.
- [ ] `callings.commander.theme` — class theme keywords.
- [ ] `callings.commander.copy` — class introduction paragraph.

### Hunter

- [ ] `callings.hunter.motto` — short line below the class name.
- [ ] `callings.hunter.theme` — class theme keywords.
- [ ] `callings.hunter.copy` — class introduction paragraph.

### Mage

- [ ] `callings.mage.motto` — short line below the class name.
- [ ] `callings.mage.theme` — class theme keywords.
- [ ] `callings.mage.copy` — class introduction paragraph.

### Oathsworn

- [ ] `callings.oathsworn.motto` — short line below the class name.
- [ ] `callings.oathsworn.theme` — class theme keywords.
- [ ] `callings.oathsworn.copy` — class introduction paragraph.

### Shadowmancer

- [ ] `callings.shadowmancer.motto` — short line below the class name.
- [ ] `callings.shadowmancer.theme` — class theme keywords.
- [ ] `callings.shadowmancer.copy` — class introduction paragraph.

### Shepherd

- [ ] `callings.shepherd.motto` — short line below the class name.
- [ ] `callings.shepherd.theme` — class theme keywords.
- [ ] `callings.shepherd.copy` — class introduction paragraph.

### Songweaver

- [ ] `callings.songweaver.motto` — short line below the class name.
- [ ] `callings.songweaver.theme` — class theme keywords.
- [ ] `callings.songweaver.copy` — class introduction paragraph.

### Stormshifter

- [ ] `callings.stormshifter.motto` — short line below the class name.
- [ ] `callings.stormshifter.theme` — class theme keywords.
- [ ] `callings.stormshifter.copy` — class introduction paragraph.

### The Cheat

- [ ] `callings.the-cheat.motto` — short line below the class name.
- [ ] `callings.the-cheat.theme` — class theme keywords.
- [ ] `callings.the-cheat.copy` — class introduction paragraph.

### Zephyr

- [ ] `callings.zephyr.motto` — short line below the class name.
- [ ] `callings.zephyr.theme` — class theme keywords.
- [ ] `callings.zephyr.copy` — class introduction paragraph.

## Nine chapters — 36 entries

Edit [chapters.mjs](../content/chapters.mjs).

### Calling

- [ ] `chapters.calling.label` — navigation/overview label.
- [ ] `chapters.calling.title` — main chapter heading; Calling’s native feature/spell substeps; full class-selection view has separate interface text.
- [ ] `chapters.calling.description` — chapter introduction; Calling’s native feature/spell substeps; full class-selection view has separate interface text.
- [ ] `chapters.calling.hint` — default footer instruction; Calling’s native feature/spell substeps; full class-selection view has separate interface text.

### Ancestry

- [ ] `chapters.ancestry.label` — navigation/overview label.
- [ ] `chapters.ancestry.title` — main chapter heading.
- [ ] `chapters.ancestry.description` — chapter introduction.
- [ ] `chapters.ancestry.hint` — default footer instruction.

### Background

- [ ] `chapters.background.label` — navigation/overview label.
- [ ] `chapters.background.title` — main chapter heading.
- [ ] `chapters.background.description` — chapter introduction.
- [ ] `chapters.background.hint` — default footer instruction.

### Equipment

- [ ] `chapters.equipment.label` — navigation/overview label.
- [ ] `chapters.equipment.title` — main chapter heading.
- [ ] `chapters.equipment.description` — chapter introduction.
- [ ] `chapters.equipment.hint` — default footer instruction.

### Potential

- [ ] `chapters.potential.label` — navigation/overview label.
- [ ] `chapters.potential.title` — main chapter heading.
- [ ] `chapters.potential.description` — chapter introduction.
- [ ] `chapters.potential.hint` — default footer instruction.

### Attributes

- [ ] `chapters.attributes.label` — navigation/overview label.
- [ ] `chapters.attributes.title` — main chapter heading.
- [ ] `chapters.attributes.description` — chapter introduction.
- [ ] `chapters.attributes.hint` — default footer instruction.

### Skills

- [ ] `chapters.skills.label` — navigation/overview label.
- [ ] `chapters.skills.title` — main chapter heading.
- [ ] `chapters.skills.description` — chapter introduction.
- [ ] `chapters.skills.hint` — default footer instruction.

### Languages

- [ ] `chapters.languages.label` — navigation/overview label.
- [ ] `chapters.languages.title` — main chapter heading.
- [ ] `chapters.languages.description` — chapter introduction.
- [ ] `chapters.languages.hint` — default footer instruction.

### Begin

- [ ] `chapters.begin.label` — navigation/overview label.
- [ ] `chapters.begin.title` — main chapter heading.
- [ ] `chapters.begin.description` — chapter introduction.
- [ ] `chapters.begin.hint` — default footer instruction.

## Interface text — 141 entries

Edit [interface.mjs](../content/interface.mjs).

### Calling page: class preview and fallback text

- [ ] `ui.calling.fallbackDescription` — fallback description.
- [ ] `ui.calling.title` — title.
- [ ] `ui.calling.rosterLabel` — roster label.
- [ ] `ui.calling.hint` — hint.
- [ ] `ui.calling.fallbackName` — fallback name.
- [ ] `ui.calling.fallbackMotto` — fallback motto.
- [ ] `ui.calling.fallbackTheme` — fallback theme.
- [ ] `ui.calling.fallbackClass` — fallback class.
- [ ] `ui.calling.eyebrow` — eyebrow.
- [ ] `ui.calling.explore` — explore.
- [ ] `ui.calling.confirm` — confirm.
- [ ] `ui.calling.complexity` — complexity; keep `{rating}`.

### Shared navigation, confirmation, and accessibility text

- [ ] `ui.common.chooseAndContinue` — choose and continue; keep `{title}`.
- [ ] `ui.common.previewWithSource` — preview with source; keep `{source}`, `{title}`.
- [ ] `ui.common.preview` — preview; keep `{title}`.
- [ ] `ui.common.thisOption` — this option.
- [ ] `ui.common.credits` — credits.
- [ ] `ui.common.close` — close.

### Ancestry through Begin: rosters, actions, and conditional prompts

- [ ] `ui.journey.regionLabel` — region label.
- [ ] `ui.journey.readDetails` — read details.
- [ ] `ui.journey.previous` — previous.
- [ ] `ui.journey.fallbackName` — fallback name.
- [ ] `ui.journey.chapterCount` — chapter count; keep `{label}`, `{number}`, `{total}`.
- [ ] `ui.journey.ancestryCount` — ancestry count; keep `{count}`.
- [ ] `ui.journey.backgroundCount` — background count; keep `{count}`.
- [ ] `ui.journey.ancestryPreviews` — ancestry previews.
- [ ] `ui.journey.backgroundPreviews` — background previews.
- [ ] `ui.journey.fallbackChoice` — fallback choice.
- [ ] `ui.journey.ready` — ready.
- [ ] `ui.journey.equipmentHint` — equipment hint.
- [ ] `ui.journey.potentialHint` — potential hint.
- [ ] `ui.journey.assignHint` — assign hint; keep `{modifier}`.
- [ ] `ui.journey.trainingReady` — training ready.
- [ ] `ui.journey.languagesReady` — languages ready.
- [ ] `ui.journey.ancestryGiftTitle` — ancestry gift title.
- [ ] `ui.journey.ancestryShapeTitle` — ancestry shape title.
- [ ] `ui.journey.ancestryGiftDescription` — ancestry gift description.
- [ ] `ui.journey.ancestryShapeDescription` — ancestry shape description.
- [ ] `ui.journey.return` — return.
- [ ] `ui.journey.chooseAncestry` — choose ancestry.
- [ ] `ui.journey.chooseBackground` — choose background.
- [ ] `ui.journey.takeGold` — take gold.
- [ ] `ui.journey.takeEquipment` — take equipment.
- [ ] `ui.journey.choosePotential` — choose potential.
- [ ] `ui.journey.confirmAttributes` — confirm attributes.
- [ ] `ui.journey.confirmTraining` — confirm training.
- [ ] `ui.journey.confirmLanguages` — confirm languages.
- [ ] `ui.journey.completeChoices` — complete choices.

### Choice-details panel and rules dialog

- [ ] `ui.details.loading` — loading.
- [ ] `ui.details.empty` — empty.
- [ ] `ui.details.unavailable` — unavailable.
- [ ] `ui.details.title` — title.
- [ ] `ui.details.hint` — hint.
- [ ] `ui.details.eyebrow` — eyebrow.
- [ ] `ui.details.modalTitle` — modal title.

### Attribute/skill control accessibility labels

- [ ] `ui.controls.selectModifier` — select modifier; keep `{modifier}`.
- [ ] `ui.controls.assignModifier` — assign modifier; keep `{attribute}`.
- [ ] `ui.controls.trainingPoints` — training points; keep `{count}`, `{skill}`.
- [ ] `ui.controls.trainingPoint` — training point; keep `{count}`, `{skill}`.

### Begin: completed-character overview

- [ ] `ui.review.regionLabel` — region label.
- [ ] `ui.review.readDetails` — read details.
- [ ] `ui.review.change` — change.
- [ ] `ui.review.changeLabel` — change label; keep `{label}`.
- [ ] `ui.review.none` — none.
- [ ] `ui.review.back` — back.
- [ ] `ui.review.ancestryGift` — ancestry gift; keep `{gift}`.
- [ ] `ui.review.gold` — gold.
- [ ] `ui.review.equipment` — equipment.
- [ ] `ui.review.training` — training.
- [ ] `ui.review.defaultLanguage` — default language.
- [ ] `ui.review.pointsInvested` — points invested; keep `{count}`.

### Illustration caption, alternative text, and load failure

- [ ] `ui.hero.fallbackLabel` — fallback label.
- [ ] `ui.hero.previewPrefix` — preview prefix.
- [ ] `ui.hero.matchedIllustration` — matched illustration; keep `{ancestry}`, `{calling}`.
- [ ] `ui.hero.callingIllustration` — calling illustration; keep `{ancestry}`.
- [ ] `ui.hero.installedIllustration` — installed illustration.
- [ ] `ui.hero.installedAncestryCredits` — installed ancestry credits.
- [ ] `ui.hero.creditsLink` — credits link.
- [ ] `ui.hero.artCreditsLabel` — art credits label; keep `{artist}`, `{title}`.
- [ ] `ui.hero.imageDescription` — image description; keep `{label}`, `{note}`.
- [ ] `ui.hero.installedClassIllustration` — installed class illustration.
- [ ] `ui.hero.unavailable` — unavailable.
- [ ] `ui.hero.installedClassAlt` — installed class alt.

### Chapter/ancestry art subjects and explanatory tooltips

- [ ] `ui.scenes.ancestryCaptions.Dryad/Shroomling` — caption qualifying the Dryad/Shroomling example.
- [ ] `ui.scenes.ancestryCaptions.Minotaur/Beastfolk` — caption qualifying the Minotaur/Beastfolk example.
- [ ] `ui.scenes.ancestryCaptions.Oozeling/Construct` — caption qualifying the Oozeling/Construct example.
- [ ] `ui.scenes.ancestryCaptions.Kobold` — caption qualifying the Kobold example.
- [ ] `ui.scenes.ancestryCaptions.Planarbeing` — caption qualifying the Planarbeing example.
- [ ] `ui.scenes.ancestryCaptions.Wyrdling` — caption qualifying the Wyrdling example.
- [ ] `ui.scenes.fallbackSubject` — fallback subject.
- [ ] `ui.scenes.ancestrySymbol` — ancestry symbol; keep `{label}`.
- [ ] `ui.scenes.symbolUnavailable` — symbol unavailable.
- [ ] `ui.scenes.symbolExplanation` — symbol explanation.
- [ ] `ui.scenes.gold` — gold.
- [ ] `ui.scenes.equipment` — equipment.
- [ ] `ui.scenes.provisions` — provisions.
- [ ] `ui.scenes.ancestryIllustration` — ancestry illustration; keep `{subject}`.
- [ ] `ui.scenes.chapterIllustration` — chapter illustration; keep `{subject}`.
- [ ] `ui.scenes.chapterUnavailable` — chapter unavailable.
- [ ] `ui.scenes.equipmentExplanation` — equipment explanation.
- [ ] `ui.scenes.chapterExplanation` — chapter explanation.

### Art & credits dialog

- [ ] `ui.credits.eyebrow` — eyebrow.
- [ ] `ui.credits.introduction` — introduction.
- [ ] `ui.credits.licenses` — licenses.
- [ ] `ui.credits.originalArtwork` — original artwork.
- [ ] `ui.credits.emblem` — emblem.
- [ ] `ui.credits.originalIcon` — original icon.
- [ ] `ui.credits.emblemChanges` — emblem changes.
- [ ] `ui.credits.independence` — independence.

### Portrait picker dialog

- [ ] `ui.gallery.introduction` — introduction.
- [ ] `ui.gallery.automatic` — automatic.
- [ ] `ui.gallery.chooseLabel` — choose label; keep `{subject}`.
- [ ] `ui.gallery.licenseNote` — license note.
- [ ] `ui.gallery.title` — title.

### Right-hand character/chapter preview

- [ ] `ui.portrait.chapterLabel` — chapter label; keep `{chapter}`.
- [ ] `ui.portrait.heroLabel` — hero label.
- [ ] `ui.portrait.unnamed` — unnamed.
- [ ] `ui.portrait.originHint` — origin hint.
- [ ] `ui.portrait.change` — change.
- [ ] `ui.portrait.choose` — choose.
- [ ] `ui.portrait.finalTooltip` — final tooltip.
- [ ] `ui.portrait.chapterTooltip` — chapter tooltip.
- [ ] `ui.portrait.shortChoose` — short choose.
- [ ] `ui.portrait.regionLabel` — region label.

### Brand, navigation, and chapter counters

- [ ] `ui.shell.chapterCount` — chapter count; keep `{number}`, `{total}`.
- [ ] `ui.shell.brandLabel` — brand label.
- [ ] `ui.shell.system` — system.
- [ ] `ui.shell.name` — name.
- [ ] `ui.shell.classic` — classic.
- [ ] `ui.shell.story` — story.
- [ ] `ui.shell.chaptersLabel` — chapters label.
- [ ] `ui.shell.chapterLabel` — chapter label; keep `{label}`, `{number}`.
- [ ] `ui.shell.railFirstLine` — rail first line.
- [ ] `ui.shell.railSecondLine` — rail second line.

### Character-creation tooltips and failure notification

- [ ] `ui.submit.incomplete` — incomplete.
- [ ] `ui.submit.nameRequired` — name required.
- [ ] `ui.submit.ready` — ready.
- [ ] `ui.submit.failed` — failed.

### Foundry module setting and enhancement-failure notification

- [ ] `ui.settings.name` — name.
- [ ] `ui.settings.hint` — hint.
- [ ] `ui.settings.themeFailed` — theme failed.

## Artwork descriptions — 126 entries

Edit [artwork.mjs](../content/artwork.mjs).

### Elf Male Caster — Santiago Iborra

- [ ] `artwork.elf-mage.subject` — portrait label / image alternative text.
- [ ] `artwork.elf-mage.changes` — per-artwork credit: factual modification/presentation notice.

### Archer — Kathrin Polikeit

- [ ] `artwork.elf-hunter.subject` — portrait label / image alternative text.
- [ ] `artwork.elf-hunter.changes` — per-artwork credit: factual modification/presentation notice.

### Barbarian Dwarf — Santiago Iborra

- [ ] `artwork.dwarf-berserker.subject` — portrait label / image alternative text.
- [ ] `artwork.dwarf-berserker.changes` — per-artwork credit: factual modification/presentation notice.

### Orc Drummer — Santiago Iborra

- [ ] `artwork.orc-songweaver.subject` — portrait label / image alternative text.
- [ ] `artwork.orc-songweaver.changes` — per-artwork credit: factual modification/presentation notice.

### Human Female Fighter — Santiago Iborra

- [ ] `artwork.human-commander.subject` — portrait label / image alternative text.
- [ ] `artwork.human-commander.changes` — per-artwork credit: factual modification/presentation notice.

### Falconer — Santiago Iborra

- [ ] `artwork.falconer.subject` — portrait label / image alternative text.
- [ ] `artwork.falconer.changes` — per-artwork credit: factual modification/presentation notice.

### Knight — Nico Goeminne

- [ ] `artwork.knight.subject` — portrait label / image alternative text.
- [ ] `artwork.knight.changes` — per-artwork credit: factual modification/presentation notice.

### Orc Shaman — Santiago Iborra

- [ ] `artwork.orc-shaman.subject` — portrait label / image alternative text.
- [ ] `artwork.orc-shaman.changes` — per-artwork credit: factual modification/presentation notice.

### Sneaking Elven Scout — Santiago Iborra

- [ ] `artwork.scout.subject` — portrait label / image alternative text.
- [ ] `artwork.scout.changes` — per-artwork credit: factual modification/presentation notice.

### Nun — Santiago Iborra

- [ ] `artwork.martial-artist.subject` — portrait label / image alternative text.
- [ ] `artwork.martial-artist.changes` — per-artwork credit: factual modification/presentation notice.

### Shapeshift — Santiago Iborra

- [ ] `artwork.shapeshift.subject` — portrait label / image alternative text.
- [ ] `artwork.shapeshift.changes` — per-artwork credit: factual modification/presentation notice.

### Human Male Fighter — Santiago Iborra

- [ ] `artwork.human-warrior.subject` — portrait label / image alternative text.
- [ ] `artwork.human-warrior.changes` — per-artwork credit: factual modification/presentation notice.

### Mentor — Santiago Iborra

- [ ] `artwork.mentor.subject` — portrait label / image alternative text.
- [ ] `artwork.mentor.changes` — per-artwork credit: factual modification/presentation notice.

### Elvish Druid — Kathrin Polikeit (Kitty)

- [ ] `artwork.nature-druid.subject` — portrait label / image alternative text.
- [ ] `artwork.nature-druid.changes` — per-artwork credit: factual modification/presentation notice.

### Paladin — Emilien Rotival (LordBob)

- [ ] `artwork.holy-paladin.subject` — portrait label / image alternative text.
- [ ] `artwork.holy-paladin.changes` — per-artwork credit: factual modification/presentation notice.

### Mage of Light — Kathrin Polikeit (Kitty)

- [ ] `artwork.light-priest.subject` — portrait label / image alternative text.
- [ ] `artwork.light-priest.changes` — per-artwork credit: factual modification/presentation notice.

### Martial Arts — Amy Clare

- [ ] `artwork.martial-training.subject` — portrait label / image alternative text.
- [ ] `artwork.martial-training.changes` — per-artwork credit: factual modification/presentation notice.

### Sitting Elf — Santiago Iborra

- [ ] `artwork.sitting-elf.subject` — portrait label / image alternative text.
- [ ] `artwork.sitting-elf.changes` — per-artwork credit: factual modification/presentation notice.

### Jump — Santiago Iborra

- [ ] `artwork.jump.subject` — portrait label / image alternative text.
- [ ] `artwork.jump.changes` — per-artwork credit: factual modification/presentation notice.

### Whirlwind — Santiago Iborra

- [ ] `artwork.whirlwind.subject` — portrait label / image alternative text.
- [ ] `artwork.whirlwind.changes` — per-artwork credit: factual modification/presentation notice.

### Medical Attention — Santiago Iborra

- [ ] `artwork.medical-attention.subject` — portrait label / image alternative text.
- [ ] `artwork.medical-attention.changes` — per-artwork credit: factual modification/presentation notice.

### Squad Leader — Santiago Iborra

- [ ] `artwork.squad-leader.subject` — portrait label / image alternative text.
- [ ] `artwork.squad-leader.changes` — per-artwork credit: factual modification/presentation notice.

### Dryads Flute — Santiago Iborra

- [ ] `artwork.dryads-flute.subject` — portrait label / image alternative text.
- [ ] `artwork.dryads-flute.changes` — per-artwork credit: factual modification/presentation notice.

### Nourished Flower — Santiago Iborra

- [ ] `artwork.nourished-flower.subject` — portrait label / image alternative text.
- [ ] `artwork.nourished-flower.changes` — per-artwork credit: factual modification/presentation notice.

### Elven Forest — Santiago Iborra

- [ ] `artwork.elven-forest.subject` — portrait label / image alternative text.
- [ ] `artwork.elven-forest.changes` — per-artwork credit: factual modification/presentation notice.

### Druid — Kathrin Polikeit

- [ ] `artwork.fairy-druid.subject` — portrait label / image alternative text.
- [ ] `artwork.fairy-druid.changes` — per-artwork credit: factual modification/presentation notice.

### Female Elf Caster — Kathrin Polikeit

- [ ] `artwork.female-elf-caster.subject` — portrait label / image alternative text.
- [ ] `artwork.female-elf-caster.changes` — per-artwork credit: factual modification/presentation notice.

### Scroll Raider — Kaitlyn Peavler

- [ ] `artwork.scroll-raider.subject` — portrait label / image alternative text.
- [ ] `artwork.scroll-raider.changes` — per-artwork credit: factual modification/presentation notice.

### Warrior — Sarah Carney

- [ ] `artwork.warrior-study.subject` — portrait label / image alternative text.
- [ ] `artwork.warrior-study.changes` — per-artwork credit: factual modification/presentation notice.

### Wizard Tower — JAP

- [ ] `artwork.wizard-tower.subject` — portrait label / image alternative text.
- [ ] `artwork.wizard-tower.changes` — per-artwork credit: factual modification/presentation notice.

### Island Cove — Eon Cire

- [ ] `artwork.island-cove.subject` — portrait label / image alternative text.
- [ ] `artwork.island-cove.changes` — per-artwork credit: factual modification/presentation notice.

### Elk Skull Lodge — Eon Cire

- [ ] `artwork.skull-lodge.subject` — portrait label / image alternative text.
- [ ] `artwork.skull-lodge.changes` — per-artwork credit: factual modification/presentation notice.

### Innkeeper — Santiago Iborra

- [ ] `artwork.innkeeper.subject` — portrait label / image alternative text.
- [ ] `artwork.innkeeper.changes` — per-artwork credit: factual modification/presentation notice.

### Smith — Santiago Iborra

- [ ] `artwork.smith.subject` — portrait label / image alternative text.
- [ ] `artwork.smith.changes` — per-artwork credit: factual modification/presentation notice.

### Goblin Scrap Gatherer — Santiago Iborra

- [ ] `artwork.goblin-salvager.subject` — portrait label / image alternative text.
- [ ] `artwork.goblin-salvager.changes` — per-artwork credit: factual modification/presentation notice.

### Bilocation — Santiago Iborra

- [ ] `artwork.reflection.subject` — portrait label / image alternative text.
- [ ] `artwork.reflection.changes` — per-artwork credit: factual modification/presentation notice.

### Botanist — Santiago Iborra

- [ ] `artwork.botanist.subject` — portrait label / image alternative text.
- [ ] `artwork.botanist.changes` — per-artwork credit: factual modification/presentation notice.

### Gold Vein Find — Santiago Iborra

- [ ] `artwork.gold-vein.subject` — portrait label / image alternative text.
- [ ] `artwork.gold-vein.changes` — per-artwork credit: factual modification/presentation notice.

### Goblin Against The Wind — Santiago Iborra

- [ ] `artwork.goblin-wind.subject` — portrait label / image alternative text.
- [ ] `artwork.goblin-wind.changes` — per-artwork credit: factual modification/presentation notice.

### Wight — Santiago Iborra

- [ ] `artwork.wight.subject` — portrait label / image alternative text.
- [ ] `artwork.wight.changes` — per-artwork credit: factual modification/presentation notice.

### Potion Making — Santiago Iborra

- [ ] `artwork.potion-making.subject` — portrait label / image alternative text.
- [ ] `artwork.potion-making.changes` — per-artwork credit: factual modification/presentation notice.

### Armory — Santiago Iborra

- [ ] `artwork.armory.subject` — portrait label / image alternative text.
- [ ] `artwork.armory.changes` — per-artwork credit: factual modification/presentation notice.

### Conscript — Santiago Iborra

- [ ] `artwork.conscript.subject` — portrait label / image alternative text.
- [ ] `artwork.conscript.changes` — per-artwork credit: factual modification/presentation notice.

### Spiritual Revolt — Santiago Iborra

- [ ] `artwork.restless-spirits.subject` — portrait label / image alternative text.
- [ ] `artwork.restless-spirits.changes` — per-artwork credit: factual modification/presentation notice.

### Condemn — Santiago Iborra

- [ ] `artwork.condemned.subject` — portrait label / image alternative text.
- [ ] `artwork.condemned.changes` — per-artwork credit: factual modification/presentation notice.

### Elven Coat — Santiago Iborra

- [ ] `artwork.elven-coat.subject` — portrait label / image alternative text.
- [ ] `artwork.elven-coat.changes` — per-artwork credit: factual modification/presentation notice.

### Satyr — Santiago Iborra

- [ ] `artwork.satyr.subject` — portrait label / image alternative text.
- [ ] `artwork.satyr.changes` — per-artwork credit: factual modification/presentation notice.

### Cutpurse Imp — Santiago Iborra

- [ ] `artwork.cutpurse.subject` — portrait label / image alternative text.
- [ ] `artwork.cutpurse.changes` — per-artwork credit: factual modification/presentation notice.

### Clockwork — Santiago Iborra

- [ ] `artwork.clockwork.subject` — portrait label / image alternative text.
- [ ] `artwork.clockwork.changes` — per-artwork credit: factual modification/presentation notice.

### Vulture Assassin — Santiago Iborra

- [ ] `artwork.street-scout.subject` — portrait label / image alternative text.
- [ ] `artwork.street-scout.changes` — per-artwork credit: factual modification/presentation notice.

### Dwarvish Explorer — Phil Barber (thespaceinvader)

- [ ] `artwork.dwarf-explorer.subject` — portrait label / image alternative text.
- [ ] `artwork.dwarf-explorer.changes` — per-artwork credit: factual modification/presentation notice.

### Orcish Grunt — Emilien Rotival (LordBob)

- [ ] `artwork.orc-warrior.subject` — portrait label / image alternative text.
- [ ] `artwork.orc-warrior.changes` — per-artwork credit: factual modification/presentation notice.

### Saurian Augur — Phil Barber (thespaceinvader)

- [ ] `artwork.scaled-augur.subject` — portrait label / image alternative text.
- [ ] `artwork.scaled-augur.changes` — per-artwork credit: factual modification/presentation notice.

### Wose — Emilien Rotival (LordBob)

- [ ] `artwork.living-tree.subject` — portrait label / image alternative text.
- [ ] `artwork.living-tree.changes` — per-artwork credit: factual modification/presentation notice.

### Giant Mudcrawler — Kathrin Polikeit (Kitty)

- [ ] `artwork.living-ooze.subject` — portrait label / image alternative text.
- [ ] `artwork.living-ooze.changes` — per-artwork credit: factual modification/presentation notice.

### Fire Guardian — Emilien Rotival (LordBob)

- [ ] `artwork.living-flame.subject` — portrait label / image alternative text.
- [ ] `artwork.living-flame.changes` — per-artwork credit: factual modification/presentation notice.

### Jinn — Emilien Rotival (LordBob)

- [ ] `artwork.planar-jinn.subject` — portrait label / image alternative text.
- [ ] `artwork.planar-jinn.changes` — per-artwork credit: factual modification/presentation notice.

### Dragon like character design — hcjrArt

- [ ] `artwork.dragon-adventurer.subject` — portrait label / image alternative text.
- [ ] `artwork.dragon-adventurer.changes` — per-artwork credit: factual modification/presentation notice.

### Rat Knight — Rat People — Morgan Strauss (nubux)

- [ ] `artwork.rat-knight.subject` — portrait label / image alternative text.
- [ ] `artwork.rat-knight.changes` — per-artwork credit: factual modification/presentation notice.

### Scavenger — AshiRox

- [ ] `artwork.feathered-traveller.subject` — portrait label / image alternative text.
- [ ] `artwork.feathered-traveller.changes` — per-artwork credit: factual modification/presentation notice.

### Martial Landscape — Amy Clare

- [ ] `artwork.acrobat-practice.subject` — portrait label / image alternative text.
- [ ] `artwork.acrobat-practice.changes` — per-artwork credit: factual modification/presentation notice.

### Aristocrat — Kaitlyn Peavler

- [ ] `artwork.aristocrat.subject` — portrait label / image alternative text.
- [ ] `artwork.aristocrat.changes` — per-artwork credit: factual modification/presentation notice.

### Explorer — Kaitlyn Peavler

- [ ] `artwork.explorer.subject` — portrait label / image alternative text.
- [ ] `artwork.explorer.changes` — per-artwork credit: factual modification/presentation notice.

## Existing config, Markdown, and listing copy

- [ ] `module.json` → `description`: author the Foundry package summary.
- [ ] `module.json` → `title`, `authors[].name`: confirm the chosen name and attribution.
- [ ] `README.md`: review public overview/features, instructions, image alt text, and captions.
- [ ] `CREDITS.md`: review explanatory prose; preserve the sourced attribution table and obligations.
- [ ] `ART-REVIEW.md`: review editorial explanations without changing recorded evidence or uncertainty.
- [ ] `licenses/ancient-beast-notice.md`: review the summary while preserving upstream facts and links.
- [ ] Technical Markdown (`QA.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `RELEASING.md`, `RELEASE-READINESS.md`, this guide/inventory): review as desired; document any retained AI assistance honestly.
- [ ] Foundry website description: author separately in the package submission form.
- [ ] README/listing screenshots: refresh after rewriting the visible UI copy.

Original license texts, copyright notices, artist names, original artwork titles,
Nimble-owned rules/descriptions, and native identity constants are outside this
creative rewrite checklist. Preserve and verify those sources.
