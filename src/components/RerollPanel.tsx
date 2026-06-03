import { Lock } from 'lucide-react';
import { useState } from 'react';
import type { RerollAllowance, RerollCounts, TierId } from '../types';
import { canAccessFeature, getFeatureDescription, getFeatureLabel, type FeatureKey } from '../lib/entitlements';
import { Badge, Panel, SectionHeader } from './Badge';

function ResourceCard({
  label,
  dailyLimit,
  remaining,
  stored,
  note,
}: {
  label: string;
  dailyLimit: number;
  remaining: number;
  stored: number;
  note: string;
}) {
  const storedCap = dailyLimit * 2;

  return (
    <div className="rounded-md border border-ink/10 bg-white p-4 shadow-tool">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="ledger-label text-xs font-bold uppercase text-ink/45">{label}</p>
          <p className="mt-1 text-sm leading-6 text-ink/65">{note}</p>
        </div>
        <Badge tone={dailyLimit > 0 ? 'success' : 'neutral'}>{dailyLimit > 0 ? 'Available' : 'Locked'}</Badge>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-parchment p-3">
          <dt className="ledger-label text-xs font-bold uppercase text-ink/45">Daily limit</dt>
          <dd className="survey-title mt-1 font-serif text-3xl font-bold">{dailyLimit}</dd>
        </div>
        <div className="rounded-md bg-parchment p-3">
          <dt className="ledger-label text-xs font-bold uppercase text-ink/45">Remaining</dt>
          <dd className="survey-title mt-1 font-serif text-3xl font-bold">{remaining}</dd>
        </div>
        <div className="rounded-md bg-parchment p-3">
          <dt className="ledger-label text-xs font-bold uppercase text-ink/45">Stored</dt>
          <dd className="survey-title mt-1 font-serif text-3xl font-bold">{stored}</dd>
        </div>
        <div className="rounded-md bg-parchment p-3">
          <dt className="ledger-label text-xs font-bold uppercase text-ink/45">Stored cap</dt>
          <dd className="survey-title mt-1 font-serif text-3xl font-bold">{storedCap}</dd>
        </div>
      </dl>
    </div>
  );
}

function RerollTypeCard({
  title,
  text,
  buttonLabel,
  poolLabel,
  locked,
  depleted,
  onUse,
}: {
  title: string;
  text: string;
  buttonLabel: string;
  poolLabel: string;
  locked: boolean;
  depleted: boolean;
  onUse: () => void;
}) {
  const disabled = locked || depleted;

  return (
    <article className={`rounded-md border p-4 shadow-tool ${disabled ? 'border-ink/10 bg-ink/5 text-ink/45' : 'border-ember bg-white'}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="survey-title font-serif text-xl font-bold">{title}</h3>
        {disabled && <Lock className="h-5 w-5" aria-hidden="true" />}
      </div>
      <p className="mt-2 text-sm leading-6">{text}</p>
      <p className="ledger-label mt-3 text-xs font-bold uppercase text-ink/45">{depleted && !locked ? 'No mock uses remaining today' : poolLabel}</p>
      <button type="button" disabled={disabled} onClick={onUse} className="mt-4 w-full rounded-md bg-ember px-3 py-2 text-sm font-bold text-white disabled:bg-ink/10 disabled:text-ink/40">
        {buttonLabel}
      </button>
    </article>
  );
}

function PremiumControl({
  feature,
  options,
  tier,
  onLockedFeature,
}: {
  feature: FeatureKey;
  options: string[];
  tier: TierId;
  onLockedFeature: (feature: FeatureKey) => void;
}) {
  const unlocked = canAccessFeature(tier, feature);
  const label = getFeatureLabel(feature);
  const controlClasses = `block rounded-md border p-3 text-left ${unlocked ? 'border-ink/10 bg-white' : 'border-ink/10 bg-ink/5 text-ink/45 hover:bg-ink/10'}`;

  if (!unlocked) {
    return (
      <button
        type="button"
        className={controlClasses}
        onClick={() => onLockedFeature(feature)}
        title={getFeatureDescription(feature)}
      >
        <span className="ledger-label flex items-center justify-between gap-2 text-xs font-bold uppercase">
          {label}
          <Lock className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="mt-2 block rounded-md border border-ink/10 px-3 py-2 text-sm font-semibold">{options[0]}</span>
      </button>
    );
  }

  return (
    <label className={controlClasses}>
      <span className="ledger-label flex items-center justify-between gap-2 text-xs font-bold uppercase">
        {label}
      </span>
      <select className="mt-2 w-full rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-semibold">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

export function RerollPanel({
  tier,
  rerolls,
  allowance,
  onUseFullReroll,
  onUsePartialRefresh,
  onLockedFeature,
}: {
  tier: TierId;
  rerolls: RerollCounts;
  allowance: RerollAllowance;
  onUseFullReroll: () => boolean;
  onUsePartialRefresh: () => boolean;
  onLockedFeature: (feature: FeatureKey) => void;
}) {
  const [feedback, setFeedback] = useState<string>();
  const controls = [
    { feature: 'themeSelector' as FeatureKey, options: ['Flooded shrine', 'Lost mine', 'Forest barrow'] },
    { feature: 'difficultySelector' as FeatureKey, options: ['Low', 'Moderate', 'High', 'Severe'] },
    { feature: 'dayNightVariant' as FeatureKey, options: ['Day', 'Night', 'Twilight'] },
    { feature: 'fogOfWar' as FeatureKey, options: ['Explored only', 'Room reveal', 'GM reveal'] },
    { feature: 'dungeonSize' as FeatureKey, options: ['Small', 'Standard', 'Large'] },
    { feature: 'inhabitantType' as FeatureKey, options: ['Bandits', 'Undead', 'Constructs'] },
    { feature: 'puzzleFrequency' as FeatureKey, options: ['Low', 'Standard', 'High'] },
    { feature: 'hazardFrequency' as FeatureKey, options: ['Low', 'Standard', 'High'] },
    { feature: 'treasureFrequency' as FeatureKey, options: ['Low', 'Standard', 'High'] },
    { feature: 'secretFrequency' as FeatureKey, options: ['Low', 'Standard', 'High'] },
    { feature: 'exportBundle' as FeatureKey, options: ['GM + player pack', 'Table packet', 'Campaign note pack'] },
  ];
  const canUseFullRerolls = canAccessFeature(tier, 'fullReroll');
  const canUsePartialRefreshes = canAccessFeature(tier, 'partialRefresh');
  const fullRerollsDepleted = canUseFullRerolls && rerolls.remainingFull <= 0;
  const partialRefreshesDepleted = canUsePartialRefreshes && rerolls.remainingPartial <= 0;

  const handleMockAction = (resource: 'full' | 'partial', message: string) => {
    const used = resource === 'full' ? onUseFullReroll() : onUsePartialRefresh();
    setFeedback(used ? message : `No mock ${resource === 'full' ? 'full rerolls' : 'partial refreshes'} remaining today.`);
  };

  return (
    <div className="space-y-5">
      <SectionHeader eyebrow="Refresh Tools" title="Reroll / Refresh Panel" text="Controls are visual only. Backend generation and reroll logic will connect here later." />
      <div className="grid gap-4 xl:grid-cols-2">
        <ResourceCard
          label="Full Dungeon Rerolls"
          dailyLimit={allowance.fullDailyLimit}
          remaining={rerolls.remainingFull}
          stored={rerolls.storedFull}
          note="Full and variant rerolls use this pool. Unused rerolls carry over up to double the daily limit."
        />
        <ResourceCard
          label="Partial Refreshes"
          dailyLimit={allowance.partialDailyLimit}
          remaining={rerolls.remainingPartial}
          stored={rerolls.storedPartial}
          note="Targeted refreshes use this separate pool. Unused refreshes carry over up to double the daily limit."
        />
      </div>

      {feedback && (
        <Panel className="border-brass/35 p-3">
          <Badge tone="warning">Prototype feedback</Badge>
          <p className="mt-2 text-sm font-semibold text-ink/70">{feedback}</p>
          <p className="mt-1 text-xs leading-5 text-ink/50">No real dungeon content was generated or changed.</p>
        </Panel>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
        <RerollTypeCard
          title="Full Dungeon Reroll"
          text="Creates a new dungeon."
          buttonLabel="Mock Full Dungeon Reroll"
          poolLabel="Uses full reroll pool"
          locked={!canUseFullRerolls}
          depleted={fullRerollsDepleted}
          onUse={() => handleMockAction('full', 'Mock full dungeon reroll used. No real dungeon content changed.')}
        />
        <RerollTypeCard
          title="Variant Reroll"
          text="Keeps the map but changes theme, inhabitants, story, or encounters."
          buttonLabel="Mock Variant Reroll"
          poolLabel="Uses full reroll pool"
          locked={!canUseFullRerolls}
          depleted={fullRerollsDepleted}
          onUse={() => handleMockAction('full', 'Mock variant reroll used. The map and dungeon content are unchanged in this prototype.')}
        />
        <RerollTypeCard
          title="Partial Refresh"
          text="Changes one room, table, hook, treasure result, or dungeon section."
          buttonLabel="Mock Partial Refresh"
          poolLabel="Uses partial refresh pool"
          locked={!canUsePartialRefreshes}
          depleted={partialRefreshesDepleted}
          onUse={() => handleMockAction('partial', 'Mock partial refresh used. No room, table, hook, treasure, or section content changed.')}
        />
      </div>

      <Panel>
        <h3 className="survey-title font-serif text-2xl font-bold">Mock Generation Controls</h3>
        <p className="mt-2 text-sm leading-6 text-ink/65">Unused rerolls and refreshes carry over up to double the daily limit in the tier model.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {controls.map((control) => (
            <PremiumControl key={control.feature} {...control} tier={tier} onLockedFeature={onLockedFeature} />
          ))}
        </div>
      </Panel>
    </div>
  );
}
