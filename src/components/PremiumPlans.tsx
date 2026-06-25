import { BookOpen, Lock, Sparkles } from 'lucide-react';
import { useSupabaseSession } from '../hooks/useSupabaseSession';
import { paypalConfig } from '../lib/paypalConfig';
import type { Plan, TierId } from '../types';
import { Badge, SectionHeader } from './Badge';
import { PayPalSubscriptionButton } from './PayPalSubscriptionButton';

const previewCards = [
  {
    label: 'Surveyor schematic',
    text: 'Static sample of the readable free-tier schematic style.',
    image: '/previews/surveyor-schematic-preview.png',
  },
  {
    label: 'Cartographer illustrated map',
    text: 'Static cropped sample of the illustrated map style included with Cartographer.',
    image: '/previews/cartographer-illustrated-preview.png',
  },
];

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
  const session = useSupabaseSession();
  const paypalReady = paypalConfig.configured;

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Pricing"
        title="Pricing Preview"
        text="Compare the access levels available in this tester build. Use the preview tier selector to try each toolset."
      />
      {!paypalReady && (
        <div className="paper-panel field-corner rounded-md border border-brass/25 p-3 text-sm leading-6 text-ink/72 shadow-tool">
          <p className="font-bold text-ink">Payment not active in tester build.</p>
          <p className="mt-1 text-ink/65">Pricing preview shown in USD. Future checkout may support local-currency payment where available.</p>
        </div>
      )}
      <section className="paper-panel field-corner rounded-md border border-slatewood/20 p-4 shadow-tool">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="ledger-label text-[11px] font-bold uppercase text-ember">Preview Comparison</p>
            <h3 className="survey-title mt-1 font-serif text-2xl font-bold">Map style comparison</h3>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-ink/65">
            These static preview crops show the difference between the free Surveyor schematic style and the illustrated Cartographer map style. Open the free sample packet to try the actual packet tools.
          </p>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {previewCards.map((preview) => (
            <figure key={preview.label} className="cursor-default overflow-hidden rounded-md border border-slatewood/20 bg-[#fbfaf5] shadow-sm">
              <div className="aspect-[16/9] overflow-hidden bg-parchment">
                <img src={preview.image} alt="" className="h-full w-full object-cover" loading="lazy" aria-hidden="true" />
              </div>
              <figcaption className="p-3">
                <span className="status-tag rounded-[3px] border-l-2 border-l-slatewood/30 bg-slatewood/[0.045] px-2 py-0.5 text-[11px] font-black uppercase text-ink/55">
                  {preview.label}
                </span>
                <p className="mt-2 text-sm leading-6 text-ink/68">{preview.text}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-3 text-xs font-semibold leading-5 text-ink/50">Images are static comparison crops and do not open larger previews.</p>
      </section>
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
              {plan.id === 'adventurer' && paypalReady && (
                <div className="mt-5 rounded-md border border-brass/25 bg-brass/[0.07] p-3 text-sm leading-6 text-ink/72">
                  <p className="font-bold text-ink">PayPal subscription test flow</p>
                  <p className="mt-1 text-ink/65">
                    This creates a PayPal subscription only. Cartographer unlock and entitlement syncing will be connected in the next milestone.
                  </p>
                  {session.loading ? (
                    <p className="mt-3 rounded-md border border-slatewood/15 bg-white/35 p-2 text-xs font-semibold text-ink/60">Checking sign-in status...</p>
                  ) : session.signedIn ? (
                    <div className="mt-3">
                      <PayPalSubscriptionButton />
                    </div>
                  ) : (
                    <p className="mt-3 rounded-md border border-slatewood/15 bg-white/35 p-2 text-xs font-semibold leading-5 text-ink/65">
                      Sign in before subscribing. Use Account &amp; Help to sign in, then return to Plans to test Cartographer checkout.
                    </p>
                  )}
                </div>
              )}
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
