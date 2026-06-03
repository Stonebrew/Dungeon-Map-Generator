# Daily Dungeon Tier Model

## Current Visible Model

The prototype now presents two user-facing tiers:

- Surveyor replaces Lantern as the visible free/basic tier name.
- Cartographer replaces Adventurer as the visible paid/core tier name.

The internal tier IDs remain `lantern`, `adventurer`, and `dungeonwright` for now to avoid risky entitlement refactors during prototype hardening.

## Surveyor

Free/basic preview tier for trying the dossier workflow.

### Packet Access

- One shared daily dungeon
- Basic room descriptions
- Encounter and treasure tables

### Maps And Exports

- Simple schematic GM map
- Player maps locked
- Print and PDF export locked
- Session archive locked

### Refresh Tools

- No New Packet Refresh

## Cartographer

Core paid tier focused on the map-and-packet experience.

### Packet Access

- Everything in Surveyor

### Maps And Exports

- Premium illustrated maps when available
- GM map
- Player labeled map
- Player clean map
- Print and PDF packet export
- Session archive preview

### Limited Refresh Tools

- 1 New Packet Refresh per day
- Refresh switches to a complete alternate dungeon packet
- No room-level partial refresh controls in the visible prototype

## Postponed Third Tier

Dungeonwright is no longer visible as a current user-facing plan. The internal tier may remain for future testing, but the product should not advertise it until the value proposition is stronger.

Possible future names include Archivist, Mapwright, or another cartography/dossier-themed name. Additional packet refreshes may later be handled through add-ons or credits rather than a higher subscription tier.

## Refresh Rules

Current visible copy presents refresh behavior as one daily New Packet Refresh for Cartographer. In this frontend prototype, the refresh switches to another complete sample dungeon packet in a deterministic sequence, so it visibly changes the packet without editing room text, anchors, connections, or premium map metadata. Room-level refresh tools may return later as explicit map-safe actions such as Refresh Room Text, Swap Encounter, Refresh Treasure, Refresh Story Hook, or Refresh Clues.

## Implementation Note

Feature keys, required tiers, labels, and locked-feature descriptions live in `src/lib/entitlements.ts` so UI components do not hard-code subscription comparisons.
