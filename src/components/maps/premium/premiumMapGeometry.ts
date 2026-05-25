import type { MapBounds, PremiumMapOverlayAnchor } from '../../../types';

export const DEFAULT_PREMIUM_MAP_BOUNDS: MapBounds = { x: 0, y: 0, width: 720, height: 480 };

export function getPremiumAnchorPoint(anchor: PremiumMapOverlayAnchor, bounds: MapBounds = DEFAULT_PREMIUM_MAP_BOUNDS) {
  if (Number.isFinite(anchor.xPercent) && Number.isFinite(anchor.yPercent)) {
    return {
      x: bounds.x + bounds.width * ((anchor.xPercent as number) / 100),
      y: bounds.y + bounds.height * ((anchor.yPercent as number) / 100),
    };
  }

  if (Number.isFinite(anchor.x) && Number.isFinite(anchor.y)) {
    return {
      x: anchor.x as number,
      y: anchor.y as number,
    };
  }

  return undefined;
}

export function getPremiumPercentPoint(x: number, y: number, bounds: MapBounds = DEFAULT_PREMIUM_MAP_BOUNDS) {
  return {
    xPercent: ((x - bounds.x) / bounds.width) * 100,
    yPercent: ((y - bounds.y) / bounds.height) * 100,
  };
}
