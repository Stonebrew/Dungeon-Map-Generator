import { useMemo, useState } from 'react';
import { currentTier, mockDungeons, plans, rerollAllowancesByTier, rerollCountsByTier } from '../data/mockDungeon';
import { canAccessFeature, type FeatureKey } from '../lib/entitlements';
import type { RerollCounts, TierId } from '../types';

export type ViewId = 'today' | 'run' | 'gm' | 'player' | 'archive' | 'encounters' | 'upgrade' | 'rerolls' | 'print' | 'locked' | 'placeholder';

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
export function useMockDailyDungeonApp() {
  const [view, setView] = useState<ViewId>('today');
  const [lockedFeature, setLockedFeature] = useState<FeatureKey | undefined>();
  const [placeholderFeature, setPlaceholderFeature] = useState<PlaceholderFeature | undefined>();
  const [selectedDungeonId, setSelectedDungeonId] = useState(mockDungeons[0].id);
  const [selectedTier, setSelectedTier] = useState<TierId>(currentTier);
  const [savedDungeonIds, setSavedDungeonIds] = useState<Set<string>>(() => new Set());
  const [sessionRerollCounts, setSessionRerollCounts] = useState<Record<TierId, RerollCounts>>(() => getInitialRerollCounts());

  const currentPlan = useMemo(() => plans.find((plan) => plan.id === selectedTier), [selectedTier]);
  const selectedDungeon = useMemo(
    () => mockDungeons.find((dungeon) => dungeon.id === selectedDungeonId) ?? mockDungeons[0],
    [selectedDungeonId],
  );
  const newPacketRefreshTarget = useMemo(() => {
    if (mockDungeons.length < 2) {
      return undefined;
    }

    const currentIndex = mockDungeons.findIndex((dungeon) => dungeon.id === selectedDungeonId);
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % mockDungeons.length : 1;
    return mockDungeons[nextIndex];
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
    if (!canAccessFeature(selectedTier, 'favorite')) {
      showLockedFeature('favorite');
      return;
    }

    setSavedDungeonIds((current) => {
      const next = new Set(current);
      if (next.has(dungeonId)) {
        next.delete(dungeonId);
      } else {
        next.add(dungeonId);
      }
      return next;
    });
  };

  const selectArchivedDungeon = (dungeonId: string, nextView: ViewId = 'today') => {
    setSelectedDungeonId(dungeonId);
    setView(nextView);
  };

  const useNewPacketRefresh = () => {
    if (!canAccessFeature(selectedTier, 'fullReroll')) {
      showLockedFeature('fullReroll');
      return false;
    }

    if (!newPacketRefreshTarget) {
      return false;
    }

    const currentCounts = sessionRerollCounts[selectedTier];
    if (currentCounts.remainingFull <= 0) {
      return false;
    }

    setSessionRerollCounts((current) => ({
      ...current,
      [selectedTier]: {
        ...current[selectedTier],
        remainingFull: Math.max(0, current[selectedTier].remainingFull - 1),
      },
    }));
    saveNewPacketRefreshUsage(selectedTier);
    setSelectedDungeonId(newPacketRefreshTarget.id);
    setView('today');
    return true;
  };

  const isViewLocked = (targetView: ViewId) => {
    const lock = lockedFeatures[targetView];
    return Boolean(lock && !canAccessFeature(selectedTier, lock));
  };

  const navigateTo = (targetView: ViewId) => {
    const lock = lockedFeatures[targetView];
    if (lock && !canAccessFeature(selectedTier, lock)) {
      showLockedFeature(lock);
      return;
    }
    setView(targetView);
  };

  const handleTierChange = (nextTier: TierId) => {
    setSelectedTier(nextTier);
    const lock = lockedFeatures[view];

    if (lock && !canAccessFeature(nextTier, lock)) {
      setLockedFeature(lock);
      setView('locked');
      return;
    }

    if (view === 'locked' && lockedFeature && canAccessFeature(nextTier, lockedFeature)) {
      setView('today');
      return;
    }

    if (view === 'placeholder' && !canAccessFeature(nextTier, 'pdfExport')) {
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
    showPlaceholderFeature,
    toggleFavorite,
    selectArchivedDungeon,
    useNewPacketRefresh,
  };
}
