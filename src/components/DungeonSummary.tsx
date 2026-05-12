import { Archive, FileDown, Lock, Map, RefreshCcw, Swords } from 'lucide-react';
import type { Dungeon, TierId } from '../types';
import { DungeonMap } from './DungeonMap';
import { Badge, Panel } from './Badge';
import { canAccessFeature, type FeatureKey } from '../lib/entitlements';

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-ink/10 bg-white px-3 py-2">
      <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink/45">{label}</dt>
      <dd className="mt-0.5 text-sm font-bold leading-5">{value}</dd>
    </div>
  );
}

function ActionButton({
  label,
  icon: Icon,
  locked = false,
  primary = false,
  onClick,
}: {
  label: string;
  icon: typeof Swords;
  locked?: boolean;
  primary?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-md px-3 text-sm font-bold shadow-tool ${
        primary ? 'min-h-14 py-3.5 text-base' : 'min-h-11 py-2.5'
      } ${locked ? 'bg-ink/10 text-ink/45 hover:bg-ink/15' : primary ? 'bg-ember text-white hover:bg-ember/90' : 'bg-ink text-white hover:bg-ink/90'
      }`}
    >
      {locked ? <Lock className="h-4 w-4" aria-hidden="true" /> : <Icon className="h-4 w-4" aria-hidden="true" />}
      {label}
    </button>
  );
}

export function DungeonSummary({
  dungeon,
  tier,
  onNavigate,
  onLockedFeature,
  onPlaceholderFeature,
}: {
  dungeon: Dungeon;
  tier: TierId;
  onNavigate: (view: 'gm' | 'player' | 'upgrade' | 'rerolls') => void;
  onLockedFeature: (feature: FeatureKey) => void;
  onPlaceholderFeature: (feature: { name: string; text: string }) => void;
}) {
  const hasColorMap = canAccessFeature(tier, 'colorMap');
  const hasPlayerMap = canAccessFeature(tier, 'playerMap');
  const hasPdfExport = canAccessFeature(tier, 'pdfExport');
  const hasArchive = canAccessFeature(tier, 'archive');
  const hasRerolls = canAccessFeature(tier, 'fullReroll');

  const selectPremiumFeature = (feature: FeatureKey, unlockedView?: 'player' | 'rerolls') => {
    if (canAccessFeature(tier, feature) && unlockedView) {
      onNavigate(unlockedView);
      return;
    }
    onLockedFeature(feature);
  };

  return (
    <div className="space-y-4">
      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">Today</Badge>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-ink/45">{dungeon.date}</span>
        </div>
        <h2 className="font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{dungeon.title}</h2>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <InfoChip label="Theme" value={dungeon.theme} />
          <InfoChip label="Difficulty" value={dungeon.difficulty} />
          <InfoChip label="Party size" value={dungeon.partySize} />
          <InfoChip label="Play time" value={dungeon.estimatedPlayTime} />
        </div>
      </section>

      <div className="rounded-md border border-brass/30 bg-white px-3 py-3 shadow-tool">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brass">Story hook</p>
        <p className="mt-1 text-sm leading-6 text-ink/75">{dungeon.hook}</p>
      </div>

      <DungeonMap mode="gm" mapStyle={dungeon.mapStyle} colorEnabled={hasColorMap} compact showLegend />

      <div className="space-y-2">
        <ActionButton primary label="Run This Dungeon" icon={Swords} onClick={() => onNavigate('gm')} />
        <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
          <ActionButton
            label="Player Map"
            icon={Map}
            locked={!hasPlayerMap}
            onClick={() =>
              selectPremiumFeature(
                'playerMap',
                'player',
              )
            }
          />
          <ActionButton
            label="Export PDF"
            icon={FileDown}
            locked={!hasPdfExport}
            onClick={() =>
              hasPdfExport
                ? onPlaceholderFeature({
                    name: 'PDF Export',
                    text: 'PDF export is available to this mock tier, but real PDF generation is intentionally not implemented in this prototype.',
                  })
                : onLockedFeature('pdfExport')
            }
          />
          <ActionButton
            label="Reroll"
            icon={RefreshCcw}
            locked={!hasRerolls}
            onClick={() =>
              selectPremiumFeature(
                'fullReroll',
                'rerolls',
              )
            }
          />
          <ActionButton
            label="Archive"
            icon={Archive}
            locked={!hasArchive}
            onClick={() =>
              hasArchive
                ? onPlaceholderFeature({
                    name: 'Archive Access',
                    text: 'Archive access is available to this mock tier, but real saved dungeon storage is intentionally not implemented in this prototype.',
                  })
                : onLockedFeature('archive')
            }
          />
        </div>
      </div>

      <Panel className="border-brass/35 p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge tone="warning">Premium</Badge>
            <h2 className="mt-2 font-serif text-xl font-bold">Unlock player maps, archive access, and rerolls.</h2>
            <p className="mt-1 text-sm leading-6 text-ink/65">Adventurer adds the tools most useful during live play.</p>
          </div>
          <button type="button" onClick={() => onNavigate('upgrade')} className="rounded-md bg-brass px-3 py-2 text-sm font-bold text-white">
            View Plans
          </button>
        </div>
      </Panel>
    </div>
  );
}
