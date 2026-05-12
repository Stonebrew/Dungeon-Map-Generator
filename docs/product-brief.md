# Daily Dungeon Product Brief

Daily Dungeon is a mobile-first utility for tabletop roleplaying game facilitators who want a complete, ready-to-play dungeon with very little preparation.

## Prototype Goal

The first prototype demonstrates the daily dungeon reading experience with mock data only. It should feel practical at the table: readable, fast to scan, and structured around the information a GM needs during play.

## Core Views

- Today’s Dungeon summary
- Dungeon Detail / GM View
- Player Safe Map View
- Encounter Tables
- Premium / Upgrade section
- Reroll / Refresh panel

## Subscription Model

The prototype uses three mock tiers: Lantern, Adventurer, and Dungeonwright. Lantern is free, Adventurer unlocks table-use features, and Dungeonwright unlocks advanced control features.

Feature entitlement checks are centralized in `src/lib/entitlements.ts`. The temporary mock dungeon and mock user tier selectors are isolated in the Prototype Dev Panel and should be replaced by real daily generation and account data later.

## Out Of Scope

- Backend generation
- AI dungeon generation
- Authentication
- Database storage
- Payment processing
- Real PDF export
- External API calls
