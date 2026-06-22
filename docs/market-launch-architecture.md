# Dungeon Dossier Market Launch Architecture

Last updated: June 18, 2026

## Purpose

This document records the intended market-launch direction for Dungeon Dossier before implementing accounts, payment, cloud sync, protected premium assets, or app-store distribution.

Dungeon Dossier is currently a tester/market-prep build. The current app should remain stable while future market-launch architecture is planned carefully.

## Product direction

Dungeon Dossier is a map-first tabletop gaming tool for creating and using printable dungeon packets.

Core product idea:

* start with an illustrated fantasy map;
* annotate it with room, marker, route, and print metadata;
* generate a usable dungeon dossier;
* support GM notes, player-safe maps, print/export tools, and Battle Map Print.

The app should continue to focus on busy Game Masters who need table-ready material quickly.

## Launch order

The preferred launch path is:

1. Web/PWA first.
2. Accounts and cloud sync.
3. Stripe subscription for web.
4. Protected premium asset delivery.
5. Paid web launch.
6. Apple App Store and Google Play later.

The app-store versions are important for market reach, but they should come after the web subscription model is stable.

## Account strategy

Accounts should be used for:

* login identity;
* subscription status;
* saved dossier sync;
* plan limits;
* restoring access across devices.

Accounts should not be overbuilt at first.

Preferred login methods for the first real account version:

* magic link email login;
* Google login.

Avoid email/password at first if possible because it adds password reset, password security, and account recovery complexity.

## Guest, Surveyor, and Cartographer account behavior

### Guest / no account

A guest user has no cloud identity.

Guest users may be able to:

* view basic app information;
* open the free sample packet;
* preview limited Surveyor-style functionality;
* store temporary or local-only app state.

Guest users should not expect cloud sync.

Without an account, saved data cannot reliably sync across devices.

### Signed-in Surveyor

A signed-in Surveyor user should have:

* free account access;
* one cloud-synced saved dossier;
* free sample packet access;
* limited preview access to normal premium packets;
* locked premium features where appropriate.

### Signed-in Cartographer

A signed-in Cartographer user should have:

* paid subscription access;
* five cloud-synced saved dossiers;
* premium illustrated packets;
* GM View;
* player-safe maps;
* Print Packet;
* Save as PDF;
* Battle Map Print for calibrated maps;
* New Packet Refresh where appropriate.

The current planned Cartographer cloud-synced saved dossier limit is 5, not 10.

## Saved dossier sync

Saved dossiers should eventually sync through the user account.

Recommended approach:

* local storage remains useful for temporary state, cache, preferences, and fast loading;
* cloud storage becomes the source of truth for signed-in saved dossiers;
* guest users remain local-only;
* signed-in Surveyor users get one cloud-synced saved dossier;
* signed-in Cartographer users get five cloud-synced saved dossiers.

If local browser data is cleared, local-only saved data may be lost. Cloud-synced saved dossiers should be recoverable after signing in.

## Premium asset protection

The current tester build may keep premium map assets in public frontend folders, but this is not suitable for a real paid launch.

Before paid launch, full premium assets should move out of public frontend access.

Public assets may include:

* app logo and brand assets;
* the free sample tavern packet;
* low-resolution or cropped preview images;
* static marketing screenshots.

Protected assets should include:

* full premium map images;
* premium packet JSON;
* premium print/export source content;
* premium battle map print source content.

The goal is to prevent unpaid users from accessing full premium content.

It is not possible to fully prevent paid users from saving, printing, exporting, screenshotting, or sharing PDF output. Protection against paid-user redistribution should rely on:

* Terms of Service;
* license restrictions;
* branding;
* optional light watermarking later;
* not over-investing in impossible PDF protection.

## Free sample and preview policy

The free sample tavern packet is intentionally public/free.

Static preview images on the Plans page are intentionally public, cropped, and non-interactive.

Free users should be able to try the free sample packet, but this should not unlock the full premium library.

## Payment strategy

For the web/PWA version, the preferred payment provider is Stripe.

Stripe should eventually handle:

* Cartographer subscription checkout;
* subscription renewal;
* cancellation or billing portal access;
* payment status;
* subscription status updates through webhooks.

Payment is not active in the current tester build.

Before payment is enabled, the app should have:

* Terms of Service;
* Privacy Policy;
* support contact;
* clear subscription wording;
* refund/cancellation wording;
* Terms agreement checkbox before checkout or account creation where appropriate.

## App-store strategy

Apple App Store and Google Play are important future channels, but they add complexity.

The app-store versions should come after the web subscription system is stable.

Future app-store work may require:

* Apple Developer account;
* Google Play Developer account;
* App Store review preparation;
* Google Play review preparation;
* Apple StoreKit / In-App Purchase implementation;
* Google Play Billing implementation;
* restore purchase behavior;
* app-store subscription status syncing;
* possible differences between web subscriptions and app-store subscriptions.

Do not implement app-store billing until the web/PWA subscription model is stable.

## Account menu future behavior

Current Account & Help menu is a shell.

Future signed-out menu may include:

* Sign in;
* Terms of Service;
* Privacy Policy;
* Contact Support.

Future signed-in Surveyor menu may include:

* signed-in email;
* current plan: Surveyor;
* saved dossiers: 0/1 or 1/1;
* upgrade to Cartographer;
* Terms of Service;
* Privacy Policy;
* Contact Support;
* sign out.

Future signed-in Cartographer menu may include:

* signed-in email;
* current plan: Cartographer;
* saved dossiers: 0/5 through 5/5;
* manage subscription;
* Terms of Service;
* Privacy Policy;
* Contact Support;
* sign out.

## Legal and policy update triggers

The Terms of Service and Privacy Policy are first drafts for the tester/market-prep build.

They should be reviewed and updated before or when adding:

* real accounts;
* cloud sync;
* Stripe payments;
* Apple or Google billing;
* app-store publication;
* analytics;
* backend database storage;
* email newsletters;
* user-uploaded content;
* commissioned artist content workflows.

## Current near-term priorities

Near-term market-readiness priorities:

1. Keep the tester build stable.
2. Document account, payment, sync, and asset-protection decisions.
3. Change visible Cartographer saved dossier copy from 10 to 5 when ready.
4. Plan authentication provider.
5. Plan cloud-synced saved dossier storage.
6. Plan protected premium asset delivery.
7. Plan Stripe web subscription.
8. Revisit Terms of Service and Privacy Policy before real launch.

End of document.
