# Daily Dungeon MVP Transition Plan

This document summarizes the current prototype state and defines a practical path from mock frontend to real MVP. It is planning documentation only; no backend, payments, authentication, or generation implementation exists yet.

## Current Prototype Status

The prototype is strong as a frontend/product proof:

- 10 validated mock dungeons across distinct environments.
- Lantern, Adventurer, and Dungeonwright tier model.
- Lantern schematic maps and Level 2 premium maps.
- GM Map and Player Map behavior with secret/GM marker hiding.
- Run Mode for live table use.
- GM View with compact/expanded room cards and room index.
- Archive and favorite placeholders.
- Mock full reroll, variant reroll, and partial refresh behavior.
- Centralized entitlement logic in `src/lib/entitlements.ts`.
- Mock app state isolated in `src/hooks/useMockDailyDungeonApp.ts`.
- Dungeon contract, `map.connections`, structured exits, and optional layout metadata.
- Validation script: `npm run validate:dungeons`.
- Level 2 map registry and environment-specific renderers.

The prototype is not yet an MVP because all persistence, generation, accounts, subscriptions, exports, and delivery APIs are mocked.

## MVP Definition

The first real MVP should prove that a GM can open Daily Dungeon, receive a validated dungeon for the day, run it at the table, and save useful dungeons for later.

MVP should include:

- A real global daily dungeon endpoint.
- Backend validation before dungeons are served.
- A small curated or generated content pipeline.
- Basic account identity for saved dungeons once persistence begins.
- Persistent favorites/archive for Adventurer.
- Clear player-safe map behavior.
- Instrumentation for feedback and content quality.

MVP should not initially require:

- Real payment processing.
- Real PDF export.
- Full AI generation controls.
- Fog-of-war.
- Native app packaging.
- Fully automated partial refresh generation.

## Private Playtest Milestone

Goal: Test table usefulness and content quality with a small group before adding payment complexity.

Build before private playtest:

- Static or fixture-backed `GET /api/dungeons/today`.
- Backend-side dungeon validation using the existing contract rules.
- Frontend data adapter that can switch from mock fixtures to the daily endpoint.
- Basic feedback capture: thumbs up/down, issue report, free-text note, and session outcome.
- Manual content publishing workflow for daily dungeons.
- Privacy-safe analytics for core flow usage.
- Basic responsive QA on common mobile widths.

Still acceptable as mocked:

- Tier selector.
- Account state.
- Favorite/archive persistence.
- Rerolls/refreshes.
- PDF/export.
- Payments.

Done when:

- A playtester can open the app on mobile, select/run the daily dungeon, use GM and player map views, and submit feedback.
- The served dungeon passes validation.
- No GM-only data appears in Player Map.

## Public Web Beta Milestone

Goal: Let unknown users try the product safely on the web.

Build before public beta:

- Production hosting and deployment pipeline.
- Error monitoring and basic analytics.
- Stable daily dungeon API with cache behavior.
- Terms, privacy policy, and content disclaimer.
- Account system if favorites/archive are advertised as persistent.
- Persistent favorites/archive for Adventurer-style testing.
- Basic admin/content tooling for publishing or approving daily dungeons.
- Rate limiting for public endpoints.
- Accessibility and mobile readability pass.

Beta should keep payments off unless retention and value are already evident.

Done when:

- Anonymous Lantern users can reliably receive the global daily dungeon.
- Logged-in test users can save/favorite and view archive if those features are exposed.
- The product has public-safe legal pages and support/contact path.

## Paid Subscription Milestone

Goal: Charge only after the Adventurer and Dungeonwright value propositions are validated.

Build before payments:

- Real accounts.
- Real entitlement/subscription state endpoint.
- Persistent archive/favorites.
- Reroll resource tracking with reset/carryover logic.
- Transaction-safe resource spending with idempotency protection.
- Clear billing copy, refund/support process, and subscription management.
- Payment provider integration and webhook handling.
- Entitlement cache invalidation after billing events.
- Abuse/rate-limit rules for generation-heavy features.

Do not charge for:

- Mock PDF export.
- Mock generation controls.
- Rerolls that do not produce real value.

Tier model assessment:

- Lantern still makes sense as a global daily dungeon preview.
- Adventurer is the likely first paid tier: persistent archive, favorites, player-safe maps, better maps, and limited rerolls are concrete table value.
- Dungeonwright should wait until advanced controls, generation reliability, and export/fog tools are real enough to justify the higher tier.

## Mobile App Milestone

Goal: Package only after the web product proves repeated table use.

Build before App Store / Google Play release:

- Production auth and account recovery.
- Subscription disclosures and store-compliant purchase flow if selling in-app.
- Privacy policy and data deletion process.
- Crash reporting and mobile performance monitoring.
- Offline or poor-network behavior decision.
- Touch target and small-screen QA.
- App store metadata, screenshots, support URL, and review notes.
- Generated content safety/moderation policy.
- Release/rollback checklist.

Delay native packaging until retention, table use, and paid value are clearer.

## Mock-Only Or Placeholder Areas

- Real dungeon generation pipeline.
- Backend/database persistence.
- User accounts.
- Subscription/payment state.
- Real rerolls and partial refresh generation.
- Real PDF/export bundle.
- Archive/favorite persistence.
- Fog-of-war/reveal state.
- Player-safe map as backend payload or generated asset.
- Analytics/feedback collection.
- Admin/content publishing workflow.

## Highest Technical Risks

- Generated dungeon quality: content must be ready to run, system-agnostic, coherent, and not repetitive.
- Map/text drift: generated maps, `map.connections`, route visuals, structured exits, and room prose must be produced from the same source.
- Player-safe leakage: secrets, hazards, treasure, and GM-only notes must never appear in player-facing output.
- Reroll abuse and cost: generation must be rate-limited, entitlement-checked, and transaction-safe.
- Payment entitlement drift: billing state and app feature gates must stay synchronized.
- Mobile performance: SVG maps and long dungeon content must stay responsive on older phones.
- Content safety/legal: generated material needs moderation and clear user-facing terms.

## Features To Postpone

- Fog-of-war.
- Export bundle.
- Real PDF export.
- Native app packaging.
- Advanced Dungeonwright controls.
- Partial refresh generation.
- Personalized seeded generation.
- More map environments.
- Offline mode.
- Public community sharing.

## User Validation Questions

Answer these before building payments:

- Do GMs actually run the daily dungeon at the table?
- Is one global daily dungeon enough for Lantern engagement?
- Does Adventurer feel worth paying for because of player maps, archive/favorites, premium maps, and rerolls?
- Which reroll type matters most: full, variant, or partial?
- Do users care more about PDF export or in-app Run Mode?
- Are premium maps a purchase driver or just polish?
- How often do GMs need archive access?
- Which systems/play styles need different wording or data fields?

## Recommended Next 10 Implementation Tasks

1. Add a backend fixture export for finalized mock dungeons.
2. Create a minimal backend service skeleton.
3. Port or share dungeon validation on the backend.
4. Implement `GET /api/dungeons/today` from validated fixtures.
5. Add frontend data adapter behind `useMockDailyDungeonApp`.
6. Add private playtest feedback capture.
7. Add production-safe analytics/error monitoring.
8. Add account planning spike and persistence schema for favorites/archive.
9. Implement persistent favorites/archive after accounts are chosen.
10. Design transaction-safe reroll resource storage before real generation.

## Suggested Order Of Development

1. Preserve the current prototype as the product reference.
2. Build static daily dungeon backend delivery.
3. Add playtest feedback and analytics.
4. Run private playtests with curated/fixture dungeons.
5. Add accounts plus persistent favorites/archive.
6. Add entitlement payloads.
7. Add transaction-safe reroll resource tracking.
8. Introduce controlled generation behind validation.
9. Validate paid tier value.
10. Add payments only after retention and value are clear.

## Recommended Next Technical Task

Create a backend fixture export script that writes the finalized, validated mock dungeons to JSON.

Why this first:

- It reuses current high-quality mock data.
- It creates seed data for the first backend endpoint.
- It tests whether the frontend `Dungeon` contract is truly serializable.
- It keeps generation, accounts, and payments out of the first backend slice.

Status: implemented as `npm run export:fixtures`. The script validates finalized mock dungeons first, then writes individual fixture JSON files plus `fixtures/dungeons/index.json`. These fixtures are intended to seed the future `GET /api/dungeons/today` backend endpoint without changing current frontend behavior.
