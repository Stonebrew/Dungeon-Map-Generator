import type { DungeonMapData } from '../../../types';
import type { ReactElement } from 'react';
import { getPremiumMapAsset, getPremiumOverlay } from './premiumMapAssets';

export function PremiumMapLayer({
  mapData,
  isPlayer,
  fallback,
}: {
  mapData: DungeonMapData | undefined;
  isPlayer: boolean;
  fallback: ReactElement;
}) {
  const asset = getPremiumMapAsset(mapData, isPlayer);
  const overlay = getPremiumOverlay(mapData, isPlayer);
  const bounds = mapData?.premiumMap?.mapBounds ?? { x: 0, y: 0, width: 720, height: 480 };

  if (!asset) {
    return fallback;
  }

  return (
    <g data-renderer="premium-illustrated-map">
      <image href={asset.url} x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height} preserveAspectRatio="xMidYMid meet" />

      {(overlay?.routeOverlayPaths ?? [])
        .filter((route) => !isPlayer && route.type === 'secret')
        .map((route) => (
          <path
            key={`${route.from}-${route.to}-${route.type ?? 'normal'}`}
            d={route.path}
            fill="none"
            stroke="#8f3f26"
            strokeDasharray="8 8"
            strokeLinecap="round"
            strokeWidth="4"
            opacity="0.82"
          />
        ))}

      {!isPlayer &&
        (overlay?.markerAnchors ?? []).map((anchor) => (
          <g key={`${anchor.roomNumber}-${anchor.marker}-${anchor.x}-${anchor.y}`}>
            <circle cx={anchor.x} cy={anchor.y} r="12" fill="#fff8e8" stroke="#7a4d2c" strokeWidth="2" />
            <text x={anchor.x} y={anchor.y + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill="#7a4d2c">
              {anchor.marker.slice(0, 1).toUpperCase()}
            </text>
          </g>
        ))}

      {(overlay?.labelAnchors ?? []).map((anchor) => (
        <g key={`${anchor.roomNumber}-${anchor.x}-${anchor.y}`}>
          <rect x={anchor.x - 14} y={anchor.y - 14} width="28" height="28" rx="8" fill="#fff8e8" opacity="0.94" />
          <text x={anchor.x} y={anchor.y + 6} textAnchor="middle" fontSize="20" fontWeight="900" fill="#211a16">
            {anchor.label ?? anchor.roomNumber}
          </text>
        </g>
      ))}
    </g>
  );
}
