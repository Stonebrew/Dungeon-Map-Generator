import { Archive, Bookmark, FileDown, Lock, Map, Printer, RefreshCcw, Swords } from 'lucide-react';
import type { Dungeon, TierId } from '../types';
import { DungeonMap } from './DungeonMap';
import { Badge, Panel } from './Badge';
import { canAccessFeature, type FeatureKey } from '../lib/entitlements';

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#cdbfa9] bg-[#fff9ec] px-3 py-2 shadow-sm">
      <dt className="ledger-label text-[11px] font-bold uppercase text-ink/45">{label}</dt>
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
      className={`flex items-center justify-center gap-2 rounded-md border px-3 text-sm font-bold shadow-tool transition ${
        primary ? 'min-h-14 py-3.5 text-base' : 'min-h-11 py-2.5'
      } ${
        locked
          ? 'border-ink/10 bg-ink/10 text-ink/45 hover:bg-ink/15'
          : primary
            ? 'border-ember bg-ember text-white hover:bg-ember/90'
            : 'border-ink bg-ink text-white hover:bg-slatewood'
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
  isSaved,
  onNavigate,
  onToggleFavorite,
  onLockedFeature,
}: {
  dungeon: Dungeon;
  tier: TierId;
  isSaved: boolean;
  onNavigate: (view: 'run' | 'gm' | 'player' | 'archive' | 'upgrade' | 'rerolls' | 'print') => void;
  onToggleFavorite: () => void;
  onLockedFeature: (feature: FeatureKey) => void;
}) {
  const hasColorMap = canAccessFeature(tier, 'colorMap');
  const hasPlayerMap = canAccessFeature(tier, 'playerMap');
  const hasPdfExport = canAccessFeature(tier, 'pdfExport');
  const hasArchive = canAccessFeature(tier, 'archive');
  const hasFavorite = canAccessFeature(tier, 'favorite');
  const hasNewPacketRefresh = canAccessFeature(tier, 'fullReroll');

  const selectPremiumFeature = (feature: FeatureKey, unlockedView?: 'player' | 'rerolls') => {
    if (canAccessFeature(tier, feature) && unlockedView) {
      onNavigate(unlockedView);
      return;
    }
    onLockedFeature(feature);
  };

  return (
    <div className="space-y-4">
      <section className="paper-panel field-corner rounded-md border border-[#cdbfa9] p-4 shadow-tool sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">Today</Badge>
          <span className="ledger-label text-xs font-bold uppercase text-ink/45">{dungeon.date}</span>
        </div>
        <h2 className="survey-title font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{dungeon.title}</h2>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <InfoChip label="Theme" value={dungeon.theme} />
          <InfoChip label="Difficulty" value={dungeon.difficulty} />
          <InfoChip label="Party size" value={dungeon.partySize} />
          <InfoChip label="Play time" value={dungeon.estimatedPlayTime} />
        </div>
      </section>

      <div className="field-corner rounded-md border border-[#cdbfa9] bg-[#fff9ec] px-3 py-3 shadow-tool">
        <p className="ledger-label text-[11px] font-bold uppercase text-slatewood">Story hook</p>
        <p className="mt-1 text-sm leading-6 text-ink/75">{dungeon.hook}</p>
      </div>

      <DungeonMap mode="gm" mapData={dungeon.map} mapStyle={dungeon.mapStyle} colorEnabled={hasColorMap} compact showLegend />

      <div className="space-y-2">
        <ActionButton primary label="Run This Dungeon" icon={Swords} onClick={() => onNavigate('run')} />
        <p className="text-xs font-semibold leading-5 text-ink/55">Preview, print, or save this dungeon as a PDF packet.</p>
        <div className="grid grid-cols-2 gap-2 xl:grid-cols-6">
          <ActionButton
            label={isSaved ? 'Saved' : 'Save'}
            icon={Bookmark}
            locked={!hasFavorite}
            onClick={() => (hasFavorite ? onToggleFavorite() : onLockedFeature('favorite'))}
          />
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
            label="Print / Export"
            icon={Printer}
            locked={!hasPdfExport}
            onClick={() => (hasPdfExport ? onNavigate('print') : onLockedFeature('pdfExport'))}
          />
          <ActionButton
            label="Save as PDF"
            icon={FileDown}
            locked={!hasPdfExport}
            onClick={() => (hasPdfExport ? onNavigate('print') : onLockedFeature('pdfExport'))}
          />
          <ActionButton
            label="Refresh"
            icon={RefreshCcw}
            locked={!hasNewPacketRefresh}
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
            onClick={() => (hasArchive ? onNavigate('archive') : onLockedFeature('archive'))}
          />
        </div>
      </div>

      <Panel className="border-slatewood/25 p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge tone="warning">Premium</Badge>
            <h2 className="survey-title mt-2 font-serif text-xl font-bold">Unlock player maps, archive access, and packet refresh.</h2>
            <p className="mt-1 text-sm leading-6 text-ink/65">Cartographer adds the map and packet tools most useful during live play.</p>
          </div>
          <button type="button" onClick={() => onNavigate('upgrade')} className="rounded-md border border-slatewood bg-slatewood px-3 py-2 text-sm font-bold text-white shadow-tool transition hover:bg-slatewood/90">
            View Plans
          </button>
        </div>
      </Panel>
    </div>
  );
}
