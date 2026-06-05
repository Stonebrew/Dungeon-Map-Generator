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
- New Packet Refresh panel

## Subscription Model

The current visible prototype uses two tiers: Surveyor and Cartographer. Surveyor is the free/basic preview tier, and Cartographer is the core map-and-packet tier. A third tier is postponed until advanced controls, archives, or export bundles have a stronger value proposition.

Feature entitlement checks are centralized in `src/lib/entitlements.ts`. The sample dungeon and preview tier selectors are isolated in the Sample Dungeon Selector and should be replaced by real daily generation and account data later.

Mock dungeon payloads now include backend-planning fields such as ISO dates, stable room IDs, structured exits, and `map.connections` as the source of truth for map connectivity. Run `npm run validate:dungeons` before changing mock dungeon content or map routes.

The active visible sample set is map-first: The Verdant Watercourt, The Ashen Crucible, The Frostwake Spire, The Bramblebell Moot, and The Tomb of Amun-Serekh. Legacy schematic-only packets are retired from normal user-facing flows so Surveyor and Cartographer both demonstrate the same map-first packet structure.

Prototype app state is isolated in `src/hooks/useMockDailyDungeonApp.ts`. This hook currently owns sample dungeon selection, preview tier selection, favorites, New Packet Refresh resources, locked feature state, and view routing until real backend/account APIs exist.

## Out Of Scope

- Backend generation
- AI dungeon generation
- Authentication
- Database storage
- Payment processing
- Real PDF export
- External API calls

