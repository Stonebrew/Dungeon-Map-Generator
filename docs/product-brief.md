# Daily Dungeon Product Brief

Daily Dungeon is a mobile-first utility for tabletop roleplaying game facilitators who want a complete, ready-to-play dungeon with very little preparation.

## Prototype Goal

The first prototype demonstrates the daily dungeon reading experience with mock data only. It should feel practical at the table: readable, fast to scan, and structured around the information a GM needs during play.

## Core Views

- Today’s Dungeon summary
- Run Mode for live table use
- Dungeon Detail / GM View
- Player Safe Map View
- Encounter Tables
- Premium / Upgrade section
- Reroll / Refresh panel

## Subscription Model

The prototype uses three mock tiers: Lantern, Adventurer, and Dungeonwright. Lantern is free, Adventurer unlocks table-use features, and Dungeonwright unlocks advanced control features.

Feature entitlement checks are centralized in `src/lib/entitlements.ts`. The temporary mock dungeon and mock user tier selectors are isolated in the Prototype Dev Panel and should be replaced by real daily generation and account data later.

Mock dungeon payloads now include backend-planning fields such as ISO dates, stable room IDs, structured exits, and `map.connections` as the source of truth for map connectivity. Run `npm run validate:dungeons` before changing mock dungeon content or map routes.

Prototype app state is isolated in `src/hooks/useMockDailyDungeonApp.ts`. This hook currently owns mock dungeon selection, mock tier selection, favorites, reroll resources, locked feature state, and view routing until real backend/account APIs exist.

## Out Of Scope

- Backend generation
- AI dungeon generation
- Authentication
- Database storage
- Payment processing
- Real PDF export
- External API calls
