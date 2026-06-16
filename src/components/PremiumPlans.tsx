import { BookOpen, Lock, Sparkles } from 'lucide-react';
import type { Plan, TierId } from '../types';
import { Badge, SectionHeader } from './Badge';

export function PremiumPlans({
  plans,
  currentTier,
  tierRank,
  freeSampleTitle,
  onOpenFreeSample,
}: {
  plans: Plan[];
  currentTier: TierId;
  tierRank: Record<TierId, number>;
  freeSampleTitle?: string;
  onOpenFreeSample?: () => void;
}) {
  const visiblePlans = plans.filter((plan) => plan.id !== 'dungeonwright');

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Pricing"
        title="Pricing Preview"
        text="Compare the access levels available in this tester build. Use the preview tier selector to try each toolset."
      />
      <div className="paper-panel field-corner rounded-md border border-brass/25 p-3 text-sm leading-6 text-ink/72 shadow-tool">
        <p className="font-bold text-ink">Payment not active in tester build.</p>
        <p className="mt-1 text-ink/65">Pricing preview shown in USD. Future checkout may support local-currency payment where available.</p>
      </div>
      <div className="rounded-md border border-moss/20 bg-moss/[0.07] p-3 text-sm leading-6 text-ink/72 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="success">Free Sample Packet</Badge>
              {freeSampleTitle && <span className="ledger-label text-[11px] font-bold uppercase text-moss">{freeSampleTitle}</span>}
            </div>
            <p className="mt-2 font-bold text-ink">Try the free tavern sample before upgrading.</p>
            <p className="mt-1 text-ink/65">Surveyor includes one complete sample dossier with player-safe maps, print/export tools, and Battle Map Print.</p>
          </div>
          {onOpenFreeSample && (
            <button
              type="button"
              onClick={onOpenFreeSample}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-moss bg-moss px-3 py-2 text-sm font-bold text-white shadow-tool transition hover:bg-moss/90"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Open free sample
            </button>
          )}
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {visiblePlans.map((plan) => {
          const active = plan.id === currentTier;
          const unlocked = tierRank[plan.id] <= tierRank[currentTier];

          return (
            <article key={plan.id} className={`paper-panel field-corner rounded-md border p-4 shadow-tool ${active ? 'border-ember ring-1 ring-ember/20' : 'border-slatewood/20'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="ledger-label text-xs font-bold uppercase text-ember">{plan.priceLabel}</p>
                  <h3 className="survey-title font-serif text-2xl font-bold">{plan.name}</h3>
                </div>
                {active && <Badge tone="danger">Current</Badge>}
              </div>
              <p className="mt-2 min-h-12 text-sm leading-6 text-ink/65">{plan.tagline}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-black">
                <span className="catalog-tag px-2 py-1.5">{plan.rerolls}</span>
                <span className="catalog-tag px-2 py-1.5">{plan.refreshes}</span>
              </div>
              <div className="mt-4 space-y-4 text-sm text-ink/75">
                {plan.featureGroups.map((group) => (
                  <section key={group.title}>
                    <h4 className="ledger-label text-xs font-bold uppercase text-ink/45">{group.title}</h4>
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
              <button type="button" className="mt-5 w-full rounded-md border border-ink bg-ink px-3 py-2 text-sm font-bold text-white shadow-tool transition hover:bg-slatewood">
                {active ? 'Current Preview' : 'Preview In Selector'}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
