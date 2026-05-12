# Daily Dungeon Tier Model

## Lantern

Free tier.

### Daily Dungeon Access

- One global daily dungeon
- Basic room descriptions
- Basic encounter tables

### Maps And Exports

- Black-and-white GM map
- No player-safe map
- No PDF export
- No archive

### Rerolls And Refreshes

- No full rerolls
- No partial refreshes

### Customization

- No advanced customization

## Adventurer

Low premium tier focused on making the app genuinely useful at the table.

### Daily Dungeon Access

- Everything in Lantern

### Maps And Exports

- Color map
- Player-safe map
- GM map
- Mock PDF export button
- Archive access placeholder
- Save/favorite dungeons placeholder

### Rerolls And Refreshes

- 1 full dungeon reroll per day
- Stored full rerolls up to 2
- 2 partial refreshes per day
- Stored partial refreshes up to 4

## Dungeonwright

Full access tier focused on control.

### Daily Dungeon Access

- Everything in Adventurer

### Rerolls And Refreshes

- 2 full dungeon rerolls per day
- Stored full rerolls up to 4
- 6 partial refreshes per day
- Stored partial refreshes up to 12

### Customization

- Theme selector
- Difficulty selector
- Day/night variant
- Dungeon size selector
- Inhabitant type control

### Advanced Tools

- Puzzle frequency control
- Hazard frequency control
- Treasure frequency control
- Secret room frequency control
- Fog-of-war map view
- Export bundle placeholder

## Reroll Rules

Full dungeon rerolls and partial refreshes are separate resources. Unused rerolls and refreshes carry over up to double the tier's daily limit. Reroll controls are UI-only in the current prototype.

## Implementation Note

Feature keys, required tiers, labels, and locked-feature descriptions live in `src/lib/entitlements.ts` so UI components do not hard-code subscription comparisons.
