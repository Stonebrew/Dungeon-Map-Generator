# Daily Dungeon

Daily Dungeon is a mobile-first TTRPG daily dungeon app. Each day, the app presents a ready-to-run dungeon with a map, room descriptions, encounter tables, treasure, GM notes, and a short story setup.

## Current Status

Frontend UI prototype only. The app currently uses mock data and local React state for navigation.

Not implemented yet:

- Backend dungeon generation
- AI dungeon generation
- Authentication
- Database storage
- Payment processing
- Real PDF export
- External API calls

## Setup

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://127.0.0.1:5173/`.

## Available Scripts

- `npm run dev` starts the Vite development server.
- `npm run build` type-checks and builds the production bundle.
- `npm run preview` previews the production build locally.
- `npm run lint` runs ESLint.
- `npm run validate:dungeons` checks mock dungeon connectivity, structured exits, and prototype map route paths.

## Prototype Scope

The current UI includes Today’s Dungeon, Run Mode, GM View, Player Safe Map View, Encounter Tables, Premium Plans, and a mock Reroll / Refresh panel. Dungeon content is system-agnostic and avoids system-specific stat blocks.

The current mock subscription model has three tiers: Lantern, Adventurer, and Dungeonwright.

Feature access is centralized in `src/lib/entitlements.ts`. Temporary prototype selectors for mock dungeon and mock user tier testing live in `src/components/DevPanel.tsx`.

Mock dungeon data follows the shared contract in `src/types.ts`, including stable dungeon IDs, ISO dates, stable room IDs, structured exits, and `map.connections` as the source of truth for map connectivity.

Prototype-only app state is isolated in `src/hooks/useMockDailyDungeonApp.ts`. It stands in for future backend/account/subscription data and should be replaced as real APIs are connected.

Future backend/API planning notes live in `docs/api-boundary.md` and `docs/backend-plan.md`.
