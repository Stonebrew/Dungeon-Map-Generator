import { lazy, Suspense, useState } from 'react';
import { Archive, BookOpen, ChevronDown, Crown, Dice5, FileText, HelpCircle, Mail, Megaphone, RefreshCcw, ScrollText, Shield, ShieldCheck, UserCircle, X } from 'lucide-react';
import { ArchiveView } from './components/ArchiveView';
import { BattleMapPrintView } from './components/BattleMapPrintView';
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
import { canAccessDungeonFeature, isFreeSamplePacket, tierRank } from './lib/entitlements';
import { useMockDailyDungeonApp, type ViewId } from './hooks/useMockDailyDungeonApp';
import type { Plan } from './types';

const viewItems: { id: ViewId; label: string; mobileLabel: string; icon: typeof BookOpen }[] = [
  { id: 'today', label: 'Today', mobileLabel: 'Today', icon: BookOpen },
  { id: 'gm', label: 'GM View', mobileLabel: 'GM', icon: ScrollText },
  { id: 'player', label: 'Player Map', mobileLabel: 'Player', icon: Shield },
  { id: 'archive', label: 'Archive', mobileLabel: 'Saved', icon: Archive },
  { id: 'encounters', label: 'Tables', mobileLabel: 'Tables', icon: Dice5 },
  { id: 'upgrade', label: 'Plans', mobileLabel: 'Plans', icon: Crown },
  { id: 'rerolls', label: 'Refresh', mobileLabel: 'Refresh', icon: RefreshCcw },
];

const testerBuildAnnouncement = {
  text: 'Tester build update: all five showcase maps are calibrated, and Battle Map Print is now available for Cartographer maps.',
};

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
    archiveLimitMessage,
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
  const freeSampleDungeon = mockDungeons.find((dungeon) => isFreeSamplePacket(dungeon));

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
          <div className="mt-5">
            <AccountHelpMenu />
          </div>
        </aside>

        <main className="flex-1 pb-24 lg:pb-6">
          <div className="sticky top-0 z-20 border-b border-[#334145] bg-[#1d2b2f]/95 px-4 py-3 text-[#f3ecdd] shadow-tool backdrop-blur lg:hidden">
            <AppHeader compact currentPlan={currentPlan} />
            <div className="mt-3">
              <AccountHelpMenu compact />
            </div>
          </div>

          <div className="px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
            <div className="no-print">
              {view === 'today' && <AppGuidePanel />}
              {view === 'today' && <AnnouncementBanner />}
              {view === 'today' && freeSampleDungeon && (
                <FreeSampleCallout
                  dungeonTitle={freeSampleDungeon.title}
                  active={selectedDungeonId === freeSampleDungeon.id}
                  onOpen={() => {
                    setSelectedDungeonId(freeSampleDungeon.id);
                    setView('today');
                  }}
                />
              )}
              <DevPanel
                dungeons={mockDungeons}
                selectedDungeonId={selectedDungeonId}
                onDungeonChange={setSelectedDungeonId}
                plans={plans}
                selectedTier={selectedTier}
                onTierChange={handleTierChange}
              />
              {archiveLimitMessage && (
                <div role="status" className="mb-4 rounded-md border border-brass/25 bg-brass/10 px-3 py-2 text-sm font-bold leading-6 text-ink/75">
                  {archiveLimitMessage}
                </div>
              )}
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
            {view === 'player' && <PlayerMapView dungeon={selectedDungeon} premiumUnlocked={canAccessDungeonFeature(selectedTier, selectedDungeon, 'playerMap')} />}
            {view === 'archive' && (
              <ArchiveView
                dungeons={mockDungeons}
                savedDungeonIds={savedDungeonIds}
                tier={selectedTier}
                currentDungeonId={selectedDungeon.id}
                onSelectDungeon={(dungeonId) => selectArchivedDungeon(dungeonId)}
                onRunDungeon={(dungeonId) => selectArchivedDungeon(dungeonId, 'run')}
              />
            )}
            {view === 'encounters' && <EncounterTablesSection tables={selectedDungeon.encounterTables} />}
            {view === 'upgrade' && (
              <PremiumPlans
                plans={plans}
                currentTier={selectedTier}
                tierRank={tierRank}
                freeSampleTitle={freeSampleDungeon?.title}
                onOpenFreeSample={
                  freeSampleDungeon
                    ? () => {
                        setSelectedDungeonId(freeSampleDungeon.id);
                        setView('today');
                      }
                    : undefined
                }
              />
            )}
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
            {view === 'print' && <PrintPacketView dungeon={selectedDungeon} tier={selectedTier} onBack={() => setView('gm')} onOpenBattleMap={() => navigateTo('battle-map-print')} />}
            {view === 'battle-map-print' && <BattleMapPrintView dungeon={selectedDungeon} tier={selectedTier} onBack={() => setView('print')} />}
            {view === 'locked' && lockedFeature && <LockedFeature feature={lockedFeature} onUpgrade={() => setView('upgrade')} />}
            {view === 'placeholder' && placeholderFeature && <PlaceholderFeature feature={placeholderFeature} />}
          </div>
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-30 grid min-w-0 grid-cols-7 border-t border-[#334145] bg-[#172326]/95 px-1 py-2 shadow-[0_-12px_35px_rgba(17,27,30,0.32)] backdrop-blur lg:hidden">
          {viewItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateTo(item.id)}
                className={`flex min-h-14 min-w-0 max-w-full flex-col items-center justify-center gap-0.5 overflow-hidden rounded-md border px-0.5 text-[11px] font-semibold leading-none transition ${
                  view === item.id ? 'border-[#c18453] bg-[#a65335] text-white shadow-tool' : isViewLocked(item.id) ? 'border-transparent text-[#b8afa0]/45' : 'border-transparent text-[#f3ecdd]/75 hover:bg-[#223236]'
                }`}
                aria-label={item.label}
                aria-current={view === item.id ? 'page' : undefined}
                title={item.label}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="block w-full min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap px-0.5 text-center leading-[1.05]">
                  {item.mobileLabel}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function AnnouncementBanner() {
  return (
    <section className="mb-4 rounded-md border border-slatewood/20 bg-[#fbf4e6]/88 px-3 py-2.5 text-sm leading-6 text-ink/72 shadow-sm">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[3px] bg-slatewood/[0.08] text-slatewood" aria-hidden="true">
          <Megaphone className="h-3.5 w-3.5" />
        </span>
        <p>{testerBuildAnnouncement.text}</p>
      </div>
    </section>
  );
}

function FreeSampleCallout({ dungeonTitle, active, onOpen }: { dungeonTitle: string; active: boolean; onOpen: () => void }) {
  return (
    <section className="mb-4 rounded-md border border-moss/20 bg-moss/[0.07] px-3 py-3 text-sm leading-6 text-ink/75 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="success">Free Sample Packet</Badge>
            <p className="ledger-label text-[11px] font-bold uppercase text-moss">{dungeonTitle}</p>
          </div>
          <h2 className="survey-title mt-2 font-serif text-xl font-bold text-ink">Try the free sample packet</h2>
          <p className="mt-1">
            Open a complete tavern dossier with GM notes, player-safe maps, print/export tools, and Battle Map Print. It is included with Surveyor so you can see how Dungeon Dossier works before upgrading.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-moss bg-moss px-3 py-2 text-sm font-bold text-white shadow-tool transition hover:bg-moss/90"
        >
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          {active ? 'Free sample open' : 'Open free sample'}
        </button>
      </div>
    </section>
  );
}

function AppGuidePanel() {
  const [helpOpen, setHelpOpen] = useState(false);
  const helpSteps = [
    'Choose a sample dungeon.',
    'Use Today for the overview and story hook.',
    'Use GM View or Run Mode to run the dungeon.',
    'Use Player Map to show players a safe map.',
    'Use Print Packet to export table notes and maps.',
    'Cartographer can use one New Packet Refresh per day to switch to another complete packet.',
  ];

  return (
    <section className="mb-4 rounded-md border border-slatewood/20 bg-[#fff9ec]/88 p-4 shadow-tool">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-3xl">
          <p className="ledger-label text-[11px] font-bold uppercase text-slatewood">What this app does</p>
          <p className="mt-2 text-sm font-bold leading-6 text-ink/80">Printable dungeon packets for busy Game Masters.</p>
          <p className="mt-2 text-sm leading-6 text-ink/75">
            Create and preview ready-to-run dungeon packets from illustrated fantasy maps, including GM notes, player-safe maps, and printable table handouts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-slatewood bg-slatewood px-3 py-2 text-sm font-bold text-white shadow-tool transition hover:bg-slatewood/90"
        >
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
          How to use this app
        </button>
      </div>

      {helpOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-3 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="app-help-title">
          <div className="paper-panel field-corner max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-md border border-[#cdbfa9] p-4 shadow-[0_24px_70px_rgba(31,26,21,0.34)] sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="ledger-label text-[11px] font-bold uppercase text-ember">Quick start</p>
                <h2 id="app-help-title" className="survey-title mt-1 font-serif text-3xl font-bold">
                  How to use this app
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slatewood/20 bg-white text-ink/65 shadow-sm transition hover:bg-slatewood/10"
                aria-label="Close help"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-ink/75">
              {helpSteps.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slatewood text-xs font-black text-white">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-5 rounded-md border border-slatewood/15 bg-[#fbf4e6] p-3 text-sm leading-6 text-ink/70">
              <p>
                Surveyor previews the basic packet and schematic map. Cartographer unlocks premium maps, player map options, print/export, and one daily New Packet Refresh.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
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

function AccountHelpMenu({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState<'terms' | 'privacy' | undefined>();
  const placeholderContent =
    placeholder === 'terms'
      ? {
          title: 'Terms of Service',
          text: 'Terms of Service will be added before payment features are enabled.',
        }
      : placeholder === 'privacy'
        ? {
            title: 'Privacy Policy',
            text: 'Privacy Policy will be added before accounts or payment features are enabled.',
          }
        : undefined;

  const openPlaceholder = (nextPlaceholder: 'terms' | 'privacy') => {
    setPlaceholder(nextPlaceholder);
    setOpen(false);
  };

  return (
    <div className="relative no-print">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full items-center justify-between gap-2 rounded-md border border-[#334145] bg-[#223236] px-3 py-2 text-left text-sm font-bold text-[#f3ecdd] shadow-sm transition hover:bg-[#263a3f] ${compact ? 'min-h-10' : 'min-h-11'}`}
        aria-expanded={open}
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          <HelpCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">Account & Help</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-40 mt-2 overflow-hidden rounded-md border border-[#cdbfa9] bg-[#fff9ec] text-ink shadow-[0_16px_44px_rgba(31,26,21,0.28)]">
          <div className="border-b border-slatewood/15 px-3 py-2">
            <p className="ledger-label text-[11px] font-bold uppercase text-ink/45">Account</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-bold text-ink/60">
              <UserCircle className="h-4 w-4" aria-hidden="true" />
              Sign in / Account - coming soon
            </p>
          </div>
          <button type="button" onClick={() => openPlaceholder('terms')} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-bold text-ink/75 transition hover:bg-slatewood/10">
            <FileText className="h-4 w-4" aria-hidden="true" />
            Terms of Service
          </button>
          <button type="button" onClick={() => openPlaceholder('privacy')} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-bold text-ink/75 transition hover:bg-slatewood/10">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Privacy Policy
          </button>
          <a href="mailto:dungeondossierapp@gmail.com" className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-bold text-ink/75 transition hover:bg-slatewood/10">
            <Mail className="h-4 w-4" aria-hidden="true" />
            Contact Support
          </a>
        </div>
      )}

      {placeholderContent && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-3 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="account-help-title">
          <div className="paper-panel field-corner max-h-[90vh] w-full max-w-md overflow-y-auto rounded-md border border-[#cdbfa9] p-4 shadow-[0_24px_70px_rgba(31,26,21,0.34)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="ledger-label text-[11px] font-bold uppercase text-ember">Coming soon</p>
                <h2 id="account-help-title" className="survey-title mt-1 font-serif text-2xl font-bold">
                  {placeholderContent.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPlaceholder(undefined)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slatewood/20 bg-white text-ink/65 shadow-sm transition hover:bg-slatewood/10"
                aria-label="Close Account and Help dialog"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-ink/72">{placeholderContent.text}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function AppHeader({ compact = false, currentPlan }: { compact?: boolean; currentPlan?: Plan }) {
  const sidebarTagline = 'Printable packets for busy GMs.';

  return (
    <header className={compact ? 'flex items-center justify-between gap-3' : ''}>
      <div className="flex min-w-0 items-center gap-3">
        <span className={`brand-mark ${compact ? 'h-10 w-10' : 'h-14 w-14'} flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#f3ecdd]/20`}>
          <img src="/brand/dungeon-dossier-logo.png" alt="" className="h-full w-full object-contain" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h1 className={`survey-title ${compact ? 'text-lg' : 'mt-1 text-2xl'} font-serif font-bold leading-tight`}>Dungeon Dossier</h1>
          <p className={`${compact ? 'max-w-[13rem] text-[11px]' : 'mt-1 max-w-[11.5rem] text-xs'} font-semibold leading-4 text-current opacity-70`}>
            {sidebarTagline}
          </p>
        </div>
      </div>
      <span className="status-tag rounded-md border border-[#c18453]/30 bg-[#c18453]/10 px-2.5 py-1 text-xs font-bold text-current">
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
