# Dungeon Data Model

Daily Dungeon uses a shared TypeScript dungeon contract in `src/types.ts`. The current mock payloads live in `src/data/mockDungeon.ts`, but the shape is intended to match the future backend-generated dungeon JSON.

## Purpose

The `Dungeon` contract defines the complete ready-to-run dungeon payload the frontend needs for Today, Run Mode, GM View, Player Map, archive placeholders, encounter tables, treasure, and refresh UI. Backend generation should eventually return this shape, or a directly mappable version of it, instead of UI components knowing about generation internals.

## Main Dungeon Fields

- `id`: stable dungeon identifier.
- `date`: display date for the daily dungeon or archived dungeon.
- `title`: dungeon title.
- `theme`: short theme or premise label.
- `difficulty`: system-neutral difficulty label.
- `partySize`: intended party size display text.
- `estimatedPlayTime`: expected session length.
- `hook`: short story hook.
- `background`: GM-facing setup context.
- `map`: backend-ready `DungeonMapData` object.
- `mapStyle`, `mapPlaceholder`, `playerMapPlaceholder`: current prototype compatibility fields used by the SVG placeholder renderer.
- `rooms`: ordered `DungeonRoom` list.
- `encounterTables`: wandering, environmental, and room complication tables.
- `treasureTable`: system-neutral treasure entries.
- `gmNotes`: general GM notes for running the dungeon.
- `featureMetadata`: optional premium or feature hints, such as refreshable room numbers.

## Map Data

`DungeonMapData` contains:

- `style`: current placeholder map style key.
- `gmMapId`: identifier for the GM-facing map asset or generated map.
- `playerMapId`: identifier for the player-safe map asset or generated map.
- `playerSafe`: rules for what the player map should hide, including secrets, treasure, hazards, and GM notes.

The prototype still renders maps from local SVG layouts. A backend map service can later replace `gmMapId` and `playerMapId` with generated asset IDs or URLs.

## Room Fields

Each `DungeonRoom` supports:

- `id`: optional stable room identifier for future backend updates.
- `number`: visible keyed room number.
- `name`: room name.
- `readAloud` and optional `readAloudText`: player-facing boxed text.
- `gmNotes`: GM-only room notes.
- `threat`: `Low`, `Moderate`, `High`, or `Severe`.
- `tags`: scan-friendly labels.
- `inhabitants`: system-agnostic creature or NPC entries.
- `treasure`: room treasure text.
- `secrets`: hidden information.
- `exits`: visible or discoverable exits.
- `refreshEligibility`: optional future metadata for whether a room can be partially refreshed.

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
