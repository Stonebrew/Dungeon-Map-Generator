# Daily Dungeon Map Rendering Roadmap

This document outlines how Daily Dungeon maps should evolve from the current prototype renderer into more polished premium map experiences without breaking the dungeon data contract.

## 1. Current Renderer

Daily Dungeon currently supports two map presentations from the same dungeon data.

### Lantern Schematic Map

Lantern users receive a simple black-and-white GM map. It is intentionally functional: rooms, corridors, room numbers, and GM markers are readable with minimal visual treatment.

Strengths:

- Fast and lightweight.
- Easy to read on mobile.
- Clearly useful as a free GM reference.
- Uses the same room layout and `map.connections` as premium maps.

Limitations:

- Not intended to feel table-ready or visually premium.
- Does not communicate much theme, terrain, or atmosphere.
- Best for prep and reference, not presentation.

### Enhanced SVG Map

Adventurer and Dungeonwright users receive the enhanced SVG renderer. It uses the same room shapes, room numbers, GM markers, player-safe behavior, and `map.connections`, but adds richer SVG material treatment.

Strengths:

- Still fully deterministic and local to the frontend prototype.
- Keeps route rendering tied to `map.connections`.
- Supports GM and player-safe variants.
- Provides visible premium value through stone floors, heavier walls, corridor treatment, and theme details.

Limitations:

- Still not a fully illustrated battlemap.
- Room geometry is local to the renderer rather than generated from backend geometry.
- Decorative details are hand-authored per map style.
- SVG complexity will grow if used as the only long-term map solution.

## 2. Target Visual Quality

Premium maps should feel like polished tabletop map previews, not merely colored diagrams.

The target direction:

- Stone rooms should visibly read as stone rooms.
- Floor materials should include tile seams, cracked slabs, rough cave stone, sewer channels, or arcane flooring where appropriate.
- Walls should feel thick and dimensional, with outer shadow, inner highlight, and masonry detail.
- Corridors should look like walkable routes with floor material, not just connector lines.
- Theme-specific details should support the dungeon premise without cluttering the map.
- Player-safe maps should feel clean enough to show players while hiding GM-only data.
- Room numbers and GM markers must remain readable at mobile sizes.

Decoration should serve table use. Readability matters more than visual density.

## 3. Recommended Future Renderer Levels

### Level 1: Enhanced SVG Renderer

This is the current direction.

Benefits:

- No external assets required.
- Easy to keep deterministic.
- Cheap to render and bundle.
- Works well for prototype iteration.
- Can derive corridors and secret routes directly from `map.connections`.

Risks:

- Can become hard to maintain as visual complexity grows.
- Hand-authored map layouts may drift from generated geometry if not carefully controlled.
- SVG decoration can look schematic if pushed too lightly, or cluttered if pushed too far.

Implementation difficulty: Low to medium.

Cost implications: Very low runtime and generation cost.

Interaction with `map.connections`:

- `map.connections` remains the source of truth.
- Normal routes render from normal connections.
- Secret routes render from secret connections in GM views only.
- Prototype `path` values can continue to drive route geometry until richer geometry exists.

### Level 2: Tile/Asset-Based Renderer

Level 2 would introduce a deterministic map skinning layer using local tile primitives or generated vector/bitmap assets bundled with the app.

In the current prototype, Level 2 should be explored one map style at a time. Shrine/ruins, crypt, sewer, laboratory/workshop, blackfen/original, cavern, enchanted forest ruin, volcanic forge ruin, and frozen ruin/arctic cave now use the shared Level 2 renderer family. Building each style incrementally keeps the renderer understandable and makes it easier to compare Level 2 quality against the existing enhanced SVG fallback before converting every map style.

Benefits:

- Stronger visual quality than pure hand-authored SVG.
- Easier reuse of stone floors, walls, doors, rubble, water, pipes, and runes.
- Can support multiple visual skins for the same map data.
- Better path toward export-ready images.

Visual acceptance criteria:

- Rooms look assembled from reusable floor, wall, corner, and detail primitives rather than plain shapes with decoration.
- Stone walls read as repeated masonry blocks with visible corners, depth, shadow, and chipped edges.
- Room floors use visible tile assets, cracked tiles, color variation, and material seams.
- Corridors look like walkable slab paths and are still derived from connection data.
- Theme details are placed deterministically and remain readable at mobile preview sizes.
- GM maps show room numbers, markers, and secret routes; player-safe maps hide GM-only data while keeping the premium visual skin.

Required asset categories:

- Stone floor tile
- Wall block
- Wall corner
- Cracked tile
- Corridor slab
- Moss patch
- Rubble pile
- Water tile or channel
- Sewer pipe segment
- Drain grate
- Sludge stain and runoff marks
- Arcane circle and rune mark
- Workbench silhouette
- Gear or mechanical mark
- Brass conduit or pipe
- Scorched stain and experimental residue
- Broken apparatus and small tool debris
- Damp stone patch
- Broken threshold stones
- Old shrine or tollhouse barrier mark
- Irregular cavern chamber
- Mineral vein
- Underground pool
- Fungus patch
- Natural stone cluster
- Stairs
- Pillar
- Altar or shrine mark
- Broken wall segment
- Small debris/chips

How Level 2 differs from enhanced SVG:

- Enhanced SVG improves the schematic renderer with material styling and inline decoration.
- Level 2 treats the map as an assembly of reusable local visual primitives.
- Enhanced SVG can remain the fallback for unsupported styles.
- Level 2 should eventually introduce clearer separation between geometry and visual skin.

Risks:

- Asset management adds complexity.
- Requires a clearer separation between map geometry and visual skin.
- Mobile performance must be monitored if many assets or filters are used.
- Player-safe versions must be generated from the same hidden-data rules.

Implementation difficulty: Medium.

Cost implications: Low runtime cost if assets are local and cached. Higher design/asset production cost.

Interaction with `map.connections`:

- `map.connections` should still define connectivity.
- A separate geometry layer can define room bounds, corridor anchors, doors, and route shapes.
- Visual tiles should be placed from geometry derived from the same connection records, not from independent hand-drawn corridors.
- Level 2 route rendering must continue to derive normal corridors and GM-only secret routes from `map.connections`.

Current implementation notes:

- `DungeonMap` stays mostly orchestration: it owns the map card, SVG frame, legend, fog overlay, and renderer selection.
- Lantern schematic rendering lives in `src/components/maps/schematic/SchematicDungeonMap.tsx`.
- The old enhanced SVG renderer lives in `src/components/maps/fallback/EnhancedFallbackMap.tsx` as a fallback for unsupported future styles or dev testing.
- The compatibility barrel `src/components/maps/LevelTwoMapRenderer.tsx` re-exports the organized Level 2 modules.
- Shared Level 2 code lives under `src/components/maps/level-two/shared/`.
- Environment-specific renderers live under `src/components/maps/level-two/environments/`.
- `src/components/maps/level-two/registry.ts` maps each `mapStyle` to its renderer, theme tokens, geometry strategy, supported renderer level, route variant, and player-safe hiding rules.
- `LevelTwoMapTheme` in `src/components/maps/level-two/themes.ts` holds theme tokens for floor palettes, foundation tones, wall tones, corridor colors, terrain details, moss, water, dust, and rubble.
- `LevelTwoFoundation` renders only a soft, irregular terrain wash beneath the dungeon. It should not render broad brick fields or masonry wallpaper outside playable rooms and corridors.
- `LevelTwoConnectionRoutes` renders normal corridors and GM-only secret routes from `map.connections`.
- `LevelTwoRoomShell` renders reusable constructed-room structure: floor tiles, thick walls, masonry blocks, corners, edge shadows, and optional broken ruin edges.
- Tile primitives such as floor tiles, wall blocks, wall corners, cracks, debris, and rubble should be reused before adding style-specific one-offs.
- Sewer-specific Level 2 tokens cover damp stone, stained masonry, dark water, algae/sludge, metal pipes, grates, and corridor water channels.
- Laboratory-specific Level 2 tokens cover worn workshop stone, brass accents, rune glow, machinery marks, scorched floor stains, experimental residue, and metal-reinforced corridor details.
- Blackfen-specific Level 2 tokens cover damp old stone, muted wet floors, water stains, moss, weathered masonry, marsh staining, old shrine/tollhouse accents, and dark cracks.
- Cavern-specific Level 2 tokens cover rough natural stone, darker cave walls, mineral highlights, underground pools, damp rock, fungus, loose stones, natural tunnels, and shadowed cave edges. Cavern remains a specialized organic renderer and uses irregular chamber silhouettes instead of the rectangular `LevelTwoRoomShell`.
- Enchanted forest ruin uses the `forestRuin` map style and is the first new environment added after the original six. Its Level 2 renderer uses a hybrid organic/constructed strategy, but presents the map as open keyed forest areas rather than enclosed rooms: soft clearings, partial chapel-wall fragments, root-covered thresholds, direct natural trails from `map.connections`, tree clusters, rocks, vine marks, leaf scatter, glowing mushrooms, fey lights, standing stones, mossy stone, grass/earth wash, and natural path tones. It intentionally does not use the standard rectangular `LevelTwoRoomShell` or the standard corridor treatment.
- Volcanic forge ruin uses the `volcanicForge` map style. Its Level 2 renderer uses a volcanic-rock-first layout grammar rather than the default constructed-room cadence: a large central forge chamber, smaller basalt platforms, narrow service ledges, grate crossings, and lava channels that divide the safe walking surfaces. Lava, cooled crust, rough basalt edges, and hot cracks should shape the playable space, not merely decorate it. Forge elements such as anvils, plates, and ritual marks should read as built features embedded into volcanic stone, and normal `map.connections` routes must remain visually distinct from molten hazards.
- Frozen ruin/arctic cave uses the `frozenRuin` map style. Its Level 2 renderer uses `floodedIslands` plus `fragmentedVertical` metadata: fractured ice islands, cracked frozen pools, exposed snow platforms, dark crevasses, ice bridges, slick ledges, under-ice secret crawls, snow-buried masonry, broken reliquary tiles, partial arch fragments, frozen statues, sealed vault markings, ice crystals, cold mist/wind streaks, and pale frost glow. It should not be treated as cavern with blue coloring or crypt with snow decoration; the structure should be shaped by frozen crossings, cracked ice, buried reliquary fragments, and exposed gaps.
- Shrine should read as a sacred/semi-open ritual ruin: threshold forecourt, broken sacred architecture, central altar focus, side alcoves, moss/rubble, and incomplete wall fragments rather than a fully enclosed room chain.
- Crypt should read as an enclosed tomb/dead-end burial structure: compressed compartments, burial alcove banks, pinched passages, heavy walls, still dust, sarcophagi, and ritual burial chambers.
- Laboratory should read as a functional workshop/facility: organized work zones, containment cells, conduits, service-path routing, apparatus stations, and mechanical/arcane utility spaces rather than generic stone chambers.
- Future environments should vary room count, keyed-area size, silhouettes, spacing, and route grammar when the environment calls for it. Premium maps should not all resolve to the same left-to-right set of rectangular rooms connected by similar corridors.
- Future environments should be added by creating a new environment renderer, adding or reusing theme tokens, and registering the style in `level-two/registry.ts`. If a style is not ready for Level 2 yet, it can temporarily route through the fallback renderer while still using `map.connections`.

Level 2 layer order:

1. Base map parchment and global texture from `DungeonMap`.
2. Subtle Level 2 terrain wash and shared shadow.
3. Optional connection apron or broad terrain binding.
4. Normal corridors derived from `map.connections`.
5. Room shells and room floor material.
6. Theme-specific environmental details.
7. GM markers and secret routes in GM views only.
8. Room numbers last, so labels remain readable above every visual layer.

Layout grammar metadata:

- Dungeon map data may include optional `map.layout.grammar` metadata. This describes the intended structure of the environment before any renderer-specific styling is applied.
- Rooms/keyed areas may include optional layout metadata: `layoutRole`, `areaShape`, `areaScale`, `openness`, and `environmentRole`.
- Connections may include optional route metadata: `routeStyle` and `routeDifficulty`.
- These fields are advisory, not required. Existing dungeons should remain valid without them, but future generated payloads should use them to avoid simple visual reskins.
- Renderers should treat this metadata as layout intent. It should help decide whether an area is a chamber, platform, clearing, ledge, shaft, bridge, pool, or courtyard, and whether routes should look like corridors, trails, tunnels, grates, causeways, crawls, or service paths.

Layout grammar templates:

- `constructedHub`: A central room or work area with branches. Useful for shrines, workshops, crypt hubs, and command spaces.
- `linearRoute`: A traversal-focused map with a clear forward direction. Useful for drains, passes, caravanserais, and gauntlets.
- `loopedDungeon`: A layout with at least one meaningful loop, alternate path, or tactical return route.
- `organicCave`: Natural chambers connected by tunnels, ledges, pools, and uneven paths.
- `openKeyedArea`: An outdoor or semi-outdoor map with landmarks, clearings, ruins, and trails instead of enclosed rooms.
- `hazardIslands`: Safe platforms or chambers divided by dangerous terrain such as lava, void, acid, deep water, or unstable magic.
- `floodedIslands`: Playable islands, raised platforms, and causeways shaped by water depth and flooding.
- `fragmentedVertical`: Broken platforms, stairs, drops, balconies, floating fragments, or multi-level spaces.
- `branchingShafts`: Mine, quarry, root tunnel, or service network layouts built from shafts, cuts, side tunnels, and dead ends.
- `manorFloorplan`: Domestic or institutional floorplans with halls, rooms, locked wings, stairs, and reveal-driven navigation.

New Environment Checklist:

- Define a distinct area count range before writing room content.
- Choose one or two layout grammar templates instead of defaulting to rooms connected by corridors.
- Define distinct area shapes, area scale patterns, and openness patterns.
- Define route grammar: corridor, trail, bridge, tunnel, ledge, channel, stair, crawl, service path, causeway, ford, or grate.
- Explain whether the map is enclosed, open, organic, fragmented, vertical, hazard-shaped, hub-based, or a hybrid.
- Describe how hazards or terrain affect movement and visibility.
- Specify how the Player Map differs from the GM Map, especially secrets, hazards, and labels.
- Name what makes the environment visually different from shrine, crypt, sewer, laboratory, blackfen, cavern, forestRuin, and volcanicForge.
- List shared Level 2 primitives to reuse before adding new assets.
- List environment-specific assets needed for the first prototype pass.

### Level 3: Generated/Illustrated Map Image Pipeline

Level 3 would generate or assemble premium map images through a backend pipeline, likely after the dungeon generation system is stable.

Benefits:

- Highest potential visual quality.
- Can produce export-ready GM and player-safe map assets.
- Better fit for premium PDF/export bundle features.
- Can support richer themes, terrain, lighting, and final presentation.

Risks:

- Higher generation cost.
- More complex validation.
- Risk of visual routes drifting from room exits unless generation is tightly structured.
- Player-safe leakage becomes higher stakes.
- Requires asset storage, caching, retries, and failure handling.

Implementation difficulty: High.

Cost implications: Medium to high depending on generation method, storage, and export volume.

Interaction with `map.connections`:

- `map.connections` must still be generated first or alongside geometry.
- The image pipeline must consume the same room, route, and visibility data as the dungeon payload.
- Generated GM and player-safe images must be validated against connection and hidden-data rules before being saved or served.

## 4. Recommended Next Practical Map Improvements

Small tasks that can improve premium map value without changing the backend contract:

- Improve stone wall blocks with clearer masonry segments and chipped edges.
- Add stronger corridor floor material derived from connection paths.
- Build reusable theme detail libraries for ruins, caves, crypts, sewers, and arcane spaces.
- Improve player-safe map presentation with cleaner labels, less GM visual noise, and stronger display framing.
- Add map style tokens for wall, floor, water, moss, stone, rune, and marker palettes.
- Separate map geometry from visual skin inside the frontend renderer.
- Replace deprecated top-level map compatibility fields with `dungeon.map` usage where safe.
- Add export-ready map image planning for later PDF/export bundle work.
- Add visual QA screenshots for Lantern, GM enhanced, and player-safe enhanced maps.
- Document which map details are GM-only versus safe for players.

## 5. Guardrails

These rules should remain true across all future renderer levels:

- `map.connections` remains the source of truth for room connectivity.
- Visual routes must be derived from connection data.
- Room exit descriptions and structured exits must match `map.connections`.
- Secret routes must remain GM-only unless explicitly revealed by a future fog-of-war system.
- Player maps must hide GM-only markers, secret routes, traps, treasure, and GM notes.
- Room numbers and required GM markers must remain readable on mobile.
- Broad background masonry or repeated tile fields should be avoided; material detail belongs inside rooms, along corridors, and in small terrain accents.
- Lantern maps should remain useful and clear, even if visually simpler.
- Premium maps should feel visibly more table-ready than Lantern maps.
- Decoration should never make the map harder to run at the table.
- Future backend generation should produce map layout, connections, visual geometry, and room exits from the same generation pass.

## 6. Validation And QA

Current required checks:

- `npm run validate:dungeons`
- `npm run build`
- `npm run lint`

Future map work should also add visual QA passes for:

- Lantern schematic maps.
- Enhanced GM maps.
- Enhanced player-safe maps.
- Secret route hiding.
- Room number readability.
- Mobile viewport readability.
- Export-oriented map dimensions when PDF/export features begin.
