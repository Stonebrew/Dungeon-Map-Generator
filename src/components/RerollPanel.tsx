import { Lock, RefreshCcw } from 'lucide-react';
import type { Dungeon, RerollAllowance, RerollCounts, TierId } from '../types';
import { canAccessFeature, type FeatureKey } from '../lib/entitlements';
import { Badge, Panel, SectionHeader } from './Badge';

function ResourceCard({
  dailyLimit,
  remaining,
  note,
}: {
  dailyLimit: number;
  remaining: number;
  note: string;
}) {
  return (
    <div className="rounded-md border border-ink/10 bg-white p-4 shadow-tool">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="ledger-label text-xs font-bold uppercase text-ink/45">New Packet Refreshes</p>
          <p className="mt-1 text-sm leading-6 text-ink/65">{note}</p>
        </div>
        <Badge tone={dailyLimit > 0 ? 'success' : 'neutral'}>{dailyLimit > 0 ? 'Cartographer' : 'Locked'}</Badge>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-parchment p-3">
          <dt className="ledger-label text-xs font-bold uppercase text-ink/45">Daily limit</dt>
          <dd className="survey-title mt-1 font-serif text-3xl font-bold">{dailyLimit}</dd>
        </div>
        <div className="rounded-md bg-parchment p-3">
          <dt className="ledger-label text-xs font-bold uppercase text-ink/45">Remaining today</dt>
          <dd className="survey-title mt-1 font-serif text-3xl font-bold">{remaining}</dd>
        </div>
      </dl>
    </div>
  );
}

export function RerollPanel({
  tier,
  rerolls,
  allowance,
  newPacketRefreshTarget,
  onUseNewPacketRefresh,
  onLockedFeature,
}: {
  tier: TierId;
  rerolls: RerollCounts;
  allowance: RerollAllowance;
  newPacketRefreshTarget?: Dungeon;
  onUseNewPacketRefresh: () => boolean;
  onLockedFeature: (feature: FeatureKey) => void;
}) {
  const hasNewPacketRefresh = canAccessFeature(tier, 'fullReroll');
  const hasRemainingRefresh = rerolls.remainingFull > 0;
  const canRefresh = hasNewPacketRefresh && hasRemainingRefresh && Boolean(newPacketRefreshTarget);
  const buttonLabel = !hasNewPacketRefresh
    ? 'Cartographer Feature'
    : hasRemainingRefresh
      ? 'Switch to Alternate Packet'
      : 'Refresh Used Today';

  const handleRefresh = () => {
    if (!hasNewPacketRefresh) {
      onLockedFeature('fullReroll');
      return;
    }

    if (canRefresh) {
      onUseNewPacketRefresh();
    }
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Refresh Tools"
        title="New Packet Refresh"
        text="Cartographer can use one daily refresh to switch to another complete dungeon packet. This does not edit rooms, routes, anchors, or map metadata inside the current packet."
      />

      <ResourceCard
        dailyLimit={allowance.fullDailyLimit}
        remaining={rerolls.remainingFull}
        note="A New Packet Refresh changes the whole packet. Room-level partial refresh controls are not shown in this build."
      />

      <Panel className="border-brass/35 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge tone={hasNewPacketRefresh ? 'warning' : 'neutral'}>{hasNewPacketRefresh ? '1 daily refresh' : 'Surveyor preview'}</Badge>
            <h3 className="survey-title mt-2 font-serif text-2xl font-bold">Preview today&apos;s alternate packet</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">
              {newPacketRefreshTarget
                ? `This switches to ${newPacketRefreshTarget.title}, the next complete sample packet in today&apos;s deterministic preview sequence.`
                : 'No alternate packet is available in the current sample library.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={!canRefresh && hasNewPacketRefresh}
            className={`flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-bold shadow-tool transition ${
              canRefresh
                ? 'border-ember bg-ember text-white hover:bg-ember/90'
                : hasNewPacketRefresh
                  ? 'border-ink/10 bg-ink/10 text-ink/45'
                  : 'border-ink/10 bg-ink/5 text-ink/55 hover:bg-ink/10'
            }`}
          >
            {!hasNewPacketRefresh ? <Lock className="h-4 w-4" aria-hidden="true" /> : <RefreshCcw className="h-4 w-4" aria-hidden="true" />}
            {buttonLabel}
          </button>
        </div>
      </Panel>
    </div>
  );
}
