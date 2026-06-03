import { lazy, Suspense } from 'react';
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
  { id: 'rerolls', label: 'Refresh', icon: RefreshCcw },
];

function App() {
  if (import.meta.env.DEV && window.location.pathname === '/dev/map-annotator') {
    const PremiumMapAnnotator = lazy(() => import('./components/dev/PremiumMapAnnotator').then((module) => ({ default: module.PremiumMapAnnotator })));

    return (
      <Suspense fallback={<div className="min-h-screen bg-[#17130f] p-4 text-white">Loading map annotator...</div>}>
        <PremiumMapAnnotator />
      </Suspense>
    );
  }

  return <DailyDungeonApp />;
}

function DailyDungeonApp() {
  const appState = useMockDailyDungeonApp();
  const {
    view,
    lockedFeature,
    placeholderFeature,
    selectedDungeonId,
    selectedDungeon,
    newPacketRefreshTarget,
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
  } = appState;

  return (
    <div className="min-h-screen text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col lg:flex-row">
        <aside className="app-chrome hidden border-r border-[#334145] p-4 shadow-[12px_0_34px_rgba(17,27,30,0.28)] lg:block lg:w-64">
          <AppHeader currentPlan={currentPlan} />
          <nav className="mt-6 space-y-1">
            {viewItems.map((item) => (
              <NavButton key={item.id} item={item} locked={isViewLocked(item.id)} active={view === item.id} onClick={() => navigateTo(item.id)} />
            ))}
          </nav>
        </aside>

        <main className="flex-1 pb-24 lg:pb-6">
          <div className="sticky top-0 z-20 border-b border-[#334145] bg-[#1d2b2f]/95 px-4 py-3 text-[#f3ecdd] shadow-tool backdrop-blur lg:hidden">
            <AppHeader compact currentPlan={currentPlan} />
          </div>

          <div className="px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
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
                newPacketRefreshTarget={newPacketRefreshTarget}
                onUseNewPacketRefresh={appState.useNewPacketRefresh}
                onLockedFeature={showLockedFeature}
              />
            )}
            {view === 'print' && <PrintPacketView dungeon={selectedDungeon} tier={selectedTier} onBack={() => setView('gm')} />}
            {view === 'locked' && lockedFeature && <LockedFeature feature={lockedFeature} onUpgrade={() => setView('upgrade')} />}
            {view === 'placeholder' && placeholderFeature && <PlaceholderFeature feature={placeholderFeature} />}
          </div>
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-7 border-t border-[#334145] bg-[#172326]/95 px-1 py-2 shadow-[0_-12px_35px_rgba(17,27,30,0.32)] backdrop-blur lg:hidden">
          {viewItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateTo(item.id)}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-md border px-1 text-[11px] font-semibold transition ${
                  view === item.id ? 'border-[#c18453] bg-[#a65335] text-white shadow-tool' : isViewLocked(item.id) ? 'border-transparent text-[#b8afa0]/45' : 'border-transparent text-[#f3ecdd]/75 hover:bg-[#223236]'
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
      <Badge tone="warning">Coming soon</Badge>
      <h2 className="survey-title mt-3 font-serif text-3xl font-bold">{feature.name}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70">{feature.text}</p>
    </Panel>
  );
}

function AppHeader({ compact = false, currentPlan }: { compact?: boolean; currentPlan?: Plan }) {
  return (
    <header className={compact ? 'flex items-center justify-between gap-3' : ''}>
      <div className="flex min-w-0 items-center gap-3">
        <span className={`brand-mark ${compact ? 'h-10 w-10 text-[11px]' : 'h-14 w-14 text-xs'} flex shrink-0 items-center justify-center rounded-md border border-[#f3ecdd]/20 font-label font-black tracking-[0.16em] text-[#f3ecdd]`}>
          DD
        </span>
        <div className="min-w-0">
          <p className="ledger-label text-xs font-bold uppercase text-current opacity-70">Daily Dungeon</p>
          <h1 className={`survey-title ${compact ? 'text-lg' : 'mt-1 text-2xl'} font-serif font-bold leading-tight`}>Field Notes & Maps</h1>
        </div>
      </div>
      <span className="catalog-tag rounded-md border border-[#c18453]/35 bg-[#c18453]/10 px-2.5 py-1 text-xs font-bold text-current shadow-sm">
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
      className={`flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left text-sm font-bold transition ${
        active
          ? 'border-[#c18453] bg-[#a65335] text-white shadow-tool'
          : locked
            ? 'border-transparent text-[#b8afa0]/45 hover:bg-[#223236]'
            : 'border-transparent text-[#f3ecdd]/78 hover:border-[#334145] hover:bg-[#223236]'
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {item.label}
    </button>
  );
}

export default App;
