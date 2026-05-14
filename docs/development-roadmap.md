# Daily Dungeon Development Roadmap

This roadmap turns the current frontend prototype and backend planning docs into small, GitHub-friendly work. It is a planning document only.

## Phase 0 — Prototype Hardening

Goal: Make the current frontend prototype easier to maintain, validate, and connect to future backend data without changing product scope.

Tasks:

- Keep `npm run validate:dungeons` clean and useful.
- Add light tests or scripted checks around entitlement behavior and dungeon validation.
- Reduce hard-coded compatibility fields where safe.
- Tighten mock data quality and player-safe copy.
- Keep DevPanel clearly isolated from product UI.
- Document backend replacement points in the mock state hook.

Expected files/modules affected:

- `src/types.ts`
- `src/data/mockDungeon.ts`
- `src/lib/validateDungeon.ts`
- `src/lib/entitlements.ts`
- `src/hooks/useMockDailyDungeonApp.ts`
- `src/components/DevPanel.tsx`
- `scripts/validateDungeons.cjs`
- `docs/*`

Risks:

- Over-polishing prototype code instead of preparing for backend integration.
- Accidentally changing UI behavior while refactoring.
- Letting mock-only SVG path assumptions leak deeper into the contract.

Done when:

- Validation, build, and lint pass.
- Mock dungeon data remains consistent.
- Prototype-only systems are clearly labeled.
- First backend integration points are documented and easy to find.

## Phase 1 — Static Daily Dungeon Backend

Goal: Serve a validated global daily dungeon from a backend boundary while keeping accounts, payments, and generation out of scope.

Tasks:

- Choose backend project structure.
- Move or mirror mock dungeon fixtures into server-side storage.
- Port or share dungeon validation.
- Implement `GET /api/dungeons/today`.
- Add server-side contract tests for dungeon payloads.
- Add frontend fetch adapter behind the mock state layer when endpoint is stable.

Expected files/modules affected:

- Future backend app/server files.
- `src/hooks/useMockDailyDungeonApp.ts`
- `src/types.ts`
- `src/lib/validateDungeon.ts` or shared validation package.
- `docs/api-boundary.md`
- `docs/backend-plan.md`

Risks:

- Backend shape drifting from frontend contract.
- Serving invalid dungeon payloads.
- Date/timezone bugs for daily dungeon lookup.
- Prematurely introducing accounts or generation.

Done when:

- `GET /api/dungeons/today` returns a valid `Dungeon`.
- Backend validation blocks invalid fixtures.
- Frontend can still run with mock data.
- No paid/account behavior is required for the endpoint.

## Phase 2 — Accounts, Entitlements, Favorites, And Archive

Goal: Add user identity and persistent Adventurer table-use features.

Tasks:

- Add user account identity.
- Implement entitlement response payload.
- Implement archive list and archived dungeon fetch.
- Implement favorite save/remove.
- Replace in-memory favorite state with API-backed state.
- Keep mock tier selector available only as dev tooling.

Expected files/modules affected:

- Backend user/account modules.
- Backend entitlement modules.
- Backend archive/favorite modules.
- `src/lib/entitlements.ts`
- `src/hooks/useMockDailyDungeonApp.ts` or a real app data hook.
- `src/components/ArchiveView.tsx`
- `src/components/LockedFeature.tsx`

Risks:

- Subscription verification complexity.
- Entitlement cache becoming stale.
- Archive ownership bugs.
- Favorites UI implying persistence before it exists.

Done when:

- Authenticated users can fetch their entitlements.
- Adventurer+ users can save/remove favorites.
- Archive data persists across refreshes.
- Lantern users remain gated from paid features.

## Phase 3 — Reroll/Refresh Resources

Goal: Track reroll and partial refresh resources safely before connecting real generation.

Tasks:

- Implement reroll resource state endpoint.
- Implement daily reset and carryover rules.
- Add transaction records for full, variant, and partial refresh attempts.
- Add idempotency keys or equivalent rapid-click protection.
- Replace local reroll count state with backend state.
- Add no-op or fixture-backed transaction responses before real generation.

Expected files/modules affected:

- Backend reroll resource modules.
- Backend transaction modules.
- `src/components/RerollPanel.tsx`
- `src/components/RoomCard.tsx`
- `src/hooks/useMockDailyDungeonApp.ts` or real data hook.
- `docs/api-boundary.md`

Risks:

- Double-spending resources.
- Race conditions from rapid clicks.
- Confusing stored versus daily counts.
- Refreshing content without preserving map/exit integrity.

Done when:

- Reroll resources survive refresh and reset correctly.
- Spending is atomic and idempotent.
- UI shows backend-provided counts.
- No real generation is required yet.

## Phase 4 — Generation Pipeline

Goal: Generate valid dungeons behind the established contract and resource model.

Tasks:

- Build global daily generation job.
- Build seeded personalized dungeon generation.
- Build full reroll generation.
- Build variant reroll preserving map/connectivity.
- Build partial room refresh preserving room IDs and structured exits.
- Validate every generated result before save/return.
- Add cost tracking, logging, retries, and failure handling.

Expected files/modules affected:

- Backend generation modules.
- Backend validation modules.
- Backend storage modules.
- `src/types.ts`
- `docs/dungeon-data-model.md`
- `docs/backend-plan.md`

Risks:

- Generation cost growth.
- Inconsistent map/text/exit output.
- Generated content leaking system-specific mechanics.
- Partial refreshes breaking surrounding rooms.
- Poor failure handling after resource spend.

Done when:

- Generated dungeons pass backend validation.
- Full rerolls produce new valid dungeons.
- Variant rerolls preserve map/connectivity.
- Partial refreshes update bounded content safely.
- Failed generation does not silently consume resources.

## Phase 5 — PDF/Export And Fog-Of-War

Goal: Add high-value Dungeonwright tools after core dungeon delivery and generation are stable.

Tasks:

- Implement PDF export job.
- Implement export bundle job.
- Add generated or stored player-safe map assets.
- Implement fog-of-war reveal state.
- Support optimistic reveal updates during Run Mode.
- Add export expiration and retry behavior.

Expected files/modules affected:

- Backend export job modules.
- Backend file/storage modules.
- Backend reveal-state modules.
- `src/components/PlayerMapView.tsx`
- `src/components/RunMode.tsx`
- Future export UI components.

Risks:

- Slow export jobs.
- File storage lifecycle issues.
- Player-safe leakage.
- Reveal-state sync conflicts during live play.

Done when:

- Adventurer+ users can request PDF exports.
- Dungeonwright users can request bundles.
- Player-safe assets do not include GM-only data.
- Fog-of-war state persists and can be updated safely.

## Phase 6 — App Store Release Prep

Goal: Prepare the product for mobile distribution and production operations.

Tasks:

- Package the app for target platforms.
- Add production analytics and crash reporting.
- Add privacy policy, terms, and subscription disclosures.
- Add accessibility and small-screen QA.
- Add content safety and generated-content review strategy.
- Add release checklist and rollback plan.

Expected files/modules affected:

- App packaging config.
- Production environment config.
- Legal/support docs.
- Analytics/error reporting modules.
- UI accessibility fixes.

Risks:

- Store review delays.
- Subscription disclosure requirements.
- Mobile performance issues.
- Generated content quality or safety problems.

Done when:

- Release build is reproducible.
- Store metadata and legal docs are ready.
- Core flows pass device QA.
- Production monitoring and rollback path exist.

## Phase 0 Task Cards

### 1. Add Validation Script To CI Documentation

Purpose: Make `npm run validate:dungeons` part of the expected local and future CI workflow.

Implementation notes:

- Document where the command should run.
- Add a short note that validation must pass before mock dungeon or map route changes are merged.
- Do not add a CI provider yet unless selected.

Acceptance criteria:

- Docs mention validation as a required check.
- No app behavior changes.

Validation commands:

- `npm run validate:dungeons`
- `npm run lint`
- `npm run build`

### 2. Add Contract Version Planning Field

Purpose: Prepare the `Dungeon` payload for future backend migrations.

Implementation notes:

- Add optional `contractVersion` to the type or document why it remains deferred.
- If added to mock data, keep it consistent across all six dungeons.

Acceptance criteria:

- Backend plan and data model agree on versioning strategy.
- Mock dungeons still validate.

Validation commands:

- `npm run validate:dungeons`
- `npm run lint`
- `npm run build`

### 3. Strengthen Dungeon Validation For Stable IDs

Purpose: Ensure backend-facing IDs are present and unique.

Implementation notes:

- Extend `validateDungeon.ts` to check dungeon `id`, `dateIso`, room `id`, unique room IDs, and unique room numbers.
- Keep warning/error output compact in DevPanel and script output.

Acceptance criteria:

- Invalid/missing room IDs are caught.
- Existing six mock dungeons pass.

Validation commands:

- `npm run validate:dungeons`
- `npm run lint`
- `npm run build`

### 4. Validate Player-Safe Map Rules

Purpose: Prevent player-safe payloads from accidentally exposing GM-only data.

Implementation notes:

- Add validation around `map.playerSafe`.
- Confirm secret connections are hidden by the renderer in player mode.
- Keep checks data-oriented; do not build new map UI.

Acceptance criteria:

- Validator warns or errors on missing player-safe rules.
- Existing player maps still render.

Validation commands:

- `npm run validate:dungeons`
- `npm run lint`
- `npm run build`

### 5. Document Mock State Replacement Points

Purpose: Make future backend wiring easier.

Implementation notes:

- Add comments or docs describing which `useMockDailyDungeonApp` state maps to which future API boundary.
- Avoid changing behavior.

Acceptance criteria:

- Mock state hook clearly names future replacement APIs.
- App still routes through the hook.

Validation commands:

- `npm run lint`
- `npm run build`

### 6. Isolate Deprecated Map Compatibility Fields

Purpose: Keep deprecated fields from spreading further.

Implementation notes:

- Audit usage of `mapStyle`, `mapPlaceholder`, and `playerMapPlaceholder`.
- Prefer `dungeon.map.style` where the change is small.
- Do not remove fields if it causes broad churn.

Acceptance criteria:

- New code uses `map.style`.
- Deprecated fields remain documented until safe removal.

Validation commands:

- `npm run validate:dungeons`
- `npm run lint`
- `npm run build`

### 7. Add Archive/Favorite Backend Adapter Stub

Purpose: Prepare favorite/archive UI for later persistence without adding real backend calls.

Implementation notes:

- Create a tiny mock adapter module that exposes save/remove/list functions backed by local state or mock data.
- Keep `useMockDailyDungeonApp` as the owner of behavior.
- Do not use localStorage yet unless explicitly chosen.

Acceptance criteria:

- Favorite/archive behavior is unchanged.
- Future API names are easy to map.

Validation commands:

- `npm run lint`
- `npm run build`

### 8. Add Reroll Resource Adapter Stub

Purpose: Separate resource spending semantics from the UI.

Implementation notes:

- Move resource consume/check helpers out of the hook if it stays small.
- Keep current mock count behavior.
- Preserve locked and depleted states.

Acceptance criteria:

- Reroll panel and room partial refresh still decrement mock counts.
- Lantern remains locked out.

Validation commands:

- `npm run lint`
- `npm run build`

### 9. Add Fixture Export For Backend Seed Data

Purpose: Make it easier to reuse mock dungeons as first backend fixtures.

Implementation notes:

- Add or document a JSON export strategy for the finalized mock dungeons.
- Ensure structured exits and stable IDs are included.
- Do not create backend storage yet.

Acceptance criteria:

- There is a clear way to produce backend fixture JSON from current mock data.
- Fixture output validates.

Validation commands:

- `npm run validate:dungeons`
- `npm run lint`
- `npm run build`

### 10. Add Manual QA Checklist For Core Prototype Flows

Purpose: Make regression checking easier before backend integration.

Implementation notes:

- Create a short checklist covering tier selector, dungeon selector, Today, Run Mode, GM View, Player Map, Archive, and Rerolls.
- Include Lantern, Adventurer, and Dungeonwright passes.

Acceptance criteria:

- Checklist exists in docs.
- It is short enough to use before commits.

Validation commands:

- `npm run validate:dungeons`
- `npm run lint`
- `npm run build`

### 11. Review Long Content Stress Cases

Purpose: Keep the prototype resilient when backend-generated content varies in length.

Implementation notes:

- Use existing mock dungeons to identify long title, long hook, long room, and dense inhabitant cases.
- Document any layout risks found.
- Do not redesign UI unless a separate task is approved.

Acceptance criteria:

- Stress cases are listed.
- No code changes unless separately approved.

Validation commands:

- `npm run validate:dungeons`
- `npm run lint`
- `npm run build`

### 12. Add Backend Readiness Status Note

Purpose: Keep contributors oriented around what is ready versus mocked.

Implementation notes:

- Add a short status section to docs or README.
- Point to `api-boundary`, `backend-plan`, and this roadmap.

Acceptance criteria:

- New contributors can find the next backend task quickly.
- No UI changes.

Validation commands:

- `npm run validate:dungeons`
- `npm run lint`
- `npm run build`
