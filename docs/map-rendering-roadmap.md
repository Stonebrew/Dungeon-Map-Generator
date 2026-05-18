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

In the current prototype, Level 2 should be explored one map style at a time. Shrine/ruins, crypt, and sewer now use the shared Level 2 renderer family. Building each style incrementally keeps the renderer understandable and makes it easier to compare Level 2 quality against the existing enhanced SVG fallback before converting every map style.

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

- The shared Level 2 renderer helpers live in `src/components/maps/LevelTwoMapRenderer.tsx`.
- `LevelTwoMapTheme` holds theme tokens for floor palettes, foundation tones, wall tones, corridor colors, terrain details, moss, water, dust, and rubble.
- `LevelTwoFoundation` renders the shared terrain and floor footprint beneath the dungeon.
- `LevelTwoConnectionRoutes` renders normal corridors and GM-only secret routes from `map.connections`.
- `LevelTwoRoomShell` renders reusable room structure: floor tiles, thick walls, masonry blocks, corners, edge shadows, and optional broken ruin edges.
- Tile primitives such as floor tiles, wall blocks, wall corners, cracks, debris, and rubble should be reused before adding style-specific one-offs.
- Sewer-specific Level 2 tokens cover damp stone, stained masonry, dark water, algae/sludge, metal pipes, grates, and corridor water channels.

Level 2 layer order:

1. Base map parchment and global texture from `DungeonMap`.
2. Level 2 foundation footprint and shared terrain.
3. Optional connection apron or broad terrain binding.
4. Normal corridors derived from `map.connections`.
5. Room shells and room floor material.
6. Theme-specific environmental details.
7. GM markers and secret routes in GM views only.
8. Room numbers last, so labels remain readable above every visual layer.

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
