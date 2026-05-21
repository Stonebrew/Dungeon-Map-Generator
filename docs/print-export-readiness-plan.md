# Daily Dungeon Print And Export Readiness Plan

This document defines what Daily Dungeon needs before printable maps, browser print, PDFs, and adventure packets can become a credible paid feature. It is planning documentation only; no print, PDF, PNG, SVG download, or backend export implementation exists yet.

The business premise is that a daily dungeon feed may create interest, but paid value probably depends on whether a GM can quickly turn a dungeon into something table-ready: a clean GM packet, a player-safe map, and printable notes that remove prep work.

## Current Export Readiness

Daily Dungeon already has strong export ingredients:

- 10 validated mock dungeon fixtures with stable IDs, ISO dates, structured room exits, encounter tables, treasure tables, GM notes, and player-safe map rules.
- A shared `Dungeon` contract in `src/types.ts`.
- `map.connections` as the source of truth for route rendering and exits.
- Lantern schematic maps plus premium Level 2 maps for Adventurer and Dungeonwright.
- Distinct GM and player-safe map rendering, with secret routes and GM markers hidden from player maps.
- Run Mode and GM View surfaces that prove the data is table-usable.
- Fixture export via `npm run export:fixtures`, producing backend-seed JSON under `fixtures/dungeons/`.

The app is not print/export ready yet because:

- Export actions are placeholders.
- There is no print-specific layout.
- Maps are responsive UI SVGs, not yet tested at letter/A4 print dimensions.
- There are no page-break rules, headers, footers, compact stat-free room layouts, or ink-friendly variants.
- There is no export job model, file generation, download handling, or cached export artifact.
- The current Export PDF action is intentionally mocked and must not be sold as a real export feature.

## Data Already Enough For Export

The current `Dungeon` payload is enough to create a first printable packet:

- Dungeon title, date, theme, difficulty, party size, estimated play time, hook, and background.
- GM map and player-safe map state from the same map data.
- Room list with read-aloud text, GM notes, threat, tags, inhabitants, treasure, secrets, exits, and structured exits.
- Encounter tables and treasure table.
- General GM notes.
- System-agnostic inhabitant fields: role, threat, durability, damage, tactics, morale, wants, and leverage.
- Layout metadata and `map.connections` for map consistency.

This is enough for browser print, a one-page summary, a GM reference packet, and separate map pages. It is also enough to test whether GMs prefer printing, saving to PDF from the browser, or running directly from mobile.

## Data Missing Or Weak For Export

Before export becomes a paid-value feature, the contract likely needs:

- Export-specific title/subtitle copy and legal/footer text.
- Optional adventure synopsis or session objective summary.
- Better room summaries for one-line packet tables.
- Optional player handout text that is explicitly safe to print.
- Map export metadata: preferred orientation, print-safe bounds, scale, margin, and legend density.
- Image/export asset IDs once maps are generated or cached server-side.
- Explicit content warnings or tone tags if public generation is added.
- Version or revision metadata so exported files can be regenerated consistently.
- Print/export options such as paper size, orientation, color mode, map-only export, and included sections.
- A clear safe-handout flag or section model so player-facing pages can be generated without accidentally including GM-only content.

These do not need to block a first browser-print prototype, but they matter before charging money.

## Minimum Printable Packet Definition

The first useful printable packet should include:

1. Cover or header block with title, date, theme, difficulty, party size, play time, and hook.
2. One-page GM summary with background, central problem, likely ending, and key secrets.
3. Printable GM map with room numbers, GM markers, secret routes, and legend.
4. Printable player-safe map without GM markers, secret routes, treasure markers, or hidden details.
5. Room-by-room GM notes with clear sections for Read Aloud, GM Notes, Inhabitants, Treasure, Secrets, and Exits.
6. Encounter tables.
7. Treasure table.
8. Optional player handout page only when safe handout copy exists.

For private playtesting, this can be browser print. For paid export, it should become a polished PDF or export bundle with reliable GM/player-safe separation.

## Map Export Readiness

The current SVG maps are suitable for a first print prototype because they are deterministic, local, and data-driven from `map.connections`.

They are not yet proven as paid-quality exports because:

- Level 2 maps are optimized for in-app preview, not print resolution and page size.
- SVG filters, subtle textures, pale colors, and small details may wash out on printers.
- Room numbers and GM markers need print-specific sizing tests.
- Player-safe maps need a cleaner print legend and possibly less UI framing.
- Some premium maps may need ink-light variants.
- PNG export requires reliable SVG-to-canvas rendering and font/style capture.

Map quality problems that would hurt paid value:

- Premium maps looking like decorated diagrams instead of table-ready maps.
- Player maps revealing GM-only markers, secret routes, hazards, treasure, or labels.
- Maps that print too pale, too dark, too small, or with unreadable numbers.
- Exported maps cropped differently from in-app maps.
- PDF packet layouts that make the GM hunt for room details during play.

## Technical Implementation Options

### Browser Print CSS

Best first step and the recommended private-playtest export milestone.

Benefits:

- Fastest to build.
- Uses current React/SVG components.
- Good for private playtesting.
- No backend export service needed.
- Lets us learn what GMs actually print.

Risks:

- Browser print output varies by device and browser.
- Harder to guarantee polished PDFs.
- Users must manually choose save-to-PDF.

### SVG Map Download

Good early map-specific export after print packet structure is tested.

Benefits:

- Preserves vector quality.
- Maps are already SVG.
- Useful for VTTs, notes, or printing separately.

Risks:

- Need to inline styles and fonts correctly.
- Some SVG filters/patterns may not travel cleanly.
- Requires separate GM and player-safe export paths.

### PNG Map Export

Useful for player handouts, sharing, and eventual VTT-adjacent workflows.

Benefits:

- Easy for users to share.
- More predictable than raw SVG in many tools.

Risks:

- SVG-to-canvas export can fail if styles are not fully inlined.
- Need resolution controls.
- Raster export can blur small labels if not sized correctly.

### Client-Generated PDF

Useful after print CSS is proven, but only if output quality remains high without a large client dependency burden.

Benefits:

- Can work without backend jobs.
- Gives users a direct PDF button.

Risks:

- Complex layout and pagination.
- Hard to produce professional typography consistently.
- Large client bundles if heavy PDF libraries are added.

### Server-Side PDF

Best paid export milestone if export becomes a central subscription feature.

Benefits:

- Most reliable output.
- Can cache export artifacts.
- Easier to support PDF bundles and consistent rendering.
- Better fit for subscriptions and export entitlement tracking.

Risks:

- Requires backend, storage, job state, caching, and failure handling.
- More operational cost.
- Must validate player-safe payloads before rendering.

## Recommended First Export Milestone

Build a browser-print packet preview for private playtesting.

Scope:

- Add a print-only route or view for the selected dungeon.
- Include GM packet and player-safe map sections.
- Add print CSS for letter and A4.
- Add page-break rules for maps, summary, rooms, encounters, and treasure.
- Keep the current Export PDF button labeled as a print/export preview until real PDF exists.
- Use existing dungeon data only.
- Do not add payment or backend export jobs yet.
- Treat this as a learning tool, not a final paid export product.

Done when:

- A GM can print or save-to-PDF a readable packet from the browser.
- GM map and player-safe map print on separate pages.
- Player-safe output hides GM-only data.
- Room notes, encounter tables, and treasure tables are readable on paper.
- Mobile viewing remains unchanged.

## Recommended Paid Export Milestone

Before charging for export as a premium value driver, build:

- Server-side or highly reliable generated PDF output.
- Cached export artifacts by dungeon ID and options.
- Separate GM PDF, player map PDF/image, and full adventure packet.
- Export entitlement checks through `src/lib/entitlements.ts` on the frontend and backend entitlement state later.
- Export option model: paper size, include player map, include GM notes, include handouts.
- QA snapshots for every environment in GM and player-safe export mode.
- Download error states and retry behavior.
- Export audit checks that confirm player-safe maps and handouts exclude GM-only data.

Done when:

- Adventurer users can reliably create a polished printable adventure packet.
- Dungeonwright users can eventually generate export bundles if that tier remains.
- Exported player maps never leak GM-only content.
- Export quality is consistent enough to be a subscription selling point.

## Business Implications

Export may be central to paid value.

Subscription may be justified if users repeatedly need:

- Daily or weekly ready-to-run packets.
- Premium player-safe maps.
- Archive/favorites.
- Rerolls and partial refreshes.
- Export bundles and printable prep material.

A one-time purchase or content-pack model may fit better if users mostly want:

- A fixed set of polished dungeons.
- Occasional printable packets.
- No recurring generation or resource-heavy features.

Questions to validate before payments:

- Do GMs print packets, run from the app, or use both?
- Is player-safe map export more valuable than in-app Player Map?
- Are premium maps enough to drive Adventurer conversion?
- Would users pay monthly for daily dungeons, or prefer themed packs?
- Does Dungeonwright need export bundles more than advanced controls?
- Would a polished printable packet convert users more strongly than daily generation alone?

## Before Private Playtesting

Build or verify:

- Browser print packet preview.
- Print CSS for maps and room notes.
- Manual QA for at least Lantern, Adventurer GM map, and Adventurer player map.
- A feedback question asking whether users printed, saved PDF, or ran from mobile.
- Basic player-safe leakage checklist.

Do not block private playtesting on server-side PDF.

## Before Charging Money

Build or verify:

- Reliable PDF or export bundle path.
- Persistent favorites/archive.
- Real entitlement state.
- Clear paid copy around what export does and does not include.
- Print/export QA across the 10 current environments.
- At least one table-use study proving exported packets are useful.

Do not charge for a mocked PDF button or export flow that only implies a real file.

## What To Postpone

- Server-side PDF jobs until browser print proves the packet format.
- PNG/SVG export options beyond maps until basic packet value is validated.
- Dungeonwright export bundle until Adventurer export value is clear.
- Player handouts beyond player-safe map unless safe handout copy is added.
- VTT export.
- Print-on-demand or marketplace features.

## Recommended Next 10 Tasks

1. Design a print packet information architecture using the existing `Dungeon` contract.
2. Add a print/export preview route or view, gated as Adventurer placeholder if exposed in product UI.
3. Add print CSS for letter and A4 with page breaks.
4. Render GM map and player-safe map as separate print sections.
5. Create compact room-by-room print cards.
6. Add printable encounter and treasure table sections.
7. Add print QA fixtures/screenshots for Lantern, Adventurer GM map, and Adventurer player map.
8. Add a player-safe export leakage checklist to documentation.
9. Add export option types for paper size and included sections without implementing PDF generation yet.
10. Prototype SVG map download for GM and player-safe maps after browser print is validated.

## Recommended Next Technical Task

Create a browser-print packet preview using the existing dungeon data and map renderers.

Why this first:

- It directly tests whether exported adventure packets are a paid-value driver.
- It requires no backend or payment implementation.
- It reuses the current validated dungeon contract.
- It will reveal map, typography, page-break, and player-safe issues before a PDF service is built.
