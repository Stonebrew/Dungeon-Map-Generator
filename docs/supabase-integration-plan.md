# Supabase Integration Plan

## Purpose

This plan prepares Dungeon Dossier for accounts, cloud-synced saved dossiers, paid entitlement checks, and protected premium content.

It is a planning document only. Supabase is not active in the current tester build, and this document does not implement authentication, cloud sync, payment, backend code, database migrations, protected asset loading, or Stripe.

## Current app state

Dungeon Dossier is currently a React, Vite, TypeScript, and Tailwind frontend prototype. The app runs from local mock data and frontend state.

Current behavior:

* no real authentication;
* no Supabase client;
* no backend database;
* no cloud sync;
* no Stripe or payment flow;
* Account & Help menu exists as a shell with Terms of Service, Privacy Policy, and Contact Support;
* Surveyor and Cartographer behavior is controlled locally;
* Surveyor has 1 saved dossier;
* Cartographer has 5 saved dossiers;
* Dungeonwright remains hidden from normal user-facing plan UI;
* the free sample tavern packet is available as a complete free sample;
* premium showcase packets and premium map image paths are currently bundled through frontend data and public assets;
* New Packet Refresh is local/mock behavior;
* saved dossier/archive state is local React state for the current session;
* one New Packet Refresh use is persisted in browser `localStorage` by date.

The primary production domain is intended to be `https://dungeondossier.com`, with `https://www.dungeondossier.com` redirecting to the root domain. The existing Vercel URL `https://dungeon-map-generator.vercel.app` may remain useful for tester builds.

## Files and areas inspected

Important files inspected:

* `src/App.tsx`
  * Main app shell, route/view switching, Account & Help menu, legal/support modals, mobile navigation, free sample callout, and wiring from the app state hook into feature views.
* `src/hooks/useMockDailyDungeonApp.ts`
  * Current local app state layer. Owns selected dungeon, selected tier, saved dossier IDs, archive limit messages, New Packet Refresh state, view locking, and localStorage persistence for daily refresh usage.
* `src/lib/entitlements.ts`
  * Current local entitlement definitions. Defines tier rank, archive slot limits, feature gates, visible tier labels, and the free sample premium-feature exception.
* `src/data/mockDungeon.ts`
  * Current source of plans, visible tier copy, reroll allowances, mock dungeon packet data, premium map metadata, free sample flag, and active mock dungeon list.
* `src/types.ts`
  * Current TypeScript data contract for tiers, plans, dungeons, premium map metadata, map image assets, battle map calibration, room content, saved/feature metadata, and reroll allowances.
* `src/components/ArchiveView.tsx`
  * Current archive display. Reads archive slot limits through `getArchiveSlotLimit` and displays session-only saved dossiers.
* `src/components/PremiumPlans.tsx`
  * Pricing Preview and plan comparison UI. Filters out Dungeonwright and presents Surveyor/Cartographer copy.
* `src/components/BattleMapPrintView.tsx`
  * Battle Map Print UI. Uses local entitlement checks and premium map calibration metadata to generate A4 landscape tiled output.
* `src/components/DungeonMap.tsx`
  * Chooses schematic, fallback, or premium map rendering based on local entitlement-derived props and premium asset availability.
* `src/components/maps/premium/premiumMapAssets.ts`
  * Selects premium GM/player image assets and overlays directly from `dungeon.map.premiumMap`.
* `src/components/dev/PremiumMapAnnotator.tsx`
  * Dev-only annotation workflow. Loads current premium map metadata, custom local image paths under `/premium-maps/`, and exports annotation packages.
* `src/lib/validateDungeon.ts`
  * Validates premium map metadata, battle map print calibration, schematic footprints, overlays, and dungeon structure.
* `docs/market-launch-architecture.md`
  * Current market-launch direction for accounts, cloud sync, Stripe, protected premium assets, and app-store sequencing.
* `public/`
  * Current public frontend assets include brand/logo assets, static preview images, free sample tavern image, and multiple premium map images under `public/premium-maps/`.

## Future Supabase responsibilities

Supabase should eventually handle:

* authentication session state;
* magic link email login;
* Google login;
* user profile records;
* account plan status;
* saved dossier cloud sync;
* saved dossier limits;
* subscription status mirrored from Stripe;
* entitlement lookup for signed-in users;
* premium packet metadata access;
* protected premium asset metadata;
* optionally protected storage for full premium map assets and packet JSON.

Supabase should not be responsible for impossible DRM. Paid users will still be able to print, export, screenshot, or save what they can legitimately view. Redistribution limits should rely on Terms of Service, license language, branding, and optionally light watermarking later.

## Auth plan

Preferred first auth methods:

* magic link email login;
* Google login.

Guest mode should remain available. Guest users should be able to open the free sample packet, preview limited Surveyor-style behavior, and use local-only state where appropriate.

Likely Supabase auth redirect URLs:

* `http://localhost:5173`
* `https://dungeondossier.com`
* `https://www.dungeondossier.com`
* `https://dungeon-map-generator.vercel.app` if it remains in use for testing

Avoid email/password at first if possible. Email/password adds password reset, password security, and account recovery work that is not needed for the first paid web launch.

## Database plan

Do not implement these tables yet. They are proposed for the first Supabase-backed version.

### `profiles`

Purpose: one profile row per authenticated user.

Likely fields:

* `id uuid primary key references auth.users(id)`
* `email text`
* `display_name text`
* `plan text` such as `surveyor` or `cartographer`
* `created_at timestamptz`
* `updated_at timestamptz`

Notes:

* The visible app uses Surveyor and Cartographer names.
* Internal legacy tier IDs may remain in frontend code during early migration, but database values should probably use launch names if starting fresh.

### `subscriptions`

Purpose: mirror Stripe subscription state for entitlement lookup.

Likely fields:

* `id uuid primary key`
* `user_id uuid references auth.users(id)`
* `stripe_customer_id text`
* `stripe_subscription_id text`
* `status text`
* `price_id text`
* `current_period_start timestamptz`
* `current_period_end timestamptz`
* `cancel_at_period_end boolean`
* `created_at timestamptz`
* `updated_at timestamptz`

Notes:

* Stripe webhooks should update this table from server-only code.
* The frontend should read subscription-derived entitlement state from Supabase or from a server endpoint, not from client-only assumptions.

### `saved_dossiers`

Purpose: cloud-synced saved dossier records.

Likely fields:

* `id uuid primary key`
* `user_id uuid references auth.users(id)`
* `packet_id text`
* `title text`
* `packet_snapshot jsonb`
* `notes jsonb`
* `created_at timestamptz`
* `updated_at timestamptz`

Notes:

* V1 can store a saved packet reference plus minimal user notes.
* Full packet snapshots may be useful if premium packet content changes over time, but they increase storage and entitlement complexity.
* Keep v1 simple: no complex offline conflict resolution.

### `premium_packets`

Purpose: catalog premium packet metadata separate from full protected content.

Likely fields:

* `id text primary key`
* `slug text`
* `title text`
* `theme text`
* `is_free_sample boolean`
* `is_active boolean`
* `requires_plan text`
* `preview_image_url text`
* `created_at timestamptz`
* `updated_at timestamptz`

Notes:

* Free sample packet metadata can be public.
* Premium packet metadata can expose safe preview fields while full packet content remains protected.

### `packet_access`

Purpose: optional future per-user or per-packet access grants.

Likely fields:

* `id uuid primary key`
* `user_id uuid references auth.users(id)`
* `packet_id text references premium_packets(id)`
* `access_source text`
* `created_at timestamptz`

Notes:

* May not be needed for a simple all-Cartographer-library model.
* Useful later for bundles, individual purchases, tester grants, creator comps, or app-store entitlement edge cases.

### Protected storage metadata

If Supabase Storage is used for premium assets, the database may need references such as:

* `packet_id`
* `asset_kind`
* `storage_bucket`
* `storage_path`
* `mime_type`
* `width`
* `height`
* `requires_plan`

## Row Level Security / access rules

RLS should be enabled on account-owned tables.

Conceptual rules:

* users can read their own `profiles` row;
* users can update safe profile fields for their own account;
* users can read and write their own `saved_dossiers`;
* saved dossier count should be enforced by database policy, trigger, RPC, or server function, not only frontend checks;
* Surveyor users are capped at 1 saved dossier;
* Cartographer users are capped at 5 saved dossiers;
* free sample packet metadata/content remains public;
* premium packet metadata may expose safe public preview fields;
* full premium packet content requires active Cartographer entitlement;
* full premium asset URLs should not be permanently public;
* service-role access should be server-only and never exposed to the browser.

Supabase RLS can restrict row access, but subscription-derived limits often need helper functions or RPC calls so the count and plan state are evaluated atomically.

## Saved dossier sync plan

Current behavior:

* `useMockDailyDungeonApp` stores saved dossier IDs in React state only;
* `ArchiveView` displays session-only saved dossiers;
* `getArchiveSlotLimit` controls the local cap;
* guest/local behavior does not sync across devices.

Future behavior:

* guest users remain local-only;
* signed-in Surveyor users sync 1 saved dossier to Supabase;
* signed-in Cartographer users sync 5 saved dossiers to Supabase;
* local storage remains useful for temporary state, fast loading, and preferences;
* cloud storage becomes the source of truth for signed-in saved dossiers.

Migration/import from local saved dossiers can be a later feature. V1 does not need robust offline conflict resolution. A simple approach is:

1. load cloud saved dossiers on sign-in;
2. show cloud saved dossiers in Archive;
3. keep unsynced guest state local;
4. optionally prompt users later to import a local saved dossier into their account if slots are available.

## Entitlement plan

Current local entitlement behavior:

* visible tier is selected in local state through `useMockDailyDungeonApp`;
* feature gates are defined in `src/lib/entitlements.ts`;
* `canAccessFeature` checks tier rank;
* `canAccessDungeonFeature` adds an exception for the free sample packet;
* Surveyor and Cartographer plan copy lives in `src/data/mockDungeon.ts`;
* Dungeonwright remains hidden by filtering it out in `PremiumPlans`.

Future entitlement states:

* signed-out guest;
* signed-in Surveyor;
* signed-in Cartographer.

The frontend can keep local helper functions for UI clarity, but premium access must not trust only frontend state. Server-side or Supabase-protected checks should decide whether a user can read protected premium packet content and full premium assets.

Stripe should eventually update a Supabase subscription mirror through a secure webhook. The app should read entitlement state from the authenticated user profile/subscription state rather than from the current preview tier selector.

The preview tier selector can remain as a development/tester tool only until real accounts replace it.

## Protected asset plan

Current asset state:

* full premium image paths are currently embedded in `src/data/mockDungeon.ts` inside `premiumMap.baseMapImage.url`;
* many current premium images live under `public/premium-maps/`;
* the free sample tavern image also lives under `public/premium-maps/`;
* static plan comparison previews live under `public/previews/`;
* the app logo lives under `public/brand/`;
* `PremiumMapLayer`, `premiumMapAssets.ts`, Battle Map Print, Print Packet, and normal map views use the image URLs supplied by the dungeon metadata.

Clean future boundary:

Public:

* `public/brand/` app logo and brand assets;
* free sample tavern packet image and public free sample content;
* cropped/static preview images;
* marketing screenshots;
* safe metadata needed for listing packets.

Protected:

* full premium map images;
* full premium packet JSON;
* premium print/export source content;
* premium battle map print source content;
* any full-resolution player/GM map variants.

Recommended migration path:

1. keep free sample and preview assets public;
2. define a protected packet loader boundary before moving assets;
3. move one premium packet to protected loading as a proof of concept;
4. ensure Print Packet, Save as PDF, and Battle Map Print can receive authorized URLs or blobs;
5. move remaining premium packets after the proof of concept is stable.

Signed URLs may be useful for protected images, but they should be short-lived. The app should expect to refresh or request URLs as needed.

## Stripe handoff plan

Stripe should come after Supabase account and entitlement planning.

Future flow:

1. signed-in user chooses Cartographer;
2. frontend calls a server-only checkout endpoint;
3. Stripe Checkout creates or updates subscription;
4. Stripe redirects back to Dungeon Dossier;
5. Stripe webhook updates Supabase `subscriptions`;
6. app reads subscription status from Supabase;
7. Supabase entitlement state unlocks protected premium content.

Stripe implementation is a later milestone. Do not add Stripe keys, checkout code, billing portal code, or webhook code in the first Supabase planning/connection phase.

## Environment variables needed later

Likely future variables:

* `VITE_SUPABASE_URL`
* `VITE_SUPABASE_ANON_KEY`
* Supabase service role key for server-only webhook/API code later
* Stripe secret key later
* Stripe webhook secret later

Do not expose service role keys, Stripe secret keys, or webhook secrets to Vite/browser code.

## Phased implementation plan

### Phase 1: Add Supabase client/config without changing behavior

* Install Supabase client package.
* Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
* Create a small `src/lib/supabaseClient.ts`.
* Do not change app behavior yet.
* Confirm the app still runs without auth-dependent UI changes.

### Phase 2: Add sign-in UI in Account & Help

* Replace "Sign in / Account - coming soon" with a minimal sign-in panel.
* Support magic link email login.
* Add Google login after provider configuration.
* Keep guest mode available.
* Keep Terms, Privacy, and Contact Support in the menu.

### Phase 3: Add guest/signed-in app state

* Add an auth/session hook.
* Represent guest, signed-in Surveyor, and signed-in Cartographer states.
* Keep current local preview behavior isolated for development or tester builds.

### Phase 4: Add saved dossier cloud sync

* Create `saved_dossiers` table and RLS policies.
* Load saved dossiers for signed-in users.
* Keep guest saved state local-only.
* Enforce Surveyor 1 and Cartographer 5 limits through Supabase-side logic.

### Phase 5: Add subscription entitlement mirror

* Add `profiles` and `subscriptions` table logic.
* Read current plan from Supabase for signed-in users.
* Keep Stripe out until webhook/server work is ready.

### Phase 6: Move one premium packet to protected loading as proof of concept

* Choose one non-free premium packet.
* Move its full image and packet payload out of public frontend access.
* Load it only after entitlement check.
* Verify GM View, Player Map, Print Packet, Save as PDF, and Battle Map Print still work.

### Phase 7: Move remaining premium packets

* Move remaining full premium maps and packet payloads behind the protected loader.
* Keep free sample and preview images public.
* Update fixture/export expectations if the app moves away from static frontend packet data.

### Phase 8: Stripe sandbox

* Add checkout endpoint.
* Add Stripe webhook.
* Mirror subscription state into Supabase.
* Test upgrade, cancellation, renewal, and expired subscription paths.

### Phase 9: Live paid launch readiness

* Review Terms of Service and Privacy Policy.
* Review support workflow.
* Verify protected premium asset access.
* Verify saved dossier limits.
* Verify `dungeondossier.com` auth redirects.
* Confirm payment and cancellation wording.

## Risks and questions

Risks:

* Moving premium content out of frontend static data will affect many views that currently assume `Dungeon` objects are already present.
* Print Packet, Save as PDF, and Battle Map Print may need authorized asset URLs that remain valid long enough for browser print/export capture.
* Signed URL expiration could break long-open print pages if not refreshed.
* RLS alone may not be enough to enforce saved dossier caps without RPC, triggers, or server functions.
* Current tier IDs are legacy internal names (`lantern`, `adventurer`, `dungeonwright`) while visible launch names are Surveyor and Cartographer.
* The preview tier selector should not survive unchanged into real paid launch.
* Vercel frontend-only hosting will need serverless functions or another secure backend surface for Stripe webhooks and protected entitlement operations.
* App-store subscriptions may later complicate entitlement state if web and app-store purchases coexist.

Open questions:

* Should packet content be stored entirely in Supabase, in object storage as JSON, or generated into protected static artifacts?
* Should saved dossiers store packet snapshots, packet references, user notes, or some combination?
* Should protected premium images be served through Supabase Storage signed URLs or a custom serverless proxy?
* How long should signed asset URLs last for print/export workflows?
* When should internal tier IDs be renamed from legacy names to Surveyor/Cartographer?
* Should New Packet Refresh be tied to account/subscription state or remain daily local behavior until generation exists?

## Recommendation

The smallest safe next implementation task is:

Add a no-behavior-change Supabase foundation behind a feature-neutral boundary:

1. install the Supabase client;
2. add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to local environment documentation only;
3. create `src/lib/supabaseClient.ts`;
4. create a small auth/session hook that can report "not configured" or "guest" without changing current UI behavior;
5. do not alter entitlements, archive behavior, protected assets, or payment yet.

That gives the project a clean integration point without risking the current tester build. After that, the next meaningful product change should be a minimal Account & Help sign-in panel for magic link email login while preserving guest mode.
