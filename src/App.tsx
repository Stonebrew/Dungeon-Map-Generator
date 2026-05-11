import { BookOpen, Crown, Dice5, RefreshCcw, ScrollText, Shield } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge, Panel } from './components/Badge';
import { DungeonSummary } from './components/DungeonSummary';
import { EncounterTablesSection } from './components/EncounterTable';
import { GMView } from './components/GMView';
import { LockedFeature, type LockedFeatureInfo } from './components/LockedFeature';
import { PlayerMapView } from './components/PlayerMapView';
import { PremiumPlans } from './components/PremiumPlans';
import { RerollPanel } from './components/RerollPanel';
import { currentTier, mockDungeons, plans, rerollAllowancesByTier, rerollCountsByTier, tierRank } from './data/mockDungeon';
import type { Plan, TierId } from './types';

type ViewId = 'today' | 'gm' | 'player' | 'encounters' | 'upgrade' | 'rerolls' | 'locked' | 'placeholder';

const viewItems: { id: ViewId; label: string; icon: typeof BookOpen }[] = [
  { id: 'today', label: 'Today', icon: BookOpen },
  { id: 'gm', label: 'GM View', icon: ScrollText },
  { id: 'player', label: 'Player Map', icon: Shield },
  { id: 'encounters', label: 'Tables', icon: Dice5 },
  { id: 'upgrade', label: 'Plans', icon: Crown },
  { id: 'rerolls', label: 'Rerolls', icon: RefreshCcw },
];

const lockedFeatures: Partial<Record<ViewId, LockedFeatureInfo>> = {
  player: {
    name: 'Player-Safe Map',
    requiredTier: 'adventurer',
    reason: 'Share a spoiler-free map with your players while keeping traps, secrets, treasure, and GM-only labels hidden.',
  },
  rerolls: {
    name: 'Reroll / Refresh Tools',
    requiredTier: 'adventurer',
    reason: 'Adjust today’s dungeon with full rerolls, map-preserving variants, or targeted partial refreshes.',
  },
};

function App() {
  const [view, setView] = useState<ViewId>('today');
  const [lockedFeature, setLockedFeature] = useState<LockedFeatureInfo | undefined>();
  const [placeholderFeature, setPlaceholderFeature] = useState<{ name: string; text: string } | undefined>();
  const [selectedDungeonId, setSelectedDungeonId] = useState(mockDungeons[0].id);
  const [selectedTier, setSelectedTier] = useState<TierId>(currentTier);
  const currentPlan = useMemo(() => plans.find((plan) => plan.id === selectedTier), [selectedTier]);
  const selectedDungeon = useMemo(
    () => mockDungeons.find((dungeon) => dungeon.id === selectedDungeonId) ?? mockDungeons[0],
    [selectedDungeonId],
  );

  const isUnlocked = (requiredTier: TierId) => tierRank[selectedTier] >= tierRank[requiredTier];

  const showLockedFeature = (feature: LockedFeatureInfo) => {
    setLockedFeature(feature);
    setView('locked');
  };

  const showPlaceholderFeature = (feature: { name: string; text: string }) => {
    setPlaceholderFeature(feature);
    setView('placeholder');
  };

  const isViewLocked = (targetView: ViewId) => {
    const lock = lockedFeatures[targetView];
    return Boolean(lock && !isUnlocked(lock.requiredTier));
  };

  const navigateTo = (targetView: ViewId) => {
    const lock = lockedFeatures[targetView];
    if (lock && !isUnlocked(lock.requiredTier)) {
      showLockedFeature(lock);
      return;
    }
    setView(targetView);
  };

  const handleTierChange = (nextTier: TierId) => {
    setSelectedTier(nextTier);
    const lock = lockedFeatures[view];

    if (lock && tierRank[nextTier] < tierRank[lock.requiredTier]) {
      setLockedFeature(lock);
      setView('locked');
      return;
    }

    if (view === 'locked' && lockedFeature && tierRank[nextTier] >= tierRank[lockedFeature.requiredTier]) {
      setView('today');
      return;
    }

    if (view === 'placeholder' && tierRank[nextTier] < tierRank.adventurer) {
      setView('today');
    }
  };

  return (
    <div className="min-h-screen bg-parchment text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col lg:flex-row">
        <aside className="hidden border-r border-ink/10 bg-white/45 p-4 lg:block lg:w-64">
          <AppHeader currentPlan={currentPlan} />
          <nav className="mt-6 space-y-1">
            {viewItems.map((item) => (
              <NavButton key={item.id} item={item} locked={isViewLocked(item.id)} active={view === item.id} onClick={() => navigateTo(item.id)} />
            ))}
          </nav>
        </aside>

        <main className="flex-1 pb-24 lg:pb-6">
          <div className="sticky top-0 z-20 border-b border-ink/10 bg-parchment/95 px-4 py-3 backdrop-blur lg:hidden">
            <AppHeader compact currentPlan={currentPlan} />
          </div>

          <div className="px-4 py-5 sm:px-6 lg:px-8">
            <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_16rem]">
              {/* Temporary prototype selector: replace with daily generation/archive selection once backend data exists. */}
              <label className="block rounded-md border border-ink/10 bg-white/70 p-3 text-sm shadow-tool">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Mock Dungeon Selector</span>
                <select
                  value={selectedDungeonId}
                  onChange={(event) => setSelectedDungeonId(event.target.value)}
                  className="mt-2 w-full rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-bold text-ink"
                >
                  {mockDungeons.map((dungeon) => (
                    <option key={dungeon.id} value={dungeon.id}>
                      {dungeon.title}
                    </option>
                  ))}
                </select>
              </label>

              {/* Temporary prototype selector: replace with real subscription/account data once auth and billing exist. */}
              <label className="block rounded-md border border-ink/10 bg-white/70 p-3 text-sm shadow-tool">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Mock User Tier</span>
                <select
                  value={selectedTier}
                  onChange={(event) => handleTierChange(event.target.value as TierId)}
                  className="mt-2 w-full rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-bold text-ink"
                >
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {view === 'today' && (
              <DungeonSummary
                dungeon={selectedDungeon}
                premiumUnlocked={isUnlocked('adventurer')}
                onNavigate={navigateTo}
                onLockedFeature={showLockedFeature}
                onPlaceholderFeature={showPlaceholderFeature}
              />
            )}
            {view === 'gm' && <GMView dungeon={selectedDungeon} isUnlocked={isUnlocked} />}
            {view === 'player' && <PlayerMapView dungeon={selectedDungeon} premiumUnlocked={isUnlocked('adventurer')} />}
            {view === 'encounters' && <EncounterTablesSection tables={selectedDungeon.encounterTables} />}
            {view === 'upgrade' && <PremiumPlans plans={plans} currentTier={selectedTier} tierRank={tierRank} />}
            {view === 'rerolls' && <RerollPanel rerolls={rerollCountsByTier[selectedTier]} allowance={rerollAllowancesByTier[selectedTier]} isUnlocked={isUnlocked} onLockedFeature={showLockedFeature} />}
            {view === 'locked' && lockedFeature && <LockedFeature feature={lockedFeature} onUpgrade={() => setView('upgrade')} />}
            {view === 'placeholder' && placeholderFeature && <PlaceholderFeature feature={placeholderFeature} />}
          </div>
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-ink/10 bg-white/95 px-1 py-2 shadow-tool backdrop-blur lg:hidden">
          {viewItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateTo(item.id)}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-1 text-[11px] font-semibold ${
                  view === item.id ? 'bg-ember text-white' : isViewLocked(item.id) ? 'text-ink/35' : 'text-ink/65'
                }`}
                title={item.label}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function PlaceholderFeature({ feature }: { feature: { name: string; text: string } }) {
  return (
    <Panel className="border-brass/35">
      <Badge tone="warning">Prototype placeholder</Badge>
      <h2 className="mt-3 font-serif text-3xl font-bold">{feature.name}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70">{feature.text}</p>
    </Panel>
  );
}

function AppHeader({ compact = false, currentPlan }: { compact?: boolean; currentPlan?: Plan }) {
  return (
    <header className={compact ? 'flex items-center justify-between gap-3' : ''}>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-ember">Daily Dungeon</p>
        <h1 className={`${compact ? 'text-lg' : 'mt-1 text-3xl'} font-serif font-bold`}>Ready for the table</h1>
      </div>
      <span className="rounded-md border border-brass/40 bg-brass/10 px-2.5 py-1 text-xs font-bold text-brass">
        {currentPlan?.name}
      </span>
    </header>
  );
}

function NavButton({
  item,
  active,
  locked,
  onClick,
}: {
  item: { id: ViewId; label: string; icon: typeof BookOpen };
  active: boolean;
  locked: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-bold ${
        active ? 'bg-ember text-white shadow-tool' : locked ? 'text-ink/35 hover:bg-white/70' : 'text-ink/70 hover:bg-white/70'
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {item.label}
    </button>
  );
}

export default App;
