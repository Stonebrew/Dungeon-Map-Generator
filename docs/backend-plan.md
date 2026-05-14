# Daily Dungeon Backend Implementation Plan

This document turns the current frontend prototype, dungeon contract, entitlement model, validation utility, and API boundary notes into a staged backend plan. It is planning documentation only; no backend code exists yet.

Pricing remains exploratory. Backend planning should model tiers and entitlements, but should not hard-code final prices.

## Current Frontend Foundation

The frontend already provides:

- A backend-facing `Dungeon` contract in `src/types.ts`.
- Stable dungeon IDs, ISO dates, stable room IDs, structured exits, and `map.connections`.
- A validation utility in `src/lib/validateDungeon.ts`.
- A repeatable mock validation script: `npm run validate:dungeons`.
- Centralized feature keys and tier requirements in `src/lib/entitlements.ts`.
- A prototype state layer in `src/hooks/useMockDailyDungeonApp.ts` that stands in for backend/account data.
- API boundary notes in `docs/api-boundary.md`.

The backend should aim to replace mock data and mock state without forcing the UI to relearn the product.

## Backend Services Needed Eventually

### User Accounts

Purpose: Identify users, own saved dungeons, store favorites, connect subscription state, and protect paid features.

Build first? Not in the very first backend slice if the goal is a global daily dungeon API. It becomes necessary once favorites/archive or paid entitlements need real persistence.

Can stay mocked for now: yes, through the mock tier selector and local favorite state.

### Subscription And Entitlement State

Purpose: Return the user's tier and unlocked feature flags. This should map to frontend feature keys such as `playerMap`, `archive`, `favorite`, `fullReroll`, `partialRefresh`, `advancedControls`, `fogOfWar`, and `exportBundle`.

Build first? Soon after accounts, before real paid features or resource spending.

Can stay mocked for now: yes, using `src/lib/entitlements.ts` and `useMockDailyDungeonApp`.

### Global Daily Dungeon Generation And Cache

Purpose: Provide one shared daily dungeon for Lantern/free users.

Build first? Yes. This is the lowest-risk backend entry point because it can serve static or manually curated validated dungeons before generation exists.

Can stay mocked for now: partly. The current mock data can seed the first cached payloads.

### Personalized Seeded Dungeon Generation

Purpose: Generate user-specific dungeons from a seed and optional controls.

Build first? Wait until the global dungeon endpoint, validation, entitlement payload, and storage pattern are stable.

Can stay mocked for now: yes.

### Archive And Favorites

Purpose: Store previous dungeons, saved/favorite markers, and user-specific dungeon history.

Build first? Build basic persistence before generation-heavy features. It gives users clear value and tests account ownership without expensive generation.

Can stay mocked for now: yes, but the current in-memory favorite state should be replaced early once accounts exist.

### Reroll And Refresh Resource Tracking

Purpose: Track daily limits, stored carryover, spends, reset time, and transaction history for full rerolls and partial refreshes.

Build first? After accounts and entitlements. Do not connect real rerolls until resource spending is transaction-safe.

Can stay mocked for now: yes.

### Dungeon Validation Before Saving Or Serving

Purpose: Reject invalid generated or edited dungeon payloads before users see them.

Build first? Yes. This should be part of the first backend slice, even if the initial payloads are static.

Can stay mocked for now: the frontend validator exists, but backend should own validation before persistence/serving.

### Player-Safe Map Payload

Purpose: Return a version of the map that hides secret connections, GM markers, treasure, hazards, and GM-only notes.

Build first? After basic dungeon fetch and entitlement payload. It is a core Adventurer feature but can initially be derived from the stored dungeon payload.

Can stay mocked for now: yes, through the current frontend renderer.

### PDF And Export Generation

Purpose: Generate downloadable GM/player packets and future export bundles.

Build first? Wait. This is useful but can be expensive and operationally fussy.

Can stay mocked for now: yes.

### Future Fog-Of-War And Reveal State

Purpose: Track room and connection reveal state during live play.

Build first? Wait until Run Mode and player-safe maps have real usage data.

Can stay mocked for now: yes.

## Recommended MVP Backend Sequence

### Phase 1: Static Global Daily Dungeon API

Goal: Replace the simplest mock data dependency with a real backend response.

Build:

- `GET /api/dungeons/today`.
- Storage or static registry for validated daily dungeon payloads.
- Backend validation command or CI check using the same contract rules.
- Basic payload versioning for `Dungeon`.
- Server-side validation before serving.

Keep mocked:

- User accounts.
- Subscription state.
- Archive/favorites.
- Rerolls and generation.
- PDF/export.

Why first: It creates the real API path with low cost and low product risk.

### Phase 2: Accounts, Entitlements, Archive, Favorites

Goal: Add user identity and persistence for Adventurer table-use features.

Build:

- User account identity.
- `GET /api/users/me/entitlements`.
- `GET /api/users/me/archive`.
- `GET /api/users/me/archive/{dungeonId}`.
- `POST /api/users/me/favorites`.
- `DELETE /api/users/me/favorites/{dungeonId}`.
- Stored favorite/archive metadata.

Keep mocked:

- Real reroll generation.
- PDF/export.
- Fog-of-war.

Why second: It validates user ownership and entitlement gates before any expensive generation path exists.

### Phase 3: Reroll And Refresh Resource Tracking

Goal: Make reroll resources reliable before spending them on generation.

Build:

- `GET /api/users/me/reroll-resources`.
- Resource reset and carryover logic.
- Transaction table for full rerolls, variant rerolls, and partial refreshes.
- Idempotency keys or equivalent rapid-click protection.
- Atomic resource reservation/spend behavior.

Keep mocked:

- Generated reroll result content can initially return a no-op or preselected alternate dungeon in internal testing.

Why third: Rerolls are cost-sensitive and abuse-prone. Resource integrity needs to come before generation.

### Phase 4: Generation Pipeline

Goal: Introduce real dungeon generation behind validated contracts.

Build:

- Global daily generation job.
- Personalized seeded dungeon generation.
- Full dungeon reroll.
- Variant reroll preserving map/connectivity.
- Partial room refresh preserving room IDs and structured exits.
- Generated map/data validation before save/return.
- Cost controls and observability.

Keep mocked:

- PDF/export bundle.
- Fog-of-war reveal state.

Why fourth: Generation has the highest product and cost risk. It should arrive after storage, validation, entitlements, and resource transactions are stable.

### Phase 5: Exports And Live Reveal Tools

Goal: Add higher-tier operational tooling after core dungeon delivery works.

Build:

- PDF export jobs.
- Export bundle jobs.
- Player-safe map asset generation or stored payload.
- Fog-of-war/reveal state.
- Optimistic reveal updates for live play.

Why last: These are valuable but not required to prove daily dungeon delivery, account value, or generation quality.

## Key Backend Risks

- Generation cost: full dungeons, variants, map assets, and exports can become expensive quickly.
- Reroll abuse: rapid clicks or repeated retries can double-spend or over-generate without transaction controls.
- Inconsistent generated maps/text: map geometry, `map.connections`, room prose, and structured exits can drift if generated separately.
- Subscription verification: stale entitlement caches can unlock paid features incorrectly or block paid users.
- Double-spending rerolls: resource reservation must be atomic and idempotent.
- Invalid dungeon payloads: malformed IDs, missing rooms, bad connections, or unsafe player maps should never be saved or served.
- Renderer-specific geometry: `MapConnection.path` is acceptable for the prototype but could trap the backend in frontend SVG assumptions.
- Partial refresh integrity: refreshing one room must not break exits, secrets, inhabitants, or map connectivity.
- Archive growth: saved generated content needs lifecycle, quota, and retrieval rules.
- Player-safe leakage: secrets, treasure, hazards, or GM notes must not appear in player-safe payloads.

## Validation Requirements

Generated, imported, or edited dungeons should be validated before being saved or returned to users.

Validation should check:

- Stable dungeon `id`.
- Valid `dateIso`.
- Display `date` or a frontend-formatting alternative.
- Stable room `id` for every room.
- Unique room numbers.
- `map.connections` exists and references valid rooms.
- No duplicate connections unless explicitly allowed.
- Bidirectional normal connections unless marked one-way.
- Structured exits match `map.connections`.
- Room exit prose does not mention missing or unconnected rooms.
- Secret connections are marked as hidden, secret, concealed, crawlspace, collapsed, or equivalent in GM-facing room data.
- Prototype visual `path` exists while the frontend renderer requires it.
- Future geometry exists once `path` is replaced by room bounds, anchors, splines, or asset references.
- Player-safe map payload hides secret routes, treasure, hazards, GM markers, and GM notes.
- System-agnostic content avoids system-specific stat blocks such as AC, HP, exact attack bonuses, spell slots, or exact damage dice.

The existing frontend validator is a useful starting point, but backend validation should become authoritative and run:

- Before saving generated dungeons.
- Before serving cached daily dungeons.
- Before completing reroll/refresh transactions.
- In CI or a scheduled content validation job.

## Data And Storage Notes

Minimum early tables or collections:

- `daily_dungeons`: date, dungeon ID, payload, validation status, publish state.
- `users`: account identity.
- `user_entitlements`: tier, subscription status, feature snapshot or subscription reference.
- `user_dungeon_archive`: user ID, dungeon ID, metadata, favorite flag, archived timestamp.
- `reroll_resources`: user ID, daily counts, stored counts, reset timestamp.
- `reroll_transactions`: idempotency key, resource type, status, cost, result dungeon ID or patch.

Generated dungeon payloads should be versioned. A future `contractVersion` field may be useful before real generation starts.

## What Should Stay Mocked For Now

- Mock user tier selector.
- Mock dungeon selector.
- Real subscription/payment state.
- Real generation controls.
- Real full/variant/partial generation.
- PDF/export bundle.
- Fog-of-war reveal state.

These mocks are still useful while the backend starts with validated static daily dungeon delivery.

## First Backend Slice Recommendation

Start with a small service that returns a validated global daily dungeon:

1. Move one or more mock dungeons into server-side fixture storage.
2. Port or share dungeon validation logic.
3. Add `GET /api/dungeons/today`.
4. Return the existing `Dungeon` contract.
5. Add backend tests that fail on invalid map/room/exit data.
6. Point the frontend mock state layer at the API only after the endpoint is stable.

That gives the project a real backend spine without committing early to accounts, payments, AI generation, or export infrastructure.
