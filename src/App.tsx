import { Archive, BookOpen, Crown, Dice5, RefreshCcw, ScrollText, Shield } from 'lucide-react';
import { ArchiveView } from './components/ArchiveView';
import { Badge, Panel } from './components/Badge';
import { DevPanel } from './components/DevPanel';
import { DungeonSummary } from './components/DungeonSummary';
import { EncounterTablesSection } from './components/EncounterTable';
import { GMView } from './components/GMView';
import { LockedFeature } from './components/LockedFeature';
import { PlayerMapView } from './components/PlayerMapView';
import { PremiumPlans } from './components/PremiumPlans';
import { PrintPacketView } from './components/PrintPacketView';
import { RerollPanel } from './components/RerollPanel';
import { RunMode } from './components/RunMode';
import { canAccessFeature, tierRank } from './lib/entitlements';
import { useMockDailyDungeonApp, type ViewId } from './hooks/useMockDailyDungeonApp';
import type { Plan } from './types';


const viewItems: { id: ViewId; label: string; icon: typeof BookOpen }[] = [
  { id: 'today', label: 'Today', icon: BookOpen },
  { id: 'gm', label: 'GM View', icon: ScrollText },
  { id: 'player', label: 'Player Map', icon: Shield },
  { id: 'archive', label: 'Archive', icon: Archive },
  { id: 'encounters', label: 'Tables', icon: Dice5 },
  { id: 'upgrade', label: 'Plans', icon: Crown },
  { id: 'rerolls', label: 'Rerolls', icon: RefreshCcw },
];

function App() {
  const appState = useMockDailyDungeonApp();
  const {
    view,
    lockedFeature,
    placeholderFeature,
    selectedDungeonId,
    selectedDungeon,
    selectedTier,
    currentPlan,
    savedDungeonIds,
    sessionRerollCounts,
    plans,
    mockDungeons,
    rerollAllowancesByTier,
    setSelectedDungeonId,
    setView,
    handleTierChange,
    navigateTo,
    isViewLocked,
    showLockedFeature,
    toggleFavorite,
    selectArchivedDungeon,
    consumeRerollResource,
  } = appState;

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
            <div className="no-print">
              <DevPanel
                dungeons={mockDungeons}
                selectedDungeonId={selectedDungeonId}
                onDungeonChange={setSelectedDungeonId}
                plans={plans}
                selectedTier={selectedTier}
                onTierChange={handleTierChange}
              />
            </div>

            {view === 'today' && (
              <DungeonSummary
                dungeon={selectedDungeon}
                tier={selectedTier}
                isSaved={savedDungeonIds.has(selectedDungeon.id)}
                onNavigate={navigateTo}
                onToggleFavorite={() => toggleFavorite(selectedDungeon.id)}
                onLockedFeature={showLockedFeature}
              />
            )}
            {view === 'run' && (
              <RunMode
                dungeon={selectedDungeon}
                tier={selectedTier}
                isSaved={savedDungeonIds.has(selectedDungeon.id)}
                onToggleFavorite={() => toggleFavorite(selectedDungeon.id)}
                onLockedFeature={showLockedFeature}
                onExit={() => setView('today')}
              />
            )}
            {view === 'gm' && (
              <GMView
                dungeon={selectedDungeon}
                tier={selectedTier}
                partialRefreshRemaining={sessionRerollCounts[selectedTier].remainingPartial}
                onUsePartialRefresh={() => consumeRerollResource('partial')}
                onOpenPrint={() => navigateTo('print')}
                onLockedFeature={showLockedFeature}
              />
            )}
            {view === 'player' && <PlayerMapView dungeon={selectedDungeon} premiumUnlocked={canAccessFeature(selectedTier, 'playerMap')} />}
            {view === 'archive' && (
              <ArchiveView
                dungeons={mockDungeons}
                savedDungeonIds={savedDungeonIds}
                currentDungeonId={selectedDungeon.id}
                onSelectDungeon={(dungeonId) => selectArchivedDungeon(dungeonId)}
                onRunDungeon={(dungeonId) => selectArchivedDungeon(dungeonId, 'run')}
              />
            )}
            {view === 'encounters' && <EncounterTablesSection tables={selectedDungeon.encounterTables} />}
            {view === 'upgrade' && <PremiumPlans plans={plans} currentTier={selectedTier} tierRank={tierRank} />}
            {view === 'rerolls' && (
              <RerollPanel
                tier={selectedTier}
                rerolls={sessionRerollCounts[selectedTier]}
                allowance={rerollAllowancesByTier[selectedTier]}
                onUseFullReroll={() => consumeRerollResource('full')}
                onUsePartialRefresh={() => consumeRerollResource('partial')}
                onLockedFeature={showLockedFeature}
              />
            )}
            {view === 'print' && <PrintPacketView dungeon={selectedDungeon} tier={selectedTier} onBack={() => setView('gm')} />}
            {view === 'locked' && lockedFeature && <LockedFeature feature={lockedFeature} onUpgrade={() => setView('upgrade')} />}
            {view === 'placeholder' && placeholderFeature && <PlaceholderFeature feature={placeholderFeature} />}
          </div>
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-7 border-t border-ink/10 bg-white/95 px-1 py-2 shadow-tool backdrop-blur lg:hidden">
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
