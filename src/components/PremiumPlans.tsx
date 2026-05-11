import { Lock, Sparkles } from 'lucide-react';
import type { Plan, TierId } from '../types';
import { Badge, SectionHeader } from './Badge';

export function PremiumPlans({ plans, currentTier, tierRank }: { plans: Plan[]; currentTier: TierId; tierRank: Record<TierId, number> }) {
  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Premium"
        title="Upgrade Plans"
        text="Mock plan selection only. Payment, accounts, and entitlement storage are intentionally out of scope for this prototype."
      />
      <div className="grid gap-4 xl:grid-cols-3">
        {plans.map((plan) => {
          const active = plan.id === currentTier;
          const unlocked = tierRank[plan.id] <= tierRank[currentTier];

          return (
            <article key={plan.id} className={`rounded-md border bg-white p-4 shadow-tool ${active ? 'border-ember' : 'border-ink/10'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-ember">{plan.priceLabel}</p>
                  <h3 className="font-serif text-2xl font-bold">{plan.name}</h3>
                </div>
                {active && <Badge tone="danger">Current</Badge>}
              </div>
              <p className="mt-2 min-h-12 text-sm leading-6 text-ink/65">{plan.tagline}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-bold">
                <span className="rounded-md bg-parchment px-2 py-2">{plan.rerolls}</span>
                <span className="rounded-md bg-parchment px-2 py-2">{plan.refreshes}</span>
              </div>
              <div className="mt-4 space-y-4 text-sm text-ink/75">
                {plan.featureGroups.map((group) => (
                  <section key={group.title}>
                    <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45">{group.title}</h4>
                    <ul className="mt-2 space-y-2">
                      {group.features.map((feature) => (
                        <li key={feature} className="flex gap-2">
                          {unlocked ? <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brass" /> : <Lock className="mt-0.5 h-4 w-4 shrink-0 text-ink/35" />}
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
              <button type="button" className="mt-5 w-full rounded-md bg-ink px-3 py-2 text-sm font-bold text-white">
                {active ? 'Selected' : 'Mock Upgrade'}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
