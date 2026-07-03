import { lazy, Suspense, useState, type FormEvent } from 'react';
import { Archive, BookOpen, Check, Copy, Crown, Dice5, FileText, HelpCircle, Mail, Megaphone, ScrollText, Shield, ShieldCheck, UserCircle, X } from 'lucide-react';
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
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsOfService } from './components/legal/TermsOfService';
import { canAccessDungeonFeature, isFreeSamplePacket, tierRank } from './lib/entitlements';
import { useMockDailyDungeonApp, type ViewId } from './hooks/useMockDailyDungeonApp';
import { useSupabaseSession } from './hooks/useSupabaseSession';
import { useUserSubscription } from './hooks/useUserSubscription';
import type { Plan } from './types';

type NavItem = { id: ViewId | 'account'; label: string; mobileLabel: string; icon: typeof BookOpen };

const viewItems: NavItem[] = [
  { id: 'today', label: 'Today', mobileLabel: 'Today', icon: BookOpen },
  { id: 'gm', label: 'GM View', mobileLabel: 'GM', icon: ScrollText },
  { id: 'player', label: 'Player Map', mobileLabel: 'Player', icon: Shield },
  { id: 'archive', label: 'Archive', mobileLabel: 'Saved', icon: Archive },
  { id: 'encounters', label: 'Tables', mobileLabel: 'Tables', icon: Dice5 },
  { id: 'upgrade', label: 'Plans', mobileLabel: 'Plans', icon: Crown },
  { id: 'account', label: 'Account', mobileLabel: 'Account', icon: UserCircle },
];

const testerBuildAnnouncement = {
  text: 'Tester build: Dungeon Dossier is nearly ready for launch. Try the free tavern sample, test the print tools, and send feedback from Account.',
};
const supportEmail = 'dungeondossierapp@gmail.com';

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
  const authSession = useSupabaseSession();
  const subscriptionEntitlement = useUserSubscription(authSession);
  const entitlementTier = authSession.configured ? subscriptionEntitlement.effectiveTier : undefined;
  const appState = useMockDailyDungeonApp(entitlementTier);
  const [accountOpen, setAccountOpen] = useState(false);
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
            {viewItems.map((item) => {
              const viewId = item.id === 'account' ? undefined : item.id;
              return (
                <NavButton
                  key={item.id}
                  item={item}
                  locked={viewId ? isViewLocked(viewId) : false}
                  active={viewId ? view === viewId : accountOpen}
                  onClick={() => {
                    if (!viewId) {
                      setAccountOpen(true);
                      return;
                    }
                    navigateTo(viewId);
                  }}
                />
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 pb-24 lg:pb-6">
          <div className="sticky top-0 z-20 border-b border-[#334145] bg-[#1d2b2f]/95 px-4 py-3 text-[#f3ecdd] shadow-tool backdrop-blur lg:hidden">
            <AppHeader compact currentPlan={currentPlan} />
          </div>

          <div className="px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
            <div className="no-print">
              {view === 'today' && <AnnouncementBanner />}
              {view === 'today' && <AppGuidePanel />}
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
                authSession={authSession}
                onSubscriptionVerified={subscriptionEntitlement.refetch}
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
            const viewId = item.id === 'account' ? undefined : item.id;
            const active = viewId ? view === viewId : accountOpen;
            const locked = viewId ? isViewLocked(viewId) : false;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (!viewId) {
                    setAccountOpen(true);
                    return;
                  }
                  navigateTo(viewId);
                }}
                className={`flex min-h-14 min-w-0 max-w-full flex-col items-center justify-center gap-0.5 overflow-hidden rounded-md border px-0.5 text-[11px] font-semibold leading-none transition ${
                  active ? 'border-[#c18453] bg-[#a65335] text-white shadow-tool' : locked ? 'border-transparent text-[#b8afa0]/45' : 'border-transparent text-[#f3ecdd]/75 hover:bg-[#223236]'
                }`}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
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
      {accountOpen && (
        <AccountDialog
          onClose={() => setAccountOpen(false)}
          authSession={authSession}
          subscriptionLoading={subscriptionEntitlement.loading}
          subscriptionErrorMessage={subscriptionEntitlement.errorMessage}
          subscriptionStatus={subscriptionEntitlement.subscriptionStatus}
        />
      )}
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

function AccountDialog({
  onClose,
  authSession,
  subscriptionLoading,
  subscriptionErrorMessage,
  subscriptionStatus,
}: {
  onClose: () => void;
  authSession: ReturnType<typeof useSupabaseSession>;
  subscriptionLoading: boolean;
  subscriptionErrorMessage?: string;
  subscriptionStatus?: string;
}) {
  const [accountSection, setAccountSection] = useState<'account' | 'terms' | 'privacy' | 'support'>('account');
  const [emailCopied, setEmailCopied] = useState(false);

  const openAccountSection = (nextSection: 'account' | 'terms' | 'privacy' | 'support') => {
    setEmailCopied(false);
    setAccountSection(nextSection);
  };

  const accountSummary = authSession.loading
    ? 'Checking account...'
    : !authSession.configured
      ? 'Sign in is not configured yet.'
      : authSession.signedIn
        ? `Signed in as ${authSession.email ?? 'your account'}`
        : 'Sign in / Account';
  const accountContent =
    accountSection === 'account'
      ? {
          eyebrow: 'Account',
          title: authSession.signedIn ? 'Account' : 'Sign in',
          content: <AccountPanel authSession={authSession} subscriptionLoading={subscriptionLoading} subscriptionErrorMessage={subscriptionErrorMessage} subscriptionStatus={subscriptionStatus} />,
        }
      : accountSection === 'terms'
        ? {
            eyebrow: 'Legal',
            title: 'Terms of Service',
            content: <TermsOfService />,
          }
        : accountSection === 'privacy'
          ? {
              eyebrow: 'Legal',
              title: 'Privacy Policy',
              content: <PrivacyPolicy />,
            }
          : {
              eyebrow: 'Support',
              title: 'Contact Support',
              content: <ContactSupportPanel copied={emailCopied} onCopy={() => copySupportEmail(setEmailCopied)} />,
            };
  const menuItems = [
    {
      id: 'account' as const,
      label: 'Account',
      icon: UserCircle,
      summary: accountSummary,
    },
    {
      id: 'terms' as const,
      label: 'Terms of Service',
      icon: FileText,
      summary: 'Read the tester build terms.',
    },
    {
      id: 'privacy' as const,
      label: 'Privacy Policy',
      icon: ShieldCheck,
      summary: 'Review privacy and data handling.',
    },
    {
      id: 'support' as const,
      label: 'Contact Support',
      icon: Mail,
      summary: supportEmail,
    },
  ];

  return (
    <div className="account-help-modal-overlay bg-ink/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="account-help-title">
      <div className="account-help-modal-panel paper-panel field-corner rounded-md border border-[#cdbfa9] shadow-[0_24px_70px_rgba(31,26,21,0.34)]">
        <div className="shrink-0 border-b border-slatewood/15 bg-[#fff9ec]/95 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="ledger-label text-[11px] font-bold uppercase text-ember">{accountContent.eyebrow}</p>
              <h2 id="account-help-title" className="survey-title mt-1 font-serif text-2xl font-bold">
                {accountContent.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slatewood/20 bg-white text-ink/65 shadow-sm transition hover:bg-slatewood/10"
              aria-label="Close Account"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="account-help-modal-body grid gap-4 p-4 text-sm leading-6 text-ink/72 sm:p-5 lg:grid-cols-[13rem_1fr]">
          <nav className="space-y-2" aria-label="Account sections">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = accountSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openAccountSection(item.id)}
                  className={`w-full rounded-md border px-3 py-2 text-left transition ${
                    active ? 'border-ember bg-ember/10 text-ink shadow-sm' : 'border-slatewood/15 bg-white/45 text-ink/70 hover:bg-slatewood/10'
                  }`}
                >
                  <span className="flex items-center gap-2 font-bold">
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {item.label}
                  </span>
                  <span className="mt-1 block truncate text-xs font-semibold text-ink/45">{item.summary}</span>
                </button>
              );
            })}
          </nav>
          <div className="min-w-0">{accountContent.content}</div>
        </div>
      </div>
    </div>
  );
}

function getSubscriptionStatusMessage(subscriptionStatus: string | undefined) {
  switch (subscriptionStatus) {
    case 'ACTIVE':
      return {
        plan: 'Cartographer',
        statusLabel: 'Active',
        statusText: 'Cartographer access is active.',
        tone: 'success' as const,
      };
    case 'CANCELLED':
      return {
        plan: 'Surveyor',
        statusLabel: 'Cancelled',
        statusText: 'Cartographer access is not active.',
        tone: 'warning' as const,
      };
    case 'SUSPENDED':
      return {
        plan: 'Surveyor',
        statusLabel: 'Suspended',
        statusText: 'Cartographer access is not active.',
        tone: 'warning' as const,
      };
    case 'EXPIRED':
      return {
        plan: 'Surveyor',
        statusLabel: 'Expired',
        statusText: 'Cartographer access is not active.',
        tone: 'warning' as const,
      };
    case 'PAYMENT_FAILED':
      return {
        plan: 'Surveyor',
        statusLabel: 'Payment issue',
        statusText: 'Cartographer access is not active. Please check PayPal or contact support.',
        tone: 'danger' as const,
      };
    default:
      return {
        plan: 'Surveyor',
        statusLabel: undefined,
        statusText: 'Free access is active.',
        tone: 'neutral' as const,
      };
  }
}

function AccountStatusCard({
  subscriptionLoading,
  subscriptionErrorMessage,
  subscriptionStatus,
}: {
  subscriptionLoading: boolean;
  subscriptionErrorMessage?: string;
  subscriptionStatus?: string;
}) {
  const status = getSubscriptionStatusMessage(subscriptionStatus);
  const toneClass =
    status.tone === 'success'
      ? 'border-moss/20 bg-moss/[0.07] text-moss'
      : status.tone === 'danger'
        ? 'border-ember/25 bg-ember/10 text-ember'
        : status.tone === 'warning'
          ? 'border-brass/25 bg-brass/10 text-ink/75'
          : 'border-slatewood/15 bg-[#fbf4e6] text-ink/72';

  if (subscriptionLoading) {
    return (
      <div className="rounded-md border border-slatewood/15 bg-[#fbf4e6] px-3 py-2 text-sm leading-6 text-ink/70">
        <p className="font-bold text-ink">Checking account access...</p>
        <p className="mt-1 text-ink/60">Your current plan will appear here in a moment.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-md border px-3 py-2 text-sm leading-6 ${toneClass}`}>
      <p className="font-bold text-ink">Current plan: {status.plan}</p>
      {status.statusLabel && <p className="mt-1 font-semibold">Subscription status: {status.statusLabel}</p>}
      <p className="mt-1 text-ink/68">{status.statusText}</p>
      {subscriptionErrorMessage && <p className="mt-2 font-semibold text-ink/60">{subscriptionErrorMessage}</p>}
    </div>
  );
}

function AccountPanel({
  authSession,
  subscriptionLoading,
  subscriptionErrorMessage,
  subscriptionStatus,
}: {
  authSession: ReturnType<typeof useSupabaseSession>;
  subscriptionLoading: boolean;
  subscriptionErrorMessage?: string;
  subscriptionStatus?: string;
}) {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(undefined);
    setErrorMessage(undefined);
    setSubmitting(true);

    try {
      await authSession.sendSignInLink(email.trim());
      setStatusMessage('Check your email for a sign-in link.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not send sign-in link.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setStatusMessage(undefined);
    setErrorMessage(undefined);
    setSubmitting(true);

    try {
      await authSession.signOut();
      setStatusMessage('Signed out.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not sign out.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setStatusMessage(undefined);
    setErrorMessage(undefined);
    setGoogleSubmitting(true);

    try {
      await authSession.signInWithGoogle();
      setStatusMessage('Opening Google sign-in...');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not start Google sign-in.');
      setGoogleSubmitting(false);
    }
  };

  if (authSession.loading) {
    return <p className="text-sm leading-6 text-ink/70">Checking account...</p>;
  }

  if (!authSession.configured) {
    return <p className="text-sm leading-6 text-ink/70">Sign in is not configured yet.</p>;
  }

  if (authSession.signedIn) {
    return (
      <div className="space-y-4 text-sm leading-6 text-ink/75">
        <div>
          <p>Signed in as</p>
          <p className="mt-2 select-all rounded-md border border-slatewood/15 bg-[#fbf4e6] px-3 py-2 font-mono text-sm font-bold text-ink">{authSession.email ?? 'your account'}</p>
        </div>
        <AccountStatusCard subscriptionLoading={subscriptionLoading} subscriptionErrorMessage={subscriptionErrorMessage} subscriptionStatus={subscriptionStatus} />
        {statusMessage && <p className="rounded-md border border-moss/20 bg-moss/[0.07] px-3 py-2 font-bold text-moss">{statusMessage}</p>}
        {errorMessage && <p className="rounded-md border border-ember/25 bg-ember/10 px-3 py-2 font-bold text-ember">{errorMessage}</p>}
        <button
          type="button"
          onClick={handleSignOut}
          disabled={submitting}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slatewood bg-slatewood px-3 py-2 text-sm font-bold text-white shadow-tool transition hover:bg-slatewood/90 disabled:cursor-not-allowed disabled:bg-ink/20"
        >
          {submitting ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSignIn} className="space-y-4 text-sm leading-6 text-ink/75">
      <div className="rounded-md border border-slatewood/15 bg-[#fbf4e6] px-3 py-2 text-sm leading-6 text-ink/72">
        <p className="font-bold text-ink">You are not signed in.</p>
        <p className="mt-1 text-ink/65">Sign in to save dossiers and manage account access.</p>
        <p className="mt-2 font-bold text-ink">Current plan: Surveyor</p>
        <p className="mt-1 text-ink/65">Free access is active.</p>
      </div>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleSubmitting || submitting}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-ember bg-ember px-3 py-2 text-sm font-bold text-white shadow-tool transition hover:bg-ember/90 disabled:cursor-not-allowed disabled:bg-ink/20"
      >
        {googleSubmitting ? 'Opening Google sign-in...' : 'Sign in with Google'}
      </button>
      <p className="text-xs leading-5 text-ink/55">Google sign-in is securely handled through Supabase for Dungeon Dossier. Final testing phase will begin soon!</p>
      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-ink/40">
        <span className="h-px flex-1 bg-slatewood/15" aria-hidden="true" />
        <span>Email fallback</span>
        <span className="h-px flex-1 bg-slatewood/15" aria-hidden="true" />
      </div>
      <p>Enter your email and we&apos;ll send a sign-in link.</p>
      <label className="block">
        <span className="ledger-label text-xs font-bold uppercase text-ink/45">Email address</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="mt-1 min-h-11 w-full rounded-md border border-slatewood/20 bg-white px-3 py-2 text-sm font-bold text-ink outline-none transition focus:border-ember focus:ring-2 focus:ring-ember/15"
        />
      </label>
      {statusMessage && <p className="rounded-md border border-moss/20 bg-moss/[0.07] px-3 py-2 font-bold text-moss">{statusMessage}</p>}
      {errorMessage && <p className="rounded-md border border-ember/25 bg-ember/10 px-3 py-2 font-bold text-ember">{errorMessage}</p>}
      <button
        type="submit"
        disabled={submitting || googleSubmitting}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slatewood bg-slatewood px-3 py-2 text-sm font-bold text-white shadow-tool transition hover:bg-slatewood/90 disabled:cursor-not-allowed disabled:bg-ink/20"
      >
        {submitting ? 'Sending...' : 'Send sign-in link'}
      </button>
    </form>
  );
}

function copySupportEmail(setEmailCopied: (copied: boolean) => void) {
  if (!navigator.clipboard) {
    return;
  }

  void navigator.clipboard.writeText(supportEmail).then(() => {
    setEmailCopied(true);
    window.setTimeout(() => setEmailCopied(false), 1800);
  });
}

function ContactSupportPanel({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <div className="space-y-4 text-sm leading-6 text-ink/75">
      <div>
        <p>For support, email:</p>
        <p className="mt-2 select-all rounded-md border border-slatewood/15 bg-[#fbf4e6] px-3 py-2 font-mono text-sm font-bold text-ink">{supportEmail}</p>
      </div>
      <p>Copy this address into your preferred email app.</p>
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slatewood bg-slatewood px-3 py-2 text-sm font-bold text-white shadow-tool transition hover:bg-slatewood/90"
      >
        {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
        {copied ? 'Copied' : 'Copy email'}
      </button>
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
  item: NavItem;
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
