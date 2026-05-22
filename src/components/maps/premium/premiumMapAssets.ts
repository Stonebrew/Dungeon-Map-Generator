import type { DungeonMapData, PremiumMapImageAsset, PremiumMapOverlay } from '../../../types';

export function getPremiumMapAsset(mapData: DungeonMapData | undefined, isPlayer: boolean): PremiumMapImageAsset | undefined {
  const premiumMap = mapData?.premiumMap;

  if (!premiumMap) {
    return undefined;
  }

  if (isPlayer) {
    return premiumMap.playerBaseMapImage ?? premiumMap.baseMapImage;
  }

  return premiumMap.gmBaseMapImage ?? premiumMap.baseMapImage;
}

export function getPremiumOverlay(mapData: DungeonMapData | undefined, isPlayer: boolean): PremiumMapOverlay | undefined {
  if (isPlayer) {
    return mapData?.premiumMap?.playerOverlay ?? mapData?.premiumMap?.gmOverlay;
  }

  return mapData?.premiumMap?.gmOverlay;
}

export function hasPremiumMapAsset(mapData: DungeonMapData | undefined, isPlayer: boolean) {
  return Boolean(getPremiumMapAsset(mapData, isPlayer));
}
