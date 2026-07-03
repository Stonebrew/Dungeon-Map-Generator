import type { Dungeon } from '../types';

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isDungeonReleased(dungeon: Dungeon, todayKey = getLocalDateKey()) {
  if (dungeon.status === 'archived') {
    return false;
  }

  if (!dungeon.releaseDate) {
    return true;
  }

  if (dungeon.releaseDate > todayKey) {
    return false;
  }

  return dungeon.status === 'active' || dungeon.status === 'scheduled' || dungeon.status === undefined;
}

export function getAvailableDungeons(dungeons: Dungeon[], todayKey = getLocalDateKey()) {
  return dungeons.filter((dungeon) => isDungeonReleased(dungeon, todayKey));
}

export function getTodaysDungeon(dungeons: Dungeon[], todayKey = getLocalDateKey()) {
  const availableDungeons = getAvailableDungeons(dungeons, todayKey);
  // Free sample packets stay accessible from sample entry points, but they should not take over the public Today rotation.
  const releaseCandidates = availableDungeons.filter((dungeon) => !dungeon.featureMetadata?.freeSamplePacket);
  const todayCandidates = releaseCandidates.length > 0 ? releaseCandidates : availableDungeons;

  return todayCandidates
    .map((dungeon, index) => ({ dungeon, index }))
    .sort((left, right) => {
      const leftDate = left.dungeon.releaseDate ?? left.dungeon.dateIso;
      const rightDate = right.dungeon.releaseDate ?? right.dungeon.dateIso;

      if (leftDate === rightDate) {
        return left.index - right.index;
      }

      return rightDate.localeCompare(leftDate);
    })[0]?.dungeon;
}
