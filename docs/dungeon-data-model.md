# Dungeon Data Model

Daily Dungeon uses a shared TypeScript dungeon contract in `src/types.ts`. The current mock payloads live in `src/data/mockDungeon.ts`, but the shape is intended to match the future backend-generated dungeon JSON.

## Purpose

The `Dungeon` contract defines the complete ready-to-run dungeon payload the frontend needs for Today, Run Mode, GM View, Player Map, archive placeholders, encounter tables, treasure, and refresh UI. Backend generation should eventually return this shape, or a directly mappable version of it, instead of UI components knowing about generation internals.

## Main Dungeon Fields

- `id`: stable dungeon identifier.
- `dateIso`: ISO-8601 date for backend sorting, daily lookup, and archive grouping.
- `date`: display date for the daily dungeon or archived dungeon.
- `title`: dungeon title.
- `theme`: short theme or premise label.
- `difficulty`: system-neutral difficulty label.
- `partySize`: intended party size display text.
- `estimatedPlayTime`: expected session length.
- `hook`: short story hook.
- `background`: GM-facing setup context.
- `map`: backend-ready `DungeonMapData` object.
- `mapStyle`, `mapPlaceholder`, `playerMapPlaceholder`: deprecated prototype compatibility fields. Prefer `map.style`, `map.gmMapId`, `map.playerMapId`, or future generated map asset metadata.
- `rooms`: ordered `DungeonRoom` list.
- `encounterTables`: wandering, environmental, and room complication tables.
- `treasureTable`: system-neutral treasure entries.
- `gmNotes`: general GM notes for running the dungeon.
- `featureMetadata`: optional premium or feature hints, such as refreshable room numbers.

## Map Data

`DungeonMapData` contains:

- `style`: current placeholder map style key.
- `layout`: optional layout grammar metadata. This describes the intended map structure, such as `constructedHub`, `organicCave`, `openKeyedArea`, `hazardIslands`, or `branchingShafts`.
- `gmMapId`: deprecated prototype identifier for the GM-facing map asset or generated map; future payloads may replace this with richer asset metadata.
- `playerMapId`: deprecated prototype identifier for the player-safe map asset or generated map; future payloads may replace this with richer asset metadata.
- `connections`: source-of-truth room connectivity metadata. Each connection has `from`, `to`, `type`, optional `note`, optional route metadata, and a prototype `path` used for SVG route rendering.
- `playerSafe`: rules for what the player map should hide, including secrets, treasure, hazards, GM notes, and optional player-facing description copy.

The prototype still renders room shapes from local SVG layouts. Visual route rendering is derived from `map.connections`, so normal corridors and GM-only secret routes share the same source of truth as room exit text. A backend map service can later replace `gmMapId` and `playerMapId` with generated asset IDs or URLs, but the visual routes should continue to match `map.connections`.

Connection `type` is currently either `normal` or `secret`. Connections are treated as bidirectional unless a future one-way route flag is intentionally used. Secret connections should be described in room text as hidden, collapsed, concealed, crawlspace, or otherwise GM-only, and should remain hidden from player-safe map views.

Connections may include optional `routeStyle` and `routeDifficulty` metadata. These are advisory renderer hints, not new connectivity rules. Route styles include corridor, trail, bridge, tunnel, ledge, channel, stair, crawl, service path, causeway, ford, and grate. Route difficulty can describe clear, narrow, unstable, hidden, hazardous, or blocked routes.

Example:

```ts
connections: [
  { from: 1, to: 2, type: 'normal', path: 'M120 180 H220' },
  { from: 4, to: 5, type: 'normal', path: 'M360 220 C390 240 420 260 450 280' },
  { from: 3, to: 5, type: 'secret', note: 'Hidden crawlspace behind cracked tiles.', path: 'M200 140 C260 200 340 250 450 280' },
]
```

Room `exits` text should match `map.connections`. If the map says Room 4 connects to Room 5, both rooms should normally mention the route. If the room text mentions an exit to Room 5, the map should include that connection. Secret routes can be mentioned in `exits`, `secrets`, or GM notes, but they should use clear language such as hidden, secret, concealed, crawlspace, collapsed, false, or similar.

The current `path` field is prototype SVG data, not a procedural generation API. It prevents hand-drawn corridor paths from silently disagreeing with `map.connections`. Future generated map data can replace it with richer geometry, anchors, or asset coordinates as long as the renderer derives routes from the same connection records.

## Room Fields

Each `DungeonRoom` supports:

- `id`: stable room identifier for backend updates, refreshes, route references, and UI focus.
- `number`: visible keyed room number.
- `name`: room name.
- `readAloud` and optional `readAloudText`: player-facing boxed text.
- `gmNotes`: GM-only room notes.
- `threat`: `Low`, `Moderate`, `High`, or `Severe`.
- `tags`: scan-friendly labels.
- Optional layout metadata: `layoutRole`, `areaShape`, `areaScale`, `openness`, and `environmentRole`. These describe whether the keyed area behaves like a hub, branch, clearing, platform, shaft, bridge, pool, courtyard, enclosed room, exposed ledge, hazard-adjacent space, overgrown landmark, mechanical chamber, and so on.
- `inhabitants`: system-agnostic creature or NPC entries.
- `treasure`: room treasure text.
- `secrets`: hidden information.
- `exits`: visible or discoverable exit prose for table readability.
- `structuredExits`: backend-ready exit records. Each structured exit can include `toRoomId`, `toRoomNumber`, `type`, `label`, `description`, and `note`.
- `refreshEligibility`: optional future metadata for whether a room can be partially refreshed.

Structured exit example:

```ts
structuredExits: [
  {
    toRoomId: 'dd-2026-05-10-room-06',
    toRoomNumber: 6,
    type: 'normal',
    label: 'Overflow to Room 6',
    description: 'A waist-high overflow tunnel drains toward the archive.',
  },
  {
    toRoomId: 'dd-2026-05-10-room-03',
    toRoomNumber: 3,
    type: 'secret',
    label: 'Hidden valve crawl',
    note: 'Found behind the pumpkeeper cot.',
  },
]
```

The current mock data enriches structured exits from `map.connections` so the prototype remains easy to maintain. Future backend generation should emit structured exits directly rather than relying on prose parsing.

Layout metadata is optional and backward-compatible. The current mock data applies light metadata so renderers can reason about layout grammar without requiring every future backend payload field immediately. Future generated dungeons should emit this metadata when possible to avoid turning new environments into simple visual reskins.

## System-Agnostic Encounter Labels

Inhabitants avoid system-specific stat blocks such as AC, HP, attack bonuses, spell slots, or exact damage dice. They use:

- `role`
- `threat`
- `durability`
- `damage`
- `tactics`
- `morale`
- `wants`
- `leverage`

Encounter entries may include an encounter `type`: `Combat`, `Social`, `Hazard`, `Puzzle`, or `Exploration`.

## Reroll Resources And Tiers

`UserTier` defines the subscription tier keys: `lantern`, `adventurer`, and `dungeonwright`. `TierId` is kept as a compatibility alias.

`RerollResources` defines the session-visible reroll counters:

- `remainingFull`
- `storedFull`
- `remainingPartial`
- `storedPartial`

`RerollCounts` is currently a compatibility alias for `RerollResources`.

## Backend Replacement Path

When backend generation is added, the frontend should replace `src/data/mockDungeon.ts` with fetched or hydrated `Dungeon` payloads. Components should continue reading the shared contract from `src/types.ts`, while entitlement checks remain centralized in `src/lib/entitlements.ts`.

Future generation should create the visual map layout, `map.connections`, visual route geometry, and room exit descriptions from the same generation pass so those surfaces cannot drift apart.

## Validation

Run `npm run validate:dungeons` to validate all mock dungeons. The script checks room references, duplicate connections, structured exits, room exit consistency, secret route labeling, and required prototype visual route paths.
