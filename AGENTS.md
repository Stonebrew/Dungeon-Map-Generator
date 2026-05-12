# Daily Dungeon Codex Instructions

- Build UI first using mock data.
- Keep mock data separate from components.
- Use `src/lib/entitlements.ts` for feature gating and locked-feature messaging.
- Keep temporary prototype controls isolated in `src/components/DevPanel.tsx`.
- Use React, TypeScript, and Tailwind CSS.
- Design mobile-first, then scale up to tablet and desktop.
- Do not add backend generation, authentication, database storage, payment processing, real PDF export, or external API calls unless explicitly requested.
- Keep dungeon content system-agnostic. Do not add AC, HP, attack bonuses, spell slots, or exact damage dice.
- Run available build and lint checks after changes.
