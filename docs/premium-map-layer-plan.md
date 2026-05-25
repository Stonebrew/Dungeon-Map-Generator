# Premium Illustrated Map Layer Plan

This document defines a future premium map layer for Daily Dungeon. It does not replace the current SVG map system. The current Lantern schematic maps and Level 2 SVG maps should remain useful as fallback/reference maps, while premium illustrated maps become an additive paid printable layer when available.

## 1. Why Current SVG Maps Are Not Enough

The current SVG maps are strong tactical reference maps. They are deterministic, data-driven, print-aware, and correctly separate GM and player-safe details. They also preserve the most important architectural rule: visual routes come from `map.connections`, the same source used by room exits and validation.

They are not yet enough for paid printable value because:

- They still read as vector diagrams with decorative styling rather than illustrated tabletop maps.
- Texture, lighting, terrain, foliage, water, and ruin depth are limited by hand-authored SVG primitives.
- Environment identity varies, but many maps still feel closer to keyed reference diagrams than printable battlemap assets.
- Player-safe maps hide data correctly, but do not yet feel like polished handouts a GM would proudly show players.
- Client-side PDF output can package the map, but it cannot turn a reference-grade map into a premium illustrated asset.

The current SVG maps should remain part of the product. They are useful for Lantern, fallback rendering, debugging, validation, and low-bandwidth table reference. Paid printable value likely needs a higher-quality illustrated base layer.

## 2. Premium Map Quality Target

Premium illustrated maps should feel closer to top-down fantasy battlemaps:

- Detailed floor materials such as stone blocks, cracked tile, cavern rock, ice, sand, sewer walkways, or volcanic basalt.
- Environmental depth through lighting, shadow, fog, water, moss, foliage, debris, scorch marks, snow, dunes, or magical glow.
- Clear room/area silhouettes and navigable routes without looking like generic boxes.
- Printable detail that holds up at letter/A4 size.
- Player-safe presentation that feels intentional, not merely redacted.
- GM overlays that are readable without damaging the illustrated base.

The target is not full VTT battlemap parity in the first implementation. The near-term goal is a premium printable map page that materially increases Adventurer/Dungeonwright value inside the packet.

## 3. Hybrid Data Model Approach

The recommended architecture is a hybrid map:

1. An illustrated base map image provides visual quality.
2. Existing dungeon data remains the source of truth for rooms, connections, secrets, markers, and labels.
3. SVG overlays render room numbers, GM markers, secret routes, and optional labels over the image.
4. Player-safe mode hides GM-only overlays and may use a separate player-safe base image if needed.
5. Current SVG maps remain fallback when no illustrated asset exists.

This keeps the data-driven system intact. The illustrated image should never be the only place where connectivity, secrets, or labels exist. It is a visual skin over validated dungeon data.

## 4. Illustrated Base Map With `map.connections`

`map.connections` should remain the source of truth for room connectivity.

The premium map layer should consume:

- Room IDs and numbers.
- Room anchor positions or label positions.
- Connection records and route visibility.
- Optional route geometry or overlay paths.
- Player-safe hiding rules.
- Map bounds/viewBox metadata.

The illustrated base image can include visible walkable paths, bridges, doors, trails, or terrain, but these must be generated from the same map geometry that produced `map.connections`. A validation or QA step should confirm that image-visible routes match connection data.

## 5. GM Overlays

GM overlays should render above the illustrated base map.

GM overlays may include:

- Room/keyed-area numbers.
- GM markers such as treasure, hazard, secret, boss/objective, or special features.
- Secret routes.
- GM-only labels when useful.
- Optional compact legend.
- Optional route highlights if the base art is visually complex.

Overlay rules:

- Room numbers render last with high-contrast backplates.
- GM markers should be readable but less dominant than room numbers.
- Secret routes should be visually distinct from normal routes and clearly GM-only.
- Overlay coordinates should be data-driven, not hand-placed independently of room geometry.
- GM overlays should be separately testable from the base image.

## 6. Player-Safe Overlays

Player-safe maps should use the same validated geometry but hide GM-only information.

Player-safe overlays may include:

- Optional room/keyed-area numbers if the product decides keyed player maps are acceptable.
- Safe labels or landmarks.
- Non-secret visible routes.
- A minimal or no legend.

Player-safe maps must hide:

- GM markers.
- Secret routes.
- Secret-route legend.
- Treasure, hazard, objective, and secret labels when they reveal hidden information.
- GM notes and any GM-only text.

If the illustrated base image itself includes hidden doors, trap symbols, treasure, or secret paths, a separate `playerBaseMapImage` is required. Player-safe safety cannot rely only on hiding overlays if the base art leaks secrets.

## 7. Print Packet Selection Rules

The Print Packet should choose maps in this order:

1. Use premium illustrated GM/player map assets when the user tier can access them and the dungeon has valid premium map metadata.
2. Use current Level 2 SVG premium maps for paid users when no illustrated asset exists.
3. Use Lantern schematic maps for Lantern users or as a fallback when premium rendering fails.

Recommended behavior:

- Adventurer and Dungeonwright packet pages prefer premium illustrated maps.
- Lantern keeps schematic maps.
- If premium illustrated map loading fails, show the Level 2 SVG fallback and a non-print warning in the app UI.
- PDF export should capture the selected map layer exactly as shown in the packet.

## 8. Image Storage And References

Premium map images should be referenced from dungeon data, but the asset payload should not be embedded directly in the main dungeon JSON except for tiny placeholders.

Recommended storage model:

- Backend stores generated or curated map images in object storage or an asset service.
- Dungeon payload includes stable asset IDs and URLs.
- URLs should be signed or public depending on product/privacy model.
- Fixtures can reference local fixture assets later, but current JSON fixtures should remain small.

Potential fields:

```ts
map: {
  premiumAssets: {
    gmBaseMapImage?: {
      id: string;
      url: string;
      width: number;
      height: number;
      mimeType: 'image/png' | 'image/jpeg' | 'image/webp';
      dpi?: number;
    };
    playerBaseMapImage?: {
      id: string;
      url: string;
      width: number;
      height: number;
      mimeType: 'image/png' | 'image/jpeg' | 'image/webp';
      dpi?: number;
    };
    thumbnailImage?: {
      id: string;
      url: string;
      width: number;
      height: number;
    };
  };
}
```

## 9. Optional Contract Fields

The app should consider optional backend-ready map fields rather than replacing existing fields.

Useful additions:

- `baseMapImage`: illustrated base used when GM/player versions are identical and overlays are the only difference.
- `gmBaseMapImage`: GM-specific illustrated base if GM-only visual details are baked into the image.
- `playerBaseMapImage`: player-safe illustrated base with secrets removed.
- `gmOverlay`: optional overlay metadata for labels, markers, and routes.
- `playerOverlay`: optional safe overlay metadata if player maps need different labels.
- `printableMapVariant`: preferred print asset or rendering mode.
- `mapBounds`: pixel or coordinate bounds for the base image.
- `viewBox`: SVG-compatible coordinate system shared by image and overlays.
- `labelAnchors`: room/keyed-area label positions.
- `markerAnchors`: optional GM marker positions.
- `routeOverlayPaths`: overlay paths derived from `map.connections`.
- `grid`: optional grid metadata, separate from connectivity.
- `assetVersion`: map asset revision for cache busting and fixture reproducibility.

Example:

```ts
map: {
  style: 'desertTemple',
  viewBox: '0 0 820 560',
  mapBounds: { x: 0, y: 0, width: 820, height: 560 },
  premiumAssets: {
    gmBaseMapImage: { id: 'map-dd-2026-05-15-gm-v1', url: '/assets/maps/dd-2026-05-15-gm.png', width: 2400, height: 1600, mimeType: 'image/png', dpi: 300 },
    playerBaseMapImage: { id: 'map-dd-2026-05-15-player-v1', url: '/assets/maps/dd-2026-05-15-player.png', width: 2400, height: 1600, mimeType: 'image/png', dpi: 300 },
  },
  overlay: {
    labelAnchors: [{ roomNumber: 1, x: 122, y: 240 }],
    markerAnchors: [{ roomNumber: 4, type: 'treasure', x: 410, y: 300 }],
  },
  connections: [...]
}
```

These fields should be optional. Existing mock dungeons and SVG renderers should continue to work without them.

## 10. Fixture Export Impact

Fixture export should continue exporting full validated dungeon JSON.

When premium map metadata is added:

- The export script should include premium map metadata if present.
- It should not inline large image data.
- Fixture manifests should include whether a premium illustrated map is available.
- Local fixture image paths or asset IDs should be stable and reproducible.
- Validation should warn if a premium asset claims player-safe availability but lacks a safe base image or safe overlay rules.

The current fixtures can remain SVG-only until a first illustrated map prototype exists.

## 11. Backend Delivery Impact

Backend delivery should treat premium maps as assets attached to a dungeon payload.

Future backend responsibilities:

- Generate or select map geometry from the same pass that creates `map.connections`.
- Produce or retrieve GM and player-safe illustrated assets.
- Validate generated assets and overlays before serving.
- Store image metadata, dimensions, version, and safety classification.
- Return asset URLs in dungeon responses.
- Cache expensive map generation and export artifacts.
- Support fallback to SVG/reference maps if image generation fails.

API boundaries affected:

- Fetch today’s dungeon should include premium asset metadata when available and entitled.
- Fetch player-safe map may return a player-safe image asset plus safe overlays.
- Request PDF/export bundle should use the premium illustrated maps when available.
- Archive responses may include thumbnails.
- Rerolls/partial refreshes may invalidate or require regenerating map assets if geometry changes.

## 12. Paid Tier Impact

Recommended tier behavior:

- Lantern: schematic/reference maps only.
- Adventurer: premium illustrated maps when available, player-safe illustrated map, printable packet export.
- Dungeonwright: all Adventurer map access plus future controls such as print variants, grid/no-grid, export bundle, fog-of-war/reveal state, or custom map style options.

Do not promise illustrated maps for every generated dungeon until the pipeline can reliably produce them. A safe product promise might be “premium map when available” during private beta, then become a hard entitlement once generation/storage is stable.

## 13. Risks

### Image Generation Consistency

Generated art may invent doors, rooms, objects, or paths that do not exist in `map.connections`. The generation pipeline must consume structured geometry and validate the output.

### Map/Text Drift

Room prose, structured exits, `map.connections`, overlay paths, and illustrated map visible routes can drift if generated separately. The backend should generate geometry, connections, exits, and map prompts/assets from one shared source.

### Player-Safe Leakage

If secrets are baked into the base image, hiding overlays is not enough. Player-safe images need their own base asset or strict generation rules that avoid GM-only details in the image.

### File Size And Performance

High-resolution print maps may be large. The app should use thumbnails/screen-resolution assets in normal views and print-resolution assets only in packet/export contexts.

### Licensing And Copyright

Curated asset packs, generated imagery, fonts, textures, and model outputs need clear commercial usage rights. Avoid shipping unlicensed texture sources or generated images with ambiguous rights.

### Print Resolution

Screen-friendly images may not print well. Paid print maps should target explicit dimensions and DPI, such as 2400x1600 or better for letter/A4 placement, with QA against browser print and generated PDF.

### Overlay Alignment

If base images and SVG overlays use different coordinate systems, room labels and markers can drift. `viewBox`, `mapBounds`, and image dimensions must be explicit.

### Cost Control

Illustrated map generation can be expensive. Generated assets should be cached, reused for global dungeons, and regenerated only when dungeon geometry changes.

## 14. Recommended Implementation Phases

### Phase 1: Contract And Renderer Prototype

- Add optional premium map asset fields to `DungeonMapData`.
- Add optional overlay anchor metadata.
- Create a small `PremiumMapLayer` component that renders an image base plus existing overlay labels/markers.
- Use one manually created or placeholder local image fixture to test alignment.
- Keep SVG maps as fallback.

Done when one dungeon can display an illustrated base map with correctly aligned GM and player-safe overlays.

### Phase 2: Print Packet Integration

- Update Print Packet map selection rules.
- Use premium illustrated maps in packet pages when available.
- Keep Level 2 SVG fallback.
- QA direct client-side PDF output with image maps.

Done when Adventurer/Dungeonwright packet output can include premium illustrated GM and player maps without leaking player-safe data.

### Phase 3: Fixture And Validation Expansion

- Extend fixture export manifest to note premium map asset availability.
- Validate image metadata, dimensions, viewBox, label anchors, and safe-player asset presence.
- Add a player-safe leakage checklist for image base maps.

Done when fixture export can safely carry illustrated map references without embedding large images.

### Phase 4: Backend Asset Delivery

- Store map image assets in object storage.
- Return premium asset metadata from dungeon endpoints.
- Use thumbnails for archive/list views.
- Cache global daily dungeon map assets.

Done when the frontend can consume backend-served premium map assets with fallback to SVG.

### Phase 5: Generation Pipeline

- Generate map geometry, `map.connections`, room exits, overlay anchors, and image prompts from one source.
- Generate GM and player-safe map assets.
- Validate assets before saving/serving.
- Add retry/fallback behavior.

Done when generated dungeons can reliably include premium illustrated map assets that match the data contract.

### Phase 6: Paid Export Hardening

- Use premium print-resolution assets in PDF/export bundles.
- Add map-only export options.
- Add grid/no-grid and ink-friendly variants if user testing supports them.
- Track generation/export costs by tier.

Done when premium illustrated maps are reliable enough to be part of paid subscription claims.

## Foundation Status

The first foundation task is now represented in the contract and renderer path:

- `DungeonMapData.premiumMap` is optional and backward-compatible.
- Premium map metadata can describe shared, GM-specific, and player-safe illustrated base images.
- The metadata can also describe image size, map bounds, overlay viewBox alignment, percentage or absolute overlay anchors, GM overlays, player-safe overlays, and print variant notes.
- `DungeonMap` now has a no-op premium renderer branch that checks for usable premium image metadata before falling back to the current SVG renderers.
- Existing mock dungeons do not include premium image metadata yet, so current schematic and Level 2 SVG maps remain visually unchanged.
- Validation only checks premium map metadata when it is present.

## Map-First Proof-Of-Concept Status

The first illustrated-map proof of concept is now a separate map-first mock dungeon: `Premium Map POC: The Verdant Watercourt`.

- The dungeon references `/premium-maps/test-temple-map.png` through `map.premiumMap.baseMapImage`.
- The illustrated map drives room count, room names, exits, `map.connections`, treasure locations, hazards, objective placement, and running notes.
- The premium image is used as the base layer for Adventurer/Dungeonwright enhanced GM and player-safe map views.
- GM overlays render room numbers, GM markers, and secret routes above the image.
- Player-safe overlays render room numbers while hiding GM markers and secret routes.
- Room labels and GM markers now use premium-map-specific percentage anchors when present, instead of relying on the old SVG map room coordinates.
- If the image fails to load, the renderer falls back to the existing Level 2 SVG shrine map.
- Normal route overlays are disabled for this premium map because the visible paths, bridges, and doorways are already part of the illustration.
- Secret route overlays are manually defined and aligned to the image; player maps hide them.
- Overlay anchors are still manually tuned. A future visual annotation editor or geometry export step will be needed before adding many premium map images.

The previous attempt to attach the test image to Saint Orra showed an important product rule: illustrated maps should drive dungeon content, not be retrofitted onto unrelated room text.

The second illustrated-map proof of concept is also map-first: `Premium Map POC: The Ashen Crucible`.

- The dungeon references `/premium-maps/volcanic-ruin-1.png` through `map.premiumMap.baseMapImage`.
- It uses annotator-created premium overlay metadata and a draft `map.connections` graph to define a volcanic ruin play surface.
- The local image remains ignored under `public/premium-maps/`; only metadata and mock dungeon content are tracked.
- Normal route overlays are disabled because visible stairs, bridges, ledges, and platforms belong to the illustrated base map.
- Lantern/free schematic views for map-first premium dungeons use the dungeon's actual premium label anchors, GM marker anchors in GM mode, and `map.connections` so the free reference map does not invent rooms that are absent from the content. Player-safe schematic views continue hiding GM markers and secret routes.
- The free schematic can use `premiumMap.schematicFootprints` to draw simplified black-and-white area shapes around premium anchors. These should be clean, conservative shapes rather than rough blobs. This avoids reducing large illustrated rooms to tiny node circles and helps GM marker badges remain inside the room or area they describe.

## Dev Annotation Tool

A dev-only premium map annotation tool is available at:

```text
/dev/map-annotator
```

This route is intentionally hidden from normal product navigation and is gated to Vite development builds with `import.meta.env.DEV`. It is internal prototype tooling for building and tuning `premiumMap` metadata.

Current capabilities:

- Load the known local premium map asset `/premium-maps/test-temple-map.png`.
- Load existing mock dungeons that already include `premiumMap` metadata, starting with `Premium Map POC: The Verdant Watercourt`.
- Import the selected dungeon's current base map image, room label anchors, GM marker anchors, GM-only secret route overlays, `showNormalRouteOverlay` flag, and draft `map.connections`.
- Place room number anchors by clicking the image.
- Drag existing room number anchors to retune their `xPercent` / `yPercent` placement.
- Place GM marker anchors for treasure, hazard, objective, boss, secret, or custom labels.
- Drag existing GM marker anchors without changing their room number, marker type, or label.
- Draw multi-point GM-only secret route overlays.
- Drag individual secret route points while preserving route identity and point order.
- Preview GM mode with all overlays.
- Preview player mode with room labels only, hiding GM markers and secret routes.
- Delete room anchors, markers, routes, and draft connections from side lists.
- Draft `map.connections` entries with type, route style, difficulty, and note.
- Copy generated `premiumMap` metadata and draft `map.connections` JSON for manual paste-back into mock data or future fixtures.

The annotator supports both blank/new metadata creation and edit-and-copy work on existing premium map dungeons. Loading an existing dungeon does not mutate the source data; it only populates the local annotator state so the updated JSON can be copied back manually after review.

The annotator uses the same coordinate interpretation as `PremiumMapLayer`: the premium image is rendered into `premiumMap.mapBounds`, currently `0 0 720 480`, with `preserveAspectRatio="xMidYMid slice"`. Room label and GM marker anchors export as `xPercent` / `yPercent` values relative to those bounds. GM-only secret route paths export in the same `720x480` overlay SVG coordinate space. This makes the annotator WYSIWYG with GM Map, Player Map, and Print Packet previews.

`map.connections` remains structural dungeon data. It describes which keyed areas connect and should not be used to place room labels, GM markers, or premium illustrated overlay art.

Existing SVG secret route paths are preserved until the route is edited, which prevents a load-and-copy pass from accidentally degrading curved route overlays.

Limitations:

- It does not save files.
- It does not update mock data automatically.
- It does not upload or discover arbitrary image files.
- It can load existing annotations from mock dungeon payloads and supports basic visual dragging for room anchors, GM markers, and secret route points.
- It does not validate room prose, structured exits, or connection bidirectionality while editing.
- It does not provide Bezier curve handles yet; dragging a loaded curved secret route point converts future export for that route to point-to-point line segments.
- It is not a polished user-facing feature.

Future improvements:

- Add proper Bezier path editing for curved secret routes.
- Snap anchors to visible rooms or image landmarks.
- Generate structured exits from edited `map.connections`.
- Add image-specific bounds controls for non-square assets.
- Save annotations to fixture JSON through a future backend/dev-only file workflow.

## Recommended First Implementation Task

Add a focused visual QA checklist for the Verdant Watercourt premium map in Today, GM View, Player Map, Print Packet, and Save as PDF output.

Why this first:

- The first image fixture is now connected.
- The next risk is whether the image bounds, labels, markers, and secret routes are readable enough in every surface.
- It keeps the test narrow before adding more premium images or backend asset delivery.
