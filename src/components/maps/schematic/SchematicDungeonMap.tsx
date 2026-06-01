import { EnhancedFallbackMap, type MapPalette } from '../fallback/EnhancedFallbackMap';
import { DEFAULT_PREMIUM_MAP_BOUNDS, getPremiumAnchorPoint } from '../premium/premiumMapGeometry';
import type { DungeonMapData, MapStyle, PremiumMapMarkerAnchor, PremiumMapOverlayAnchor, PremiumMapSchematicFootprint } from '../../../types';

function anchorKey(anchor: PremiumMapOverlayAnchor) {
  return anchor.roomNumber;
}

function getSchematicPremiumAnchors(mapData: DungeonMapData | undefined) {
  const anchors = mapData?.premiumMap?.playerOverlay?.labelAnchors ?? mapData?.premiumMap?.gmOverlay?.labelAnchors ?? [];

  return anchors
    .flatMap((anchor) => {
      const point = getPremiumAnchorPoint(anchor, mapData?.premiumMap?.mapBounds ?? DEFAULT_PREMIUM_MAP_BOUNDS);
      return point ? [{ ...anchor, point }] : [];
    })
    .sort((a, b) => a.roomNumber - b.roomNumber);
}

function getSchematicPremiumMarkers(mapData: DungeonMapData | undefined) {
  const markers = mapData?.premiumMap?.gmOverlay?.markerAnchors ?? [];

  return markers.flatMap((marker) => {
    const point = getPremiumAnchorPoint(marker, mapData?.premiumMap?.mapBounds ?? DEFAULT_PREMIUM_MAP_BOUNDS);
    return point ? [{ ...marker, point }] : [];
  });
}

function getSchematicPremiumFootprints(mapData: DungeonMapData | undefined) {
  const bounds = mapData?.premiumMap?.mapBounds ?? DEFAULT_PREMIUM_MAP_BOUNDS;

  return (mapData?.premiumMap?.schematicFootprints ?? []).flatMap((footprint) => {
    const point = getPremiumAnchorPoint(footprint, bounds);

    if (!point) {
      return [];
    }

    return [
      {
        ...footprint,
        point,
        width: bounds.width * (footprint.widthPercent / 100),
        height: bounds.height * (footprint.heightPercent / 100),
      },
    ];
  });
}

function markerLabel(marker: PremiumMapMarkerAnchor['marker']) {
  return marker.slice(0, 1).toUpperCase();
}

function SchematicFootprint({
  footprint,
  palette,
}: {
  footprint: PremiumMapSchematicFootprint & { point: { x: number; y: number }; width: number; height: number };
  palette: MapPalette;
}) {
  const shape = footprint.shape ?? 'ellipse';
  const transform = `rotate(${footprint.rotation ?? 0} ${footprint.point.x} ${footprint.point.y})`;

  if (shape === 'rect') {
    return (
      <rect
        x={footprint.point.x - footprint.width / 2}
        y={footprint.point.y - footprint.height / 2}
        width={footprint.width}
        height={footprint.height}
        rx="16"
        fill={palette.roomFill}
        stroke={palette.wallStroke}
        strokeWidth="4"
        transform={transform}
        opacity="0.98"
      />
    );
  }

  return <ellipse cx={footprint.point.x} cy={footprint.point.y} rx={footprint.width / 2} ry={footprint.height / 2} fill={palette.roomFill} stroke={palette.wallStroke} strokeWidth="4" transform={transform} opacity="0.98" />;
}

function PremiumSchematicMap({ mapData, palette, isPlayer, showLabels = true }: { mapData?: DungeonMapData; palette: MapPalette; isPlayer: boolean; showLabels?: boolean }) {
  const anchors = getSchematicPremiumAnchors(mapData);
  const markers = isPlayer ? [] : getSchematicPremiumMarkers(mapData);
  const footprints = getSchematicPremiumFootprints(mapData);
  const footprintsByRoom = new Map(footprints.map((footprint) => [footprint.roomNumber, footprint]));
  const anchorsByRoom = new Map(anchors.map((anchor) => [anchor.roomNumber, anchor]));

  if (!anchors.length) {
    return null;
  }

  const connections = mapData?.connections ?? [];

  return (
    <g data-renderer="premium-schematic-map">
      <rect x="0" y="0" width="720" height="480" fill="#f7f7f7" />
      <g opacity="0.1">
        {Array.from({ length: 8 }).map((_, index) => (
          <path key={`v-${index}`} d={`M${80 + index * 78} 0 V480`} stroke="#111" strokeWidth="0.7" />
        ))}
        {Array.from({ length: 5 }).map((_, index) => (
          <path key={`h-${index}`} d={`M0 ${80 + index * 78} H720`} stroke="#111" strokeWidth="0.7" />
        ))}
      </g>

      {connections.map((connection) => {
        const from = anchorsByRoom.get(connection.from);
        const to = anchorsByRoom.get(connection.to);

        if (!from || !to) {
          return null;
        }

        const isSecret = connection.type === 'secret';
        if (isPlayer && isSecret) {
          return null;
        }

        return (
          <path
            key={`${connection.from}-${connection.to}-${connection.type}`}
            d={`M${from.point.x} ${from.point.y} L${to.point.x} ${to.point.y}`}
            fill="none"
            stroke={isSecret ? palette.secretStroke : '#171717'}
            strokeDasharray={isSecret ? '10 8' : undefined}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isSecret ? '3.5' : '5.5'}
            opacity={isSecret ? '0.82' : '0.5'}
          />
        );
      })}

      {footprints.map((footprint) => (
        <SchematicFootprint key={`${footprint.roomNumber}-${footprint.shape ?? 'ellipse'}`} footprint={footprint} palette={palette} />
      ))}

      {markers.map((marker, index) => (
        <g key={`${marker.roomNumber}-${marker.marker}-${index}`} filter="url(#markerInk)">
          <circle cx={marker.point.x} cy={marker.point.y} r="14" fill="#fff8ef" stroke="#7b3f28" strokeWidth="3" />
          <circle cx={marker.point.x} cy={marker.point.y} r="9.5" fill="#b85c38" opacity="0.96" />
          <text x={marker.point.x} y={marker.point.y + 4} textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff8ef">
            {markerLabel(marker.marker)}
          </text>
        </g>
      ))}

      {showLabels &&
        anchors.map((anchor) => (
          <g key={anchorKey(anchor)}>
            {!footprintsByRoom.has(anchor.roomNumber) && <circle cx={anchor.point.x} cy={anchor.point.y} r="28" fill="#f8f8f8" stroke="#171717" strokeWidth="6" />}
            <rect x={anchor.point.x - 20} y={anchor.point.y - 20} width="40" height="40" rx="10" fill="#fff8ef" opacity="0.9" />
            <text x={anchor.point.x} y={anchor.point.y + 9} textAnchor="middle" fontSize="34" fontWeight="900" fill="#211a16" paintOrder="stroke" stroke="#fff8ef" strokeWidth="4">
              {anchor.label ?? anchor.roomNumber}
            </text>
          </g>
        ))}
    </g>
  );
}

export function SchematicDungeonMap({ mapData, mapStyle, palette, isPlayer, showLabels = true }: { mapData?: DungeonMapData; mapStyle: MapStyle; palette: MapPalette; isPlayer: boolean; showLabels?: boolean }) {
  const premiumSchematic = <PremiumSchematicMap mapData={mapData} palette={palette} isPlayer={isPlayer} showLabels={showLabels} />;

  if (mapData?.premiumMap && getSchematicPremiumAnchors(mapData).length) {
    return premiumSchematic;
  }

  return <EnhancedFallbackMap mapData={mapData} style={mapStyle} palette={palette} isPlayer={isPlayer} enhanced={false} showLabels={showLabels} />;
}
