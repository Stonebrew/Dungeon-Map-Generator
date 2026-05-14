import { useMemo, useState } from 'react';
import { currentTier, mockDungeons, plans, rerollAllowancesByTier, rerollCountsByTier } from '../data/mockDungeon';
import { canAccessFeature, type FeatureKey } from '../lib/entitlements';
import type { RerollCounts, TierId } from '../types';

export type ViewId = 'today' | 'run' | 'gm' | 'player' | 'archive' | 'encounters' | 'upgrade' | 'rerolls' | 'locked' | 'placeholder';

type PlaceholderFeature = {
  name: string;
  text: string;
};

const lockedFeatures: Partial<Record<ViewId, FeatureKey>> = {
  player: 'playerMap',
  archive: 'archive',
  rerolls: 'fullReroll',
};

function cloneRerollCounts() {
  return Object.fromEntries(
    Object.entries(rerollCountsByTier).map(([tier, counts]) => [tier, { ...counts }]),
  ) as Record<TierId, RerollCounts>;
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
  const [sessionRerollCounts, setSessionRerollCounts] = useState<Record<TierId, RerollCounts>>(() => cloneRerollCounts());

  const currentPlan = useMemo(() => plans.find((plan) => plan.id === selectedTier), [selectedTier]);
  const selectedDungeon = useMemo(
    () => mockDungeons.find((dungeon) => dungeon.id === selectedDungeonId) ?? mockDungeons[0],
    [selectedDungeonId],
  );

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

  const consumeRerollResource = (resource: 'full' | 'partial') => {
    const feature: FeatureKey = resource === 'full' ? 'fullReroll' : 'partialRefresh';

    if (!canAccessFeature(selectedTier, feature)) {
      showLockedFeature(feature);
      return false;
    }

    let used = false;
    setSessionRerollCounts((current) => {
      const currentCounts = current[selectedTier];
      const remainingKey = resource === 'full' ? 'remainingFull' : 'remainingPartial';

      if (currentCounts[remainingKey] <= 0) {
        return current;
      }

      used = true;
      return {
        ...current,
        [selectedTier]: {
          ...currentCounts,
          [remainingKey]: currentCounts[remainingKey] - 1,
        },
      };
    });

    return used;
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
    consumeRerollResource,
  };
}
