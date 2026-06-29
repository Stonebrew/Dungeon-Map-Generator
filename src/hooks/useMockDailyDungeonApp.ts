import { useMemo, useState } from 'react';
import { currentTier, mockDungeons, plans, rerollAllowancesByTier, rerollCountsByTier } from '../data/mockDungeon';
import { canAccessDungeonFeature, canAccessFeature, getArchiveSlotLimit, isFreeSamplePacket, type FeatureKey } from '../lib/entitlements';
import type { RerollCounts, TierId } from '../types';

export type ViewId = 'today' | 'run' | 'gm' | 'player' | 'archive' | 'encounters' | 'upgrade' | 'rerolls' | 'print' | 'battle-map-print' | 'locked' | 'placeholder';

type PlaceholderFeature = {
  name: string;
  text: string;
};

const newPacketRefreshStorageKey = 'daily-dungeon:new-packet-refresh';

const lockedFeatures: Partial<Record<ViewId, FeatureKey>> = {
  player: 'playerMap',
  archive: 'archive',
  rerolls: 'fullReroll',
  print: 'pdfExport',
  'battle-map-print': 'pdfExport',
};

function cloneRerollCounts() {
  return Object.fromEntries(
    Object.entries(rerollCountsByTier).map(([tier, counts]) => [tier, { ...counts }]),
  ) as Record<TierId, RerollCounts>;
}

function getLocalDateKey() {
  return new Date().toLocaleDateString('en-CA');
}

function getNewPacketRefreshUsage() {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const savedUsage = window.localStorage.getItem(newPacketRefreshStorageKey);
    if (!savedUsage) {
      return {};
    }

    const parsed = JSON.parse(savedUsage) as { date?: string; usedByTier?: Partial<Record<TierId, boolean>> };
    return parsed.date === getLocalDateKey() ? parsed.usedByTier ?? {} : {};
  } catch {
    return {};
  }
}

function saveNewPacketRefreshUsage(tier: TierId) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(
      newPacketRefreshStorageKey,
      JSON.stringify({
        date: getLocalDateKey(),
        usedByTier: {
          ...getNewPacketRefreshUsage(),
          [tier]: true,
        },
      }),
    );
  } catch {
    // Keep the prototype usable even if storage is unavailable.
  }
}

function getInitialRerollCounts() {
  const counts = cloneRerollCounts();
  const usedByTier = getNewPacketRefreshUsage();

  Object.entries(usedByTier).forEach(([tier, used]) => {
    if (used) {
      counts[tier as TierId].remainingFull = 0;
    }
  });

  return counts;
}

// Prototype-only state layer. Replace this hook with real daily dungeon,
// account, entitlement, archive, favorite, and reroll APIs when the backend exists.
export function useMockDailyDungeonApp(entitlementTier?: TierId) {
  const [view, setView] = useState<ViewId>('today');
  const [lockedFeature, setLockedFeature] = useState<FeatureKey | undefined>();
  const [placeholderFeature, setPlaceholderFeature] = useState<PlaceholderFeature | undefined>();
  const [selectedDungeonId, setSelectedDungeonId] = useState(mockDungeons[0].id);
  const [selectedTier, setSelectedTier] = useState<TierId>(currentTier);
  const [savedDungeonIds, setSavedDungeonIds] = useState<Set<string>>(() => new Set());
  const [archiveLimitMessage, setArchiveLimitMessage] = useState<string | undefined>();
  const [sessionRerollCounts, setSessionRerollCounts] = useState<Record<TierId, RerollCounts>>(() => getInitialRerollCounts());
  const activeTier = entitlementTier ?? selectedTier;

  const currentPlan = useMemo(() => plans.find((plan) => plan.id === activeTier), [activeTier]);
  const selectedDungeon = useMemo(
    () => mockDungeons.find((dungeon) => dungeon.id === selectedDungeonId) ?? mockDungeons[0],
    [selectedDungeonId],
  );
  const newPacketRefreshTarget = useMemo(() => {
    const refreshDungeons = mockDungeons.filter((dungeon) => !isFreeSamplePacket(dungeon));

    if (refreshDungeons.length < 2) {
      return undefined;
    }

    const currentIndex = refreshDungeons.findIndex((dungeon) => dungeon.id === selectedDungeonId);
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % refreshDungeons.length : 0;
    return refreshDungeons[nextIndex];
  }, [selectedDungeonId]);

  const showLockedFeature = (feature: FeatureKey) => {
    setLockedFeature(feature);
    setView('locked');
  };

  const showPlaceholderFeature = (feature: PlaceholderFeature) => {
    setPlaceholderFeature(feature);
    setView('placeholder');
  };

  const toggleFavorite = (dungeonId: string) => {
    if (!canAccessFeature(activeTier, 'favorite')) {
      showLockedFeature('favorite');
      return;
    }

    setSavedDungeonIds((current) => {
      const next = new Set(current);
      if (next.has(dungeonId)) {
        next.delete(dungeonId);
        setArchiveLimitMessage(undefined);
      } else {
        const archiveLimit = getArchiveSlotLimit(activeTier);
        if (current.size >= archiveLimit) {
          setArchiveLimitMessage(
            activeTier === 'lantern'
              ? 'Surveyor includes 1 saved dossier. Upgrade to Cartographer for more archive slots.'
              : 'Your archive is full. Delete a saved dossier to save another.',
          );
          return current;
        }
        next.add(dungeonId);
        setArchiveLimitMessage(undefined);
      }
      return next;
    });
  };

  const selectArchivedDungeon = (dungeonId: string, nextView: ViewId = 'today') => {
    setSelectedDungeonId(dungeonId);
    setView(nextView);
  };

  const useNewPacketRefresh = () => {
    if (!canAccessFeature(activeTier, 'fullReroll')) {
      showLockedFeature('fullReroll');
      return false;
    }

    if (!newPacketRefreshTarget) {
      return false;
    }

    const currentCounts = sessionRerollCounts[activeTier];
    if (currentCounts.remainingFull <= 0) {
      return false;
    }

    setSessionRerollCounts((current) => ({
      ...current,
      [activeTier]: {
        ...current[activeTier],
        remainingFull: Math.max(0, current[activeTier].remainingFull - 1),
      },
    }));
    saveNewPacketRefreshUsage(activeTier);
    setSelectedDungeonId(newPacketRefreshTarget.id);
    setView('today');
    return true;
  };

  const isViewLocked = (targetView: ViewId) => {
    const lock = lockedFeatures[targetView];
    return Boolean(lock && !canAccessDungeonFeature(activeTier, selectedDungeon, lock));
  };

  const navigateTo = (targetView: ViewId) => {
    const lock = lockedFeatures[targetView];
    if (lock && !canAccessDungeonFeature(activeTier, selectedDungeon, lock)) {
      showLockedFeature(lock);
      return;
    }
    setView(targetView);
  };

  const handleTierChange = (nextTier: TierId) => {
    setSelectedTier(nextTier);
    setArchiveLimitMessage(undefined);
    const lock = lockedFeatures[view];
    const nextActiveTier = entitlementTier ?? nextTier;

    if (lock && !canAccessDungeonFeature(nextActiveTier, selectedDungeon, lock)) {
      setLockedFeature(lock);
      setView('locked');
      return;
    }

    if (view === 'locked' && lockedFeature && canAccessDungeonFeature(nextActiveTier, selectedDungeon, lockedFeature)) {
      setView('today');
      return;
    }

    if (view === 'placeholder' && !canAccessFeature(nextActiveTier, 'pdfExport')) {
      setView('today');
    }
  };

  return {
    view,
    lockedFeature,
    placeholderFeature,
    selectedDungeonId,
    selectedDungeon,
    newPacketRefreshTarget,
    selectedTier: activeTier,
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
    showPlaceholderFeature,
    toggleFavorite,
    selectArchivedDungeon,
    useNewPacketRefresh,
  };
}
