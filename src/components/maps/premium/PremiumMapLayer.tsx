import type { DungeonMapData } from '../../../types';
import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { DEFAULT_PREMIUM_MAP_BOUNDS, getPremiumAnchorPoint } from './premiumMapGeometry';
import { getPremiumMapAsset, getPremiumOverlay } from './premiumMapAssets';

export function PremiumMapLayer({
  mapData,
  isPlayer,
  fallback,
  showLabels = true,
}: {
  mapData: DungeonMapData | undefined;
  isPlayer: boolean;
  fallback: ReactElement;
  showLabels?: boolean;
}) {
  const asset = getPremiumMapAsset(mapData, isPlayer);
  const overlay = getPremiumOverlay(mapData, isPlayer);
  const bounds = mapData?.premiumMap?.mapBounds ?? DEFAULT_PREMIUM_MAP_BOUNDS;
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [asset?.url]);

  if (!asset || imageFailed) {
    return fallback;
  }

  if (showLabels && !overlay?.labelAnchors?.length) {
    return fallback;
  }

  const routeOverlayPaths = overlay?.routeOverlayPaths ?? [];
  const markerAnchors = (overlay?.markerAnchors ?? []).flatMap((anchor) => {
    const point = getPremiumAnchorPoint(anchor, bounds);
    return point ? [{ ...anchor, point }] : [];
  });
  const labelAnchors = (overlay?.labelAnchors ?? []).flatMap((anchor) => {
    const point = getPremiumAnchorPoint(anchor, bounds);
    return point ? [{ ...anchor, point }] : [];
  });

  return (
    <g data-renderer="premium-illustrated-map">
      <image
        href={asset.url}
        x={bounds.x}
        y={bounds.y}
        width={bounds.width}
        height={bounds.height}
        preserveAspectRatio="xMidYMid slice"
        onError={() => setImageFailed(true)}
      />

      {routeOverlayPaths
        .filter((route) => !isPlayer && route.type === 'secret' && route.path)
        .map((route) => (
          <path
            key={`${route.from}-${route.to}-${route.type ?? 'normal'}`}
            d={route.path as string}
            fill="none"
            stroke="#8f3f26"
            strokeDasharray="8 8"
            strokeLinecap="round"
            strokeWidth="4"
            opacity="0.82"
          />
        ))}

      {!isPlayer &&
        markerAnchors.map((anchor) => (
          <g key={`${anchor.roomNumber}-${anchor.marker}-${anchor.point.x}-${anchor.point.y}`}>
            <circle cx={anchor.point.x} cy={anchor.point.y} r="12" fill="#fff8e8" stroke="#7a4d2c" strokeWidth="2" />
            <text x={anchor.point.x} y={anchor.point.y + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill="#7a4d2c">
              {anchor.marker.slice(0, 1).toUpperCase()}
            </text>
          </g>
        ))}

      {showLabels &&
        labelAnchors.map((anchor) => (
          <g key={`${anchor.roomNumber}-${anchor.point.x}-${anchor.point.y}`}>
            <rect x={anchor.point.x - 14} y={anchor.point.y - 14} width="28" height="28" rx="8" fill="#fff8e8" opacity="0.94" />
            <text x={anchor.point.x} y={anchor.point.y + 6} textAnchor="middle" fontSize="20" fontWeight="900" fill="#211a16">
              {anchor.label ?? anchor.roomNumber}
            </text>
          </g>
        ))}
    </g>
  );
}
