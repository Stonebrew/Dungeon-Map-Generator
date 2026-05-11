import { Lock } from 'lucide-react';
import type { RerollAllowance, RerollCounts, TierId } from '../types';
import { Badge, Panel, SectionHeader } from './Badge';
import type { LockedFeatureInfo } from './LockedFeature';

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
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45">{label}</p>
          <p className="mt-1 text-sm leading-6 text-ink/65">{note}</p>
        </div>
        <Badge tone={dailyLimit > 0 ? 'success' : 'neutral'}>{dailyLimit > 0 ? 'Available' : 'Locked'}</Badge>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-parchment p-3">
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Daily limit</dt>
          <dd className="mt-1 font-serif text-3xl font-bold">{dailyLimit}</dd>
        </div>
        <div className="rounded-md bg-parchment p-3">
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Remaining</dt>
          <dd className="mt-1 font-serif text-3xl font-bold">{remaining}</dd>
        </div>
        <div className="rounded-md bg-parchment p-3">
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Stored</dt>
          <dd className="mt-1 font-serif text-3xl font-bold">{stored}</dd>
        </div>
        <div className="rounded-md bg-parchment p-3">
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Stored cap</dt>
          <dd className="mt-1 font-serif text-3xl font-bold">{storedCap}</dd>
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
}: {
  title: string;
  text: string;
  buttonLabel: string;
  poolLabel: string;
  locked: boolean;
}) {
  return (
    <article className={`rounded-md border p-4 shadow-tool ${locked ? 'border-ink/10 bg-ink/5 text-ink/45' : 'border-ember bg-white'}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-xl font-bold">{title}</h3>
        {locked && <Lock className="h-5 w-5" aria-hidden="true" />}
      </div>
      <p className="mt-2 text-sm leading-6">{text}</p>
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-ink/45">{poolLabel}</p>
      <button type="button" disabled={locked} className="mt-4 w-full rounded-md bg-ember px-3 py-2 text-sm font-bold text-white disabled:bg-ink/10 disabled:text-ink/40">
        {buttonLabel}
      </button>
    </article>
  );
}

function PremiumControl({
  label,
  required,
  reason,
  options,
  isUnlocked,
  onLockedFeature,
}: {
  label: string;
  required: TierId;
  reason: string;
  options: string[];
  isUnlocked: (tier: TierId) => boolean;
  onLockedFeature: (feature: LockedFeatureInfo) => void;
}) {
  const unlocked = isUnlocked(required);
  const controlClasses = `block rounded-md border p-3 text-left ${unlocked ? 'border-ink/10 bg-white' : 'border-ink/10 bg-ink/5 text-ink/45 hover:bg-ink/10'}`;

  if (!unlocked) {
    return (
      <button
        type="button"
        className={controlClasses}
        onClick={() =>
          onLockedFeature({
            name: label,
            requiredTier: required,
            reason,
          })
        }
      >
        <span className="flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-[0.14em]">
          {label}
          <Lock className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="mt-2 block rounded-md border border-ink/10 px-3 py-2 text-sm font-semibold">{options[0]}</span>
      </button>
    );
  }

  return (
    <label className={controlClasses}>
      <span className="flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-[0.14em]">
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
  rerolls,
  allowance,
  isUnlocked,
  onLockedFeature,
}: {
  rerolls: RerollCounts;
  allowance: RerollAllowance;
  isUnlocked: (tier: TierId) => boolean;
  onLockedFeature: (feature: LockedFeatureInfo) => void;
}) {
  const controls = [
    { label: 'Theme Selector', required: 'dungeonwright' as TierId, reason: 'Choose a dungeon mood before generating or refreshing content.', options: ['Flooded shrine', 'Lost mine', 'Forest barrow'] },
    { label: 'Difficulty Selector', required: 'dungeonwright' as TierId, reason: 'Tune the danger level to match the table’s appetite tonight.', options: ['Low', 'Moderate', 'High', 'Severe'] },
    { label: 'Day / Night Variant', required: 'dungeonwright' as TierId, reason: 'Shift the dungeon atmosphere and encounter behavior without changing the whole premise.', options: ['Day', 'Night', 'Twilight'] },
    { label: 'Fog-of-war Map View', required: 'dungeonwright' as TierId, reason: 'Reveal only explored areas while keeping the rest of the dungeon obscured during play.', options: ['Explored only', 'Room reveal', 'GM reveal'] },
    { label: 'Dungeon Size', required: 'dungeonwright' as TierId, reason: 'Scale the dungeon up or down for the session length you actually have.', options: ['Small', 'Standard', 'Large'] },
    { label: 'Inhabitant Type', required: 'dungeonwright' as TierId, reason: 'Steer the main opposition toward bandits, undead, constructs, spirits, or other fantasy groups.', options: ['Bandits', 'Undead', 'Constructs'] },
    { label: 'Puzzle Frequency', required: 'dungeonwright' as TierId, reason: 'Adjust how often rooms ask players to solve, infer, or experiment.', options: ['Low', 'Standard', 'High'] },
    { label: 'Hazard Frequency', required: 'dungeonwright' as TierId, reason: 'Adjust how often the dungeon itself creates pressure.', options: ['Low', 'Standard', 'High'] },
    { label: 'Treasure Frequency', required: 'dungeonwright' as TierId, reason: 'Adjust how reward-dense the dungeon feels.', options: ['Low', 'Standard', 'High'] },
    { label: 'Secret Frequency', required: 'dungeonwright' as TierId, reason: 'Adjust how many hidden rooms, routes, and clues appear.', options: ['Low', 'Standard', 'High'] },
    { label: 'Export Bundle', required: 'dungeonwright' as TierId, reason: 'Prepare grouped GM notes, player maps, and table handouts as a future export bundle.', options: ['GM + player pack', 'Table packet', 'Campaign note pack'] },
  ];

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

      <div className="grid gap-4 xl:grid-cols-3">
        <RerollTypeCard
          title="Full Dungeon Reroll"
          text="Creates a new dungeon."
          buttonLabel="Mock Full Dungeon Reroll"
          poolLabel="Uses full reroll pool"
          locked={!isUnlocked('adventurer')}
        />
        <RerollTypeCard
          title="Variant Reroll"
          text="Keeps the map but changes theme, inhabitants, story, or encounters."
          buttonLabel="Mock Variant Reroll"
          poolLabel="Uses full reroll pool"
          locked={!isUnlocked('adventurer')}
        />
        <RerollTypeCard
          title="Partial Refresh"
          text="Changes one room, table, hook, treasure result, or dungeon section."
          buttonLabel="Mock Partial Refresh"
          poolLabel="Uses partial refresh pool"
          locked={!isUnlocked('adventurer')}
        />
      </div>

      <Panel>
        <h3 className="font-serif text-2xl font-bold">Mock Generation Controls</h3>
        <p className="mt-2 text-sm leading-6 text-ink/65">Unused rerolls and refreshes carry over up to double the daily limit in the tier model.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {controls.map((control) => (
            <PremiumControl key={control.label} {...control} isUnlocked={isUnlocked} onLockedFeature={onLockedFeature} />
          ))}
        </div>
      </Panel>
    </div>
  );
}
