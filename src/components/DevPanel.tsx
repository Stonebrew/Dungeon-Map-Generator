import { useState } from 'react';
import type { Dungeon, Plan, TierId } from '../types';

export function DevPanel({
  dungeons,
  selectedDungeonId,
  onDungeonChange,
  plans,
  selectedTier,
  onTierChange,
}: {
  dungeons: Dungeon[];
  selectedDungeonId: string;
  onDungeonChange: (dungeonId: string) => void;
  plans: Plan[];
  selectedTier: TierId;
  onTierChange: (tier: TierId) => void;
}) {
  // Prototype-only tooling. Replace with real daily generation, archive, and account subscription data later.
  const [open, setOpen] = useState(false);

  return (
    <section className="mb-4 rounded-md border border-dashed border-ink/20 bg-white/45 p-3 text-sm">
      <button type="button" onClick={() => setOpen((current) => !current)} className="flex w-full items-center justify-between gap-3 text-left">
        <span>
          <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Prototype Dev Panel</span>
          <span className="text-xs text-ink/55">Temporary mock dungeon and tier controls</span>
        </span>
        <span className="rounded-md bg-ink/10 px-2 py-1 text-xs font-bold text-ink/60">{open ? 'Hide' : 'Show'}</span>
      </button>

      {open && (
        <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_16rem]">
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Mock Dungeon Selector</span>
            <select
              value={selectedDungeonId}
              onChange={(event) => onDungeonChange(event.target.value)}
              className="mt-2 w-full rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-bold text-ink"
            >
              {dungeons.map((dungeon) => (
                <option key={dungeon.id} value={dungeon.id}>
                  {dungeon.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Mock User Tier</span>
            <select
              value={selectedTier}
              onChange={(event) => onTierChange(event.target.value as TierId)}
              className="mt-2 w-full rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-bold text-ink"
            >
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </label>

          <p className="text-xs leading-5 text-ink/55 lg:col-span-2">
            This panel is prototype-only and should be replaced by real daily generation, archive selection, and account subscription data later.
          </p>
        </div>
      )}
    </section>
  );
}
