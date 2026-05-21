# Daily Dungeon Map Quality Upgrade Plan

This document reviews Daily Dungeon maps from the perspective of printable paid value. It is planning documentation only; no renderer, export, payment, backend, or dungeon data changes are implemented here.

## Current Map Quality Assessment

Daily Dungeon maps are currently useful tactical reference maps. They communicate keyed areas, connections, GM markers, secret routes, and player-safe hiding rules from the same `map.connections` data used by room exits.

That is a strong foundation, but the current premium maps are not yet paid-quality printable maps.

The main quality gaps:

- Many maps still read as SVG diagrams with decoration rather than polished printable tabletop maps.
- Some environments have strong theme cues, but floor material, terrain, walls, and route surfaces are not rich enough at print scale.
- Map details are optimized for in-app preview, not paper/PDF contrast, ink behavior, or full-page composition.
- Player maps mostly hide information correctly, but they do not yet feel like separate polished handouts.
- There is no print-specific map rendering mode, grid option, map-only export, or print QA matrix.
- Premium value is visible compared with Lantern, but not yet strong enough to carry a subscription by itself.

The maps are table-usable now as keyed reference maps. They are not yet convincing as paid printable adventure assets.

## Paid-Value Map Quality Target

Paid maps should make a GM feel they received something they would happily print or show players.

Target quality:

- Clear, readable keyed map at letter/A4 print size.
- Stronger material identity: stone, ice, lava rock, sand, forest floor, sewer water, crypt masonry, laboratory machinery, etc.
- More coherent silhouettes and terrain-driven layouts, not repeated room modules.
- Better print contrast for numbers, markers, walls, routes, and hazards.
- Cleaner player-safe presentation with fewer GM-facing visual artifacts.
- Optional grid/no-grid handling.
- Export-ready map framing that works inside a packet and as a standalone map.

The goal is not to compete with fully illustrated commercial battlemaps immediately. The near-term target is a polished keyed adventure map that is attractive enough to justify Adventurer value when paired with the printable packet.

## Print Map Requirements

Print-ready maps should:

- Fit cleanly on a page without cropping.
- Keep room numbers readable from a printed page.
- Keep GM markers readable but less visually dominant than room numbers.
- Preserve route clarity, including secret routes in GM maps only.
- Use print-safe contrast; pale textures should not disappear.
- Avoid overly dark fills that consume ink.
- Avoid tiny decorative details that become noise on paper.
- Support GM and player-safe versions from the same data.
- Support a future map-only page or standalone export.

Recommended print map modes:

- `screen`: current in-app map rendering.
- `print-gm`: larger labels, higher contrast, simplified texture, GM markers, secret routes, compact legend.
- `print-player`: clean presentation, no GM markers, no secret routes, no treasure/hazard markers, minimal legend.

Status: an initial `presentation="print"` mode has been added to `DungeonMap` and the Level 2 renderer path. The Print Packet now uses print presentation for both GM and player-safe maps, while normal in-app maps continue to use screen presentation by default. This first pass improves label backplates, route contrast, secret-route readability, marker contrast, and reduces low-value texture in print mode. Dedicated `print-gm` and `print-player` submodes may still be useful later.

## GM Map Requirements

GM maps should show:

- Keyed room/area numbers.
- GM markers for treasure, hazards, boss/objective, or similar notes.
- Secret routes and their legend.
- Clear normal routes derived from `map.connections`.
- Hazards when they are important for running the dungeon.
- Enough theme to orient the GM without reducing readability.

GM print maps should not:

- Let decorative texture compete with numbers.
- Use marker colors that disappear in grayscale.
- Hide route geometry under environmental effects.
- Require zooming to understand the dungeon.

## Player-Safe Map Requirements

Player maps should show:

- The same safe layout and visible connections.
- Premium visual style.
- Clean room/area landmarks if the table uses keyed exploration.
- Safe terrain and atmospheric details.

Player maps must hide:

- GM markers.
- Secret routes.
- Secret route legend.
- Treasure markers.
- Hazard labels if they reveal hidden danger.
- GM notes, secret labels, and objective labels not meant for players.

Player maps should feel less like a redacted GM map and more like an intentional handout. This likely needs print-specific styling, not only hidden SVG layers.

## Environment-by-Environment Quality Notes

### Blackfen / Original

Current quality: table-usable, thematically clear enough.

Strengths:

- Damp old-stone direction fits the dungeon premise.
- Works as a practical GM reference.

Weaknesses:

- Still reads like a constructed schematic with damp styling.
- Needs stronger wet stone, water staining, and old tollhouse/shrine identity at print scale.

Priority: medium.

### Shrine

Current quality: table-usable, but not yet paid-polished.

Strengths:

- Sacred ruin identity is present.
- Semi-open ritual ruin direction is appropriate.

Weaknesses:

- Still too close to normal room-and-corridor language.
- Needs better broken sacred architecture, partial walls, altar/courtyard composition, and print-safe stone detail.

Priority: high.

### Cavern

Current quality: one of the stronger identities.

Strengths:

- Organic renderer helps it avoid rectangular room patterns.
- Natural tunnel grammar differentiates it from constructed maps.

Weaknesses:

- Needs richer rock texture, cave edge depth, and print contrast.
- Pools/mineral details may need stronger printed definition.

Priority: medium.

### Crypt

Current quality: table-usable, moderate paid potential.

Strengths:

- Enclosed tomb grammar is distinct from open maps.
- Burial identity is present.

Weaknesses:

- Needs heavier tomb masonry, alcove banks, sarcophagus silhouettes, dust, and stronger dead-end compartment feel.
- Risks reading as generic stone dungeon when printed.

Priority: high.

### Sewer

Current quality: practical and thematically understandable.

Strengths:

- Water channels, grates, and damp route language provide clear identity.
- Works well as a keyed reference.

Weaknesses:

- Needs better water/ walkway separation and print-safe channel contrast.
- Could benefit from a clearer no-grid player-safe handout mode.

Priority: medium.

### Laboratory

Current quality: weaker paid identity.

Strengths:

- Arcane/workshop details exist.
- Functional facility direction is right.

Weaknesses:

- Still risks looking like stone rooms with arcane marks.
- Needs stronger apparatus zones, conduits, containment circles, benches, machinery silhouettes, and service-route structure.

Priority: high.

### Forest Ruin

Current quality: one of the stronger layout identities.

Strengths:

- Open keyed-area concept is distinct.
- Forest clearing/ruin hybrid reduces room-box repetition.

Weaknesses:

- Needs richer tree/ground/ruin integration for print.
- Player map could become a compelling handout if cleaned and framed better.

Priority: medium-high.

### Volcanic Forge

Current quality: strong layout identity, needs print tuning.

Strengths:

- Hazard-shaped 8-area structure is distinct.
- Lava and platform grammar create paid-value potential.

Weaknesses:

- Lava/hazard contrast must be carefully tuned for print.
- Needs to avoid dark muddy output or confusing hazards with routes.

Priority: medium-high.

### Frozen Ruin

Current quality: strong structural identity.

Strengths:

- Ice islands, bridges, crevasses, and reliquary fragments feel distinct.
- Good candidate for premium map appeal.

Weaknesses:

- Pale ice/snow details may wash out in print.
- Needs stronger ruin fragments and print-safe crack/crevasse contrast.

Priority: medium-high.

### Desert Temple

Current quality: promising and distinct.

Strengths:

- Sand-buried vertical/fragmented grammar differs from shrine and crypt.
- Dune paths, exposed platforms, and sunken chambers are good paid-value signals.

Weaknesses:

- Sand and sandstone tones may print too flat.
- Needs stronger buried-threshold, stair, column, and shadow hierarchy.

Priority: medium-high.

## Are Current SVG Maps Suitable For Print?

Yes, with improvement.

SVG remains the right near-term foundation because:

- It is deterministic.
- It scales without raster blur.
- It already derives routes from `map.connections`.
- It supports GM/player-safe variants from the same component path.
- It can eventually be serialized for SVG download.

The limitation is not SVG itself. The limitation is visual quality, print-specific styling, and export QA. A better SVG renderer can carry the near-term paid packet. Long-term illustrated or asset-generated images may still be needed for premium visual ambition.

## Should Print Maps Use A Separate Mode?

Yes.

The current screen renderer should not carry all print requirements. Print needs different priorities:

- Larger labels and markers.
- Higher contrast route and wall treatment.
- Reduced subtle texture.
- Less decorative noise.
- Clearer map captions and legends.
- Better grayscale behavior.
- Optional grid/no-grid controls.

Recommended API direction:

```ts
mapPresentation: 'screen' | 'print-gm' | 'print-player' | 'export-gm' | 'export-player'
```

This can start as an optional prop on `DungeonMap` and flow down through Level 2 renderers. It should not change `map.connections`.

## Grid / No-Grid

Maps should support optional grid/no-grid eventually.

Recommended behavior:

- Lantern schematic maps: no grid by default, optional simple grid later.
- GM premium print maps: optional faint grid if useful for table reference.
- Player premium print maps: no grid by default unless the GM explicitly wants it.
- Future PNG/SVG export: expose grid as an export option.

Grid must be visual metadata, not part of dungeon connectivity.

## GM vs Player Print Styling

GM and player maps should share geometry but not identical styling.

GM print maps:

- More labels, markers, secret routes, compact legend.
- Higher information density.
- Stronger keyed-number readability.

Player print maps:

- Cleaner legend or no legend.
- No GM-only marker vocabulary.
- Slightly more scenic presentation.
- Fewer explicit labels if they feel spoilery.

Player-safe maps should be designed as handouts, not just GM maps with hidden layers.

## Paid Value: PDF Packet, Map Export, Or Both?

Paid value likely needs both, but in sequence.

Recommended sequence:

1. Browser-print packet proves packet usefulness.
2. Print-optimized maps make the packet feel worth paying for.
3. SVG map download validates standalone map export.
4. PNG map export supports sharing and VTT-adjacent use.
5. Generated PDF/export bundle becomes the paid, reliable packaging layer.

If only one thing is built before charging, prioritize a polished printable packet with GM and player-safe maps. Map-only export is valuable, but the adventure packet is closer to the “I need prep now” paid use case.

## Recommended Technical Approach

Near term:

1. Improve current SVG renderers.
2. Add print-specific map presentation modes.
3. Add map QA screenshots/checklists across all 10 environments.
4. Improve player-safe handout styling.
5. Add optional grid/no-grid metadata and UI later.

Medium term:

1. Add SVG download for GM and player-safe maps.
2. Add PNG export after SVG serialization is reliable.
3. Add export option types for map presentation, grid, paper size, and color mode.
4. Consider local tile/asset primitives with stronger reusable wall/floor/terrain systems.

Long term:

1. Add curated or generated illustrated map image pipeline only after dungeon generation and validation are stable.
2. Generate GM and player-safe image assets from the same geometry and visibility rules.
3. Cache export-ready images and PDFs server-side.

## Recommended Next 10 Map Quality Tasks

1. Create a map print QA checklist for all 10 environments: GM map, player map, room number readability, route clarity, and secret hiding.
2. Improve player-safe print map styling so it feels like an intentional handout.
3. Add high-contrast print tokens for walls, floor, routes, labels, markers, water, lava, ice, sand, and forest terrain.
4. Tune the weakest paid-value environments first: laboratory, shrine, and crypt.
5. Add optional grid/no-grid support as renderer state, defaulting to no-grid for player maps.
6. Add standalone map-only print sections or presets in the Print Packet view.
7. Prototype SVG map serialization/download for GM and player-safe maps.
8. Prototype PNG export from the serialized SVG after style inlining is solved.
9. Define acceptance screenshots for Adventurer paid-value comparison: Lantern schematic vs premium GM print map vs premium player handout.
10. Decide whether `presentation="print"` should split into explicit `print-gm` and `print-player` modes after QA.

## Before Private Playtesting

Improve before private playtesting:

- Print-specific map mode for GM and player maps.
- Manual QA across all 10 environments.
- Player-safe leakage checklist.
- At least one pass on map label, marker, and route contrast in browser print/save-to-PDF.
- Clear framing in the packet so users understand these are prototype print maps.

Private playtesting can proceed without illustrated map images if the maps are honest, readable, and safe.

## Before Charging Money

Improve before charging:

- Premium maps must feel materially better than Lantern when printed.
- Player-safe maps must feel like real handouts.
- The weakest environments need visual upgrades or should be excluded from paid export claims.
- SVG/PDF output must be reliable enough that users do not need to fight browser quirks.
- Player-safe leakage must be tested and documented.
- Export options should be clear: full packet, GM map, player map, maybe ink-light mode.

Do not charge for premium maps if they still feel like decorated schematic diagrams.

## What To Postpone

Postpone:

- Full illustrated/generated map image pipeline.
- Server-side map image generation.
- VTT export.
- Dynamic fog-of-war print/export.
- Advanced map style marketplace.
- More environments.
- Complex grid scale controls.

These may become important later, but they should not distract from making the current 10 maps print-worthy.

## Recommended Next Technical Task

Create a map print QA checklist and tune the weakest environments against the new print presentation mode.

Why this first:

- The print presentation mode now exists; the next risk is whether every environment prints well.
- Laboratory, shrine, and crypt still need the most visual lift for paid value.
- QA should verify player-safe hiding before export formats become downloadable files.
- The results will inform whether `print-gm` and `print-player` need separate renderer branches.
