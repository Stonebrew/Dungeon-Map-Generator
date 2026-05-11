# Dungeon Data Model

The prototype mock dungeon data lives in `src/data/mockDungeon.ts`.

## Dungeon

- `id`
- `date`
- `title`
- `theme`
- `difficulty`
- `partySize`
- `estimatedPlayTime`
- `hook`
- `background`
- `mapPlaceholder`
- `playerMapPlaceholder`
- `rooms`
- `encounterTables`
- `treasureTable`
- `gmNotes`

## Room

- `number`
- `name`
- `readAloud`
- `gmNotes`
- `threat`
- `tags`
- `inhabitants`
- `treasure`
- `secrets`
- `exits`

## Inhabitant

System-agnostic inhabitants use descriptive labels instead of system-specific stat blocks.

- `name`
- `role`
- `threat`
- `durability`
- `damage`
- `tactics`
- `morale`
- `wants`
- `leverage`

## Encounter Tables

The current prototype uses d6-style entries for:

- Wandering encounters
- Environmental events
- Room complications
- Treasure
