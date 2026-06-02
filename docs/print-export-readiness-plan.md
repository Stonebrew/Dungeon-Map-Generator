# Daily Dungeon Print And Export Readiness Plan

This document defines what Daily Dungeon needs before printable maps, browser print, PDFs, and adventure packets can become a credible paid feature. Browser print and a prototype client-side PDF download now exist; PNG, SVG download, server-side PDF, and backend export bundles remain future work.

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

The app is not finished as an export product yet because:

- PNG, SVG download, and server-side export actions are still placeholders.
- The Print Packet view now supports both browser Print and a direct client-side Save as PDF action, but the PDF path is still a prototype rather than a final server-rendered export system.
- Maps are still responsive UI SVGs and need deeper QA at letter/A4 print dimensions.
- There are basic page-break rules, but no polished headers, footers, page numbers, print option controls, or ink-friendly variants.
- There is no export job model, file generation, download handling, or cached export artifact.
- The current Save as PDF action captures the printable packet content in the browser. It must not be sold as a final server-generated PDF export until quality, pagination, and artifact reliability are proven.

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

Implemented as a prototype direct download path in the Print Packet view using `html2pdf.js`.

Benefits:

- Can work without backend jobs.
- Gives users a direct PDF button.
- Captures the same printable packet content used by browser print.

Risks:

- Complex layout and pagination.
- Hard to produce professional typography consistently.
- Large client bundles if heavy PDF libraries are added.
- DOM/SVG capture may rasterize content and can differ from native browser print output.

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

## Browser Print Packet Preview

Status: implemented and lightly polished as the first export milestone.

The prototype Print Packet view uses the currently selected dungeon and includes:

- Dungeon title, date, theme, difficulty, party size, play time, and hook.
- GM summary and running notes.
- GM map with room numbers, GM markers, secret routes, and legend.
- Player-safe map using the existing hidden-data rules.
- Room/keyed area notes with read-aloud text, GM notes, inhabitants, treasure, secrets, and exits.
- Encounter tables and treasure table.
- Browser print CSS that hides app navigation, DevPanel, buttons, tier selectors, and interactive controls.
- A separate Print button that opens the browser print dialog through `window.print()`.
- A Save as PDF button that captures only the printable packet content, excluding app navigation, DevPanel, buttons, helper text, and other screen-only controls.
- Save as PDF temporarily replaces each complete printable map section in place with a compact PNG-backed export section before capture, after inlining any illustrated base-map image references inside the cloned SVG. This gives the PDF renderer a capture-safe map section with the base art and overlays already combined, without leaving a blank live map card in the packet flow.
- Print Packet controls for portrait or landscape page orientation. Landscape is the default practical choice for wide premium illustrated maps.
- Print Packet controls for Player Labeled Map or Player Clean Map. Labeled player maps keep player-safe room numbers; clean player maps hide room numbers as well as GM markers and hidden routes.
- Today and GM View now surface this feature as Print / Export Packet plus a visible Save as PDF entry point, both leading to the Print Packet view where the direct PDF button is available.
- Print-specific room cards, map frames, captions, section labels, and page-break rules for a more usable table packet.
- Print-specific map presentation mode for GM and player-safe maps, with stronger label contrast, clearer route strokes, reduced decorative texture, and cleaner print framing.
- User-facing helper text explaining that browser print and direct client-side PDF download are available, while server-side PDF, PNG, and SVG exports remain future work.

Done when:

- A GM can print or save-to-PDF a readable packet from the browser.
- GM map and player-safe map print on separate pages.
- Player-safe output hides GM-only data.
- Room notes, encounter tables, and treasure tables are readable on paper.
- Mobile viewing remains unchanged.

Known limitations:

- Output quality depends on the browser print engine.
- Direct PDF download is client-side and may differ from native browser print pagination or rendering.
- Browser support for CSS print orientation can vary. The direct Save as PDF path passes the selected portrait/landscape orientation directly to the client PDF generator.
- Premium map images must be reachable from the browser at export time. Local `public/premium-maps/` assets work for development, but missing local files still cannot be embedded into the PDF.
- Map sections are marked to avoid page splitting, and Save as PDF uses in-place flattened map section snapshots to reduce html2canvas/SVG pagination failures, separated headings, and blank duplicate map frames.
- There are no export options for paper size, color mode, included sections, map-only output, grid toggles, or route toggles. Uploaded premium-map grids, paths, and terrain remain part of the base image.
- There is no cached export artifact or download history.
- Map print quality still needs manual QA across all 10 environments, especially premium Level 2 maps with subtle color or texture.
- There are no page numbers, running headers, custom cover pages, or print presets yet.
- SVG download, PNG export, server-side generated PDF, and server-side export bundles remain future work.

## Recommended First Export Milestone

Next, harden the browser-print packet preview for private playtesting.

Scope:

- QA the Print Packet view across Lantern locked behavior, Adventurer GM maps, and Adventurer player-safe maps.
- Add print QA screenshots or a checklist for all 10 environments.
- Improve page numbers, headers/footers, print presets, and compact room density if playtesters print full packets.
- Add a feedback prompt asking whether GMs printed, saved PDF, or ran from mobile.
- Do not add payment or backend export jobs yet.
- Treat this as a learning tool, not a final paid export product.

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

1. Add print QA screenshots or manual QA notes for all 10 environments.
2. Add a player-safe export leakage checklist to documentation.
3. Add export option types for paper size and included sections without implementing PDF generation yet.
4. Add optional one-line room summaries if playtesters need a denser packet.
5. Add print presets for GM packet, player map only, and table reference.
6. Add page numbers and simple running headers/footers.
7. Prototype SVG map download for GM and player-safe maps after browser print is validated.
8. Prototype PNG map export after SVG export is reliable.
9. Decide whether generated PDF should be client-side or server-side based on playtest demand.
10. Design backend export artifact storage only after the browser-print packet proves valuable.

## Recommended Next Technical Task

Add a print QA checklist and player-safe export leakage checklist for the browser-print packet.

Why this first:

- The preview exists; the next risk is whether it prints reliably across every map environment.
- Player-safe leakage would seriously damage trust in paid exports.
- QA can happen before adding PDF libraries or backend export jobs.
- It keeps the work grounded in real browser print output before building heavier export infrastructure.
