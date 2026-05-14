# Daily Dungeon API Boundary

This document sketches future API and data boundaries for Daily Dungeon. It is planning documentation only; the current app remains a frontend prototype using mock data.

The current prototype state layer lives in `src/hooks/useMockDailyDungeonApp.ts`. That hook is a temporary stand-in for the backend boundaries described here.

## Principles

- Free Lantern users receive the global cached daily dungeon.
- Adventurer users unlock table-use features, archive/favorites, player-safe maps, mocked exports, and limited reroll/refresh resources.
- Dungeonwright users unlock advanced generation controls, fog-of-war tooling, export bundles, and higher refresh limits.
- Cost-heavy work such as generation, rerolls, exports, and map variants should be entitlement-checked, rate-limited, idempotent where possible, and tracked as transactions.
- The `Dungeon` contract in `src/types.ts` is the frontend target shape. Backend payloads can include richer map geometry, but should preserve stable dungeon IDs, ISO dates, stable room IDs, structured exits, and `map.connections` as the connectivity source of truth.

## Shared Error States

Common errors should use predictable codes:

```json
{
  "error": {
    "code": "ENTITLEMENT_REQUIRED",
    "message": "Player-safe maps require Adventurer or above.",
    "requiredTier": "adventurer"
  }
}
```

Suggested codes:

- `UNAUTHENTICATED`
- `ENTITLEMENT_REQUIRED`
- `RESOURCE_EXHAUSTED`
- `NOT_FOUND`
- `VALIDATION_FAILED`
- `CONFLICT`
- `RATE_LIMITED`
- `GENERATION_FAILED`
- `EXPORT_FAILED`

## Fetch Today's Global Dungeon

Purpose: Return the shared cached daily dungeon for Lantern/free users and anonymous previews.

Request:

- `GET /api/dungeons/today`
- Optional query: `date=YYYY-MM-DD`

Required tier: Lantern.

Caching/cost notes:

- Should be globally cached by date.
- Should not trigger per-user generation.
- CDN or edge caching is appropriate.

Response shape:

```json
{
  "dungeon": {
    "id": "dd-2026-05-14-global",
    "dateIso": "2026-05-14",
    "date": "May 14, 2026",
    "title": "The Bell Below Blackfen",
    "theme": "Flooded shrine beneath a ruined tollhouse",
    "difficulty": "Moderate",
    "partySize": "3-5 adventurers",
    "estimatedPlayTime": "2-3 hours",
    "hook": "A cracked bell rings under the marsh every midnight.",
    "background": "GM-facing setup text.",
    "map": {
      "style": "blackfen",
      "gmMapId": "gm-map",
      "playerMapId": "player-map",
      "connections": [
        {
          "from": 1,
          "to": 2,
          "type": "normal",
          "path": "M190 128 H246"
        }
      ],
      "playerSafe": {
        "hideSecrets": true,
        "hideTreasure": true,
        "hideHazards": true,
        "hideGmNotes": true,
        "description": "A safe player handout description."
      }
    },
    "rooms": [],
    "encounterTables": {
      "wandering": [],
      "environmental": [],
      "complications": []
    },
    "treasureTable": [],
    "gmNotes": []
  },
  "source": "global-cache"
}
```

Error states:

- `NOT_FOUND` if no daily dungeon exists for requested date.
- `VALIDATION_FAILED` if generated/cache payload fails contract validation.

## Fetch User Personalized Or Seeded Dungeon

Purpose: Return a user-specific daily dungeon, seeded variant, or personalized generation result.

Request:

- `GET /api/users/me/dungeons/today`
- Optional query: `seed`, `theme`, `difficulty`, `size`, `inhabitantType`

Required tier:

- Adventurer for personalized saved daily access if offered.
- Dungeonwright for advanced controls.

Caching/cost notes:

- Cache by user/date/seed/control hash.
- Advanced controls may increase generation cost.
- Repeated requests with the same seed should be deterministic or return the stored generated result.

Response shape:

```json
{
  "dungeon": {},
  "source": "user-seeded",
  "seed": "user-123:2026-05-14:default",
  "controlsApplied": {
    "theme": "Crypt",
    "difficulty": "High",
    "size": "Standard"
  }
}
```

Error states:

- `UNAUTHENTICATED`
- `ENTITLEMENT_REQUIRED`
- `VALIDATION_FAILED`
- `GENERATION_FAILED`

## Fetch Archive List

Purpose: Return a list of available archived dungeons for a user.

Request:

- `GET /api/users/me/archive`
- Query: `cursor`, `limit`, `favoritesOnly`

Required tier: Adventurer.

Caching/cost notes:

- Cheap read if backed by stored dungeon metadata.
- Avoid returning full dungeon payloads in the list.

Response shape:

```json
{
  "items": [
    {
      "id": "dd-2026-05-10",
      "dateIso": "2026-05-10",
      "title": "The Saffron Drain Beneath Marketbell",
      "theme": "Sewer and undercity route",
      "difficulty": "High",
      "partySize": "4-5 adventurers",
      "estimatedPlayTime": "2-3 hours",
      "isFavorite": true,
      "thumbnailMapId": "sewer-player"
    }
  ],
  "nextCursor": null
}
```

Error states:

- `UNAUTHENTICATED`
- `ENTITLEMENT_REQUIRED`
- `VALIDATION_FAILED` for invalid query params.

## Fetch Archived Dungeon By ID

Purpose: Return a full archived dungeon payload.

Request:

- `GET /api/users/me/archive/{dungeonId}`

Required tier: Adventurer.

Caching/cost notes:

- Should be a stored read, not regeneration.
- Permission check must ensure the user owns or can access the archived dungeon.

Response shape:

```json
{
  "dungeon": {},
  "isFavorite": true,
  "archivedAt": "2026-05-10T12:00:00.000Z"
}
```

Error states:

- `UNAUTHENTICATED`
- `ENTITLEMENT_REQUIRED`
- `NOT_FOUND`

## Save/Favorite Dungeon

Purpose: Mark a dungeon as saved/favorite for the user.

Request:

- `POST /api/users/me/favorites`

```json
{
  "dungeonId": "dd-2026-05-10"
}
```

Required tier: Adventurer.

Caching/cost notes:

- Cheap write.
- Idempotent behavior is recommended.

Response shape:

```json
{
  "dungeonId": "dd-2026-05-10",
  "isFavorite": true
}
```

Error states:

- `UNAUTHENTICATED`
- `ENTITLEMENT_REQUIRED`
- `NOT_FOUND`

## Remove Favorite

Purpose: Remove a dungeon from the user's favorites.

Request:

- `DELETE /api/users/me/favorites/{dungeonId}`

Required tier: Adventurer.

Caching/cost notes:

- Cheap write.
- Should be idempotent.

Response shape:

```json
{
  "dungeonId": "dd-2026-05-10",
  "isFavorite": false
}
```

Error states:

- `UNAUTHENTICATED`
- `ENTITLEMENT_REQUIRED`
- `NOT_FOUND`

## Request Full Dungeon Reroll

Purpose: Spend a full reroll resource and return a new dungeon.

Request:

- `POST /api/users/me/dungeons/{dungeonId}/rerolls/full`
- Optional idempotency header: `Idempotency-Key`

```json
{
  "reason": "Need a different dungeon for tonight",
  "controls": {
    "theme": "Cavern",
    "difficulty": "Moderate"
  }
}
```

Required tier: Adventurer.

Caching/cost notes:

- Cost-heavy generation.
- Must be transactional.
- Dungeonwright controls may increase generation cost.

Response shape:

```json
{
  "transactionId": "rr_123",
  "resourceState": {
    "remainingFull": 0,
    "storedFull": 1,
    "remainingPartial": 2,
    "storedPartial": 3,
    "resetAt": "2026-05-15T00:00:00.000Z"
  },
  "dungeon": {}
}
```

Error states:

- `UNAUTHENTICATED`
- `ENTITLEMENT_REQUIRED`
- `RESOURCE_EXHAUSTED`
- `CONFLICT`
- `GENERATION_FAILED`

## Request Variant Reroll

Purpose: Spend a full reroll resource while preserving the map/connectivity, changing theme, story, inhabitants, or encounters.

Request:

- `POST /api/users/me/dungeons/{dungeonId}/rerolls/variant`

```json
{
  "preserve": ["map", "connections"],
  "change": ["theme", "inhabitants", "story", "encounters"]
}
```

Required tier: Adventurer.

Caching/cost notes:

- Cost-heavy, but may be cheaper than full map regeneration.
- Must preserve room IDs or return an explicit ID mapping if room content changes.

Response shape:

```json
{
  "transactionId": "rr_124",
  "resourceState": {},
  "dungeon": {}
}
```

Error states:

- `UNAUTHENTICATED`
- `ENTITLEMENT_REQUIRED`
- `RESOURCE_EXHAUSTED`
- `VALIDATION_FAILED`
- `GENERATION_FAILED`

## Request Partial Room Refresh

Purpose: Spend a partial refresh resource and update one room or one small dungeon section.

Request:

- `POST /api/users/me/dungeons/{dungeonId}/refreshes/partial`

```json
{
  "target": {
    "type": "room",
    "roomId": "dd-2026-05-10-room-05"
  },
  "preserve": ["map", "connections", "roomNumber"],
  "instructions": "Make the room more social and less hazardous."
}
```

Required tier: Adventurer.

Caching/cost notes:

- Transactional spend.
- Should validate that refreshed room still matches structured exits and `map.connections`.

Response shape:

```json
{
  "transactionId": "pr_456",
  "resourceState": {
    "remainingFull": 1,
    "storedFull": 1,
    "remainingPartial": 1,
    "storedPartial": 3,
    "resetAt": "2026-05-15T00:00:00.000Z"
  },
  "updatedRoom": {
    "id": "dd-2026-05-10-room-05",
    "number": 5,
    "name": "Valve Maze",
    "structuredExits": []
  },
  "dungeonPatch": {
    "roomsUpdated": ["dd-2026-05-10-room-05"]
  }
}
```

Error states:

- `UNAUTHENTICATED`
- `ENTITLEMENT_REQUIRED`
- `RESOURCE_EXHAUSTED`
- `NOT_FOUND`
- `CONFLICT`
- `GENERATION_FAILED`

## Reroll Transaction Behavior

Rerolls and refreshes should behave like transactions:

1. Check authentication if required.
2. Check entitlement.
3. Check remaining count and reset window.
4. Reserve or spend the count atomically.
5. Generate the result.
6. Validate generated data.
7. Return result and updated resource state.
8. Roll back or mark failed if generation cannot complete.

Rapid clicks must not double-spend resources. Use idempotency keys, server-side locks, or atomic database updates.

## Fetch User Entitlement/Subscription State

Purpose: Return the current user's tier and unlocked features.

Request:

- `GET /api/users/me/entitlements`

Required tier: Lantern, but authenticated users get their actual state.

Caching/cost notes:

- Cheap read.
- Cache briefly, but refresh after upgrade, downgrade, or billing event.

Response shape:

```json
{
  "userId": "user_123",
  "tier": "adventurer",
  "features": {
    "dailyDungeon": true,
    "gmView": true,
    "playerMap": true,
    "pdfExport": true,
    "archive": true,
    "favorite": true,
    "fullReroll": true,
    "partialRefresh": true,
    "advancedControls": false,
    "fogOfWar": false,
    "exportBundle": false
  },
  "subscription": {
    "status": "active",
    "renewsAt": "2026-06-14T00:00:00.000Z"
  }
}
```

Error states:

- `UNAUTHENTICATED` for account-specific state.

## Fetch Reroll/Refresh Resource State

Purpose: Return remaining daily and stored reroll/refresh resources.

Request:

- `GET /api/users/me/reroll-resources`

Required tier: Lantern. Lantern returns zeroed resources.

Caching/cost notes:

- Cheap read, but should be fresh after spending.
- Include reset time to avoid client-side guessing.

Response shape:

```json
{
  "tier": "adventurer",
  "remainingFull": 1,
  "storedFull": 1,
  "fullDailyLimit": 1,
  "fullStoredCap": 2,
  "remainingPartial": 2,
  "storedPartial": 3,
  "partialDailyLimit": 2,
  "partialStoredCap": 4,
  "resetAt": "2026-05-15T00:00:00.000Z"
}
```

Error states:

- `UNAUTHENTICATED` for account-specific resources.

## Request PDF Export

Purpose: Generate or fetch a table-ready PDF for one dungeon.

Request:

- `POST /api/users/me/dungeons/{dungeonId}/exports/pdf`

```json
{
  "includePlayerMap": true,
  "includeGmNotes": true,
  "paperSize": "letter"
}
```

Required tier: Adventurer.

Caching/cost notes:

- Potentially cost-heavy.
- Cache exports by dungeon ID plus export options.
- Prefer async job if rendering is slow.

Response shape:

```json
{
  "exportId": "exp_123",
  "status": "ready",
  "downloadUrl": "https://example.com/downloads/exp_123.pdf",
  "expiresAt": "2026-05-15T00:00:00.000Z"
}
```

Error states:

- `UNAUTHENTICATED`
- `ENTITLEMENT_REQUIRED`
- `NOT_FOUND`
- `EXPORT_FAILED`

## Request Export Bundle

Purpose: Generate grouped exports such as GM notes, player maps, and handouts.

Request:

- `POST /api/users/me/dungeons/{dungeonId}/exports/bundle`

```json
{
  "items": ["gm-notes", "player-map", "encounter-tables", "treasure-table"]
}
```

Required tier: Dungeonwright.

Caching/cost notes:

- Cost-heavy; should likely be async.
- Cache by dungeon ID and options.

Response shape:

```json
{
  "exportId": "bundle_123",
  "status": "queued"
}
```

Error states:

- `UNAUTHENTICATED`
- `ENTITLEMENT_REQUIRED`
- `NOT_FOUND`
- `EXPORT_FAILED`

## Fetch Player-Safe Map

Purpose: Return player-safe map data or asset reference for a dungeon.

Request:

- `GET /api/users/me/dungeons/{dungeonId}/maps/player`

Required tier: Adventurer.

Caching/cost notes:

- Should be cached per dungeon unless reveal/fog state changes.
- Must hide secret connections, treasure markers, hazards, GM labels, and hidden notes.

Response shape:

```json
{
  "dungeonId": "dd-2026-05-10",
  "mapId": "sewer-player",
  "assetUrl": null,
  "map": {
    "style": "sewer",
    "connections": [
      {
        "from": 1,
        "to": 2,
        "type": "normal"
      }
    ],
    "playerSafe": {
      "hideSecrets": true,
      "hideTreasure": true,
      "hideHazards": true,
      "hideGmNotes": true,
      "description": "Player-facing map description."
    }
  }
}
```

Error states:

- `UNAUTHENTICATED`
- `ENTITLEMENT_REQUIRED`
- `NOT_FOUND`

## Future Fog-Of-War / Reveal State

Purpose: Track which rooms, corridors, and notes are visible during live play.

Request:

- `GET /api/users/me/dungeons/{dungeonId}/reveal-state`
- `PATCH /api/users/me/dungeons/{dungeonId}/reveal-state`

Patch body:

```json
{
  "revealedRoomIds": ["dd-2026-05-10-room-01", "dd-2026-05-10-room-02"],
  "revealedConnectionIds": ["dd-2026-05-10-room-01-to-dd-2026-05-10-room-02"]
}
```

Required tier: Dungeonwright.

Caching/cost notes:

- Frequent small writes during play.
- Should support optimistic UI and conflict-safe updates.

Response shape:

```json
{
  "dungeonId": "dd-2026-05-10",
  "revealedRoomIds": ["dd-2026-05-10-room-01"],
  "revealedConnectionIds": [],
  "updatedAt": "2026-05-14T03:30:00.000Z"
}
```

Error states:

- `UNAUTHENTICATED`
- `ENTITLEMENT_REQUIRED`
- `NOT_FOUND`
- `CONFLICT`
