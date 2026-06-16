import { EnhancedFallbackMap, type MapPalette } from '../fallback/EnhancedFallbackMap';
import { DEFAULT_PREMIUM_MAP_BOUNDS, getPremiumAnchorPoint } from '../premium/premiumMapGeometry';
import type { DungeonMapData, MapConnection, MapStyle, PremiumMapMarkerAnchor, PremiumMapOverlayAnchor, PremiumMapSchematicFootprint } from '../../../types';

type SchematicTheme = {
  background: string;
  wash: string;
  washAlt: string;
  roomFill: string;
  roomAccent: string;
  roomStroke: string;
  routeWall: string;
  routeFloor: string;
  grid: string;
  feature: string;
};

const schematicThemes: Record<MapStyle, SchematicTheme> = {
  blackfen: {
    background: '#efe8d7',
    wash: '#9fb49d',
    washAlt: '#668d8f',
    roomFill: '#f8f1df',
    roomAccent: '#d5dfc7',
    roomStroke: '#3b3328',
    routeWall: '#5a4937',
    routeFloor: '#e7d8bd',
    grid: '#8b755a',
    feature: '#5d827c',
  },
  shrine: {
    background: '#efe6d3',
    wash: '#bfa26d',
    washAlt: '#7d9992',
    roomFill: '#fbf4e5',
    roomAccent: '#e3d0aa',
    roomStroke: '#332a21',
    routeWall: '#68513b',
    routeFloor: '#ecddc2',
    grid: '#917657',
    feature: '#9b6b3e',
  },
  cavern: {
    background: '#ece3d2',
    wash: '#8a7a63',
    washAlt: '#7d9a91',
    roomFill: '#f4ead6',
    roomAccent: '#d2c4a8',
    roomStroke: '#302820',
    routeWall: '#544434',
    routeFloor: '#e5d4b8',
    grid: '#7d6952',
    feature: '#6e8374',
  },
  crypt: {
    background: '#eee5d5',
    wash: '#9b8e82',
    washAlt: '#626f7a',
    roomFill: '#f7efe0',
    roomAccent: '#d6d0c4',
    roomStroke: '#2e2924',
    routeWall: '#50473d',
    routeFloor: '#e6d9c6',
    grid: '#7c6d5d',
    feature: '#6a6370',
  },
  sewer: {
    background: '#eae2cf',
    wash: '#6d9484',
    washAlt: '#9a835d',
    roomFill: '#f3ead8',
    roomAccent: '#cad6be',
    roomStroke: '#282d28',
    routeWall: '#475943',
    routeFloor: '#dce4ca',
    grid: '#687461',
    feature: '#4d8d96',
  },
  laboratory: {
    background: '#ece4d6',
    wash: '#8795a0',
    washAlt: '#b28b62',
    roomFill: '#f8f1e3',
    roomAccent: '#d8dde0',
    roomStroke: '#2b2928',
    routeWall: '#4e5557',
    routeFloor: '#e8ded0',
    grid: '#738087',
    feature: '#7b6a93',
  },
  forestRuin: {
    background: '#ede6d1',
    wash: '#7d9b67',
    washAlt: '#9b7b4f',
    roomFill: '#f8f1de',
    roomAccent: '#cfddbd',
    roomStroke: '#2e3829',
    routeWall: '#4d5c3c',
    routeFloor: '#e7dcc3',
    grid: '#74835d',
    feature: '#6f9c71',
  },
  volcanicForge: {
    background: '#e8ded0',
    wash: '#6a6260',
    washAlt: '#b96545',
    roomFill: '#f2e5d3',
    roomAccent: '#dfb08d',
    roomStroke: '#271f1b',
    routeWall: '#493730',
    routeFloor: '#e4c6a8',
    grid: '#7b5c4d',
    feature: '#a65335',
  },
  frozenRuin: {
    background: '#eef0ea',
    wash: '#91b2bd',
    washAlt: '#c8d8d9',
    roomFill: '#fbf7ea',
    roomAccent: '#d7e6e7',
    roomStroke: '#29343a',
    routeWall: '#435962',
    routeFloor: '#e8f1ef',
    grid: '#6d8790',
    feature: '#82aeb9',
  },
  desertTemple: {
    background: '#efe3ca',
    wash: '#c69a57',
    washAlt: '#9f7650',
    roomFill: '#fbf0d8',
    roomAccent: '#e3c48e',
    roomStroke: '#3a2a1b',
    routeWall: '#6b4b2c',
    routeFloor: '#eed9b0',
    grid: '#9c7c55',
    feature: '#b78a45',
  },
};

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
  theme,
}: {
  footprint: PremiumMapSchematicFootprint & { point: { x: number; y: number }; width: number; height: number };
  theme: SchematicTheme;
}) {
  const shape = footprint.shape ?? 'ellipse';
  const transform = `rotate(${footprint.rotation ?? 0} ${footprint.point.x} ${footprint.point.y})`;
  const labelSeed = footprint.roomNumber % 3;
  const fill = labelSeed === 0 ? theme.roomAccent : theme.roomFill;

  if (shape === 'rect') {
    return (
      <g transform={transform}>
        <rect x={footprint.point.x - footprint.width / 2 - 5} y={footprint.point.y - footprint.height / 2 + 8} width={footprint.width + 10} height={footprint.height + 6} rx="18" fill="#2a2018" opacity="0.15" />
        <rect x={footprint.point.x - footprint.width / 2 - 4} y={footprint.point.y - footprint.height / 2 - 4} width={footprint.width + 8} height={footprint.height + 8} rx="18" fill="none" stroke={theme.roomStroke} strokeWidth="5" opacity="0.18" />
        <rect x={footprint.point.x - footprint.width / 2} y={footprint.point.y - footprint.height / 2} width={footprint.width} height={footprint.height} rx="15" fill={fill} stroke={theme.roomStroke} strokeWidth="3.2" opacity="0.98" />
        <rect x={footprint.point.x - footprint.width / 2 + 9} y={footprint.point.y - footprint.height / 2 + 9} width={Math.max(footprint.width - 18, 1)} height={Math.max(footprint.height - 18, 1)} rx="10" fill="url(#premiumStoneTile)" opacity="0.22" />
        <path d={`M${footprint.point.x - footprint.width / 2 + 16} ${footprint.point.y - footprint.height / 2 + 14} H${footprint.point.x + footprint.width / 2 - 16} M${footprint.point.x - footprint.width / 2 + 18} ${footprint.point.y + footprint.height / 2 - 14} H${footprint.point.x + footprint.width / 2 - 18}`} stroke="#fff8ef" strokeWidth="1.7" opacity="0.34" />
      </g>
    );
  }

  return (
    <g transform={transform}>
      <ellipse cx={footprint.point.x + 4} cy={footprint.point.y + 8} rx={footprint.width / 2 + 6} ry={footprint.height / 2 + 5} fill="#2a2018" opacity="0.14" />
      <ellipse cx={footprint.point.x} cy={footprint.point.y} rx={footprint.width / 2 + 4} ry={footprint.height / 2 + 4} fill="none" stroke={theme.roomStroke} strokeWidth="5" opacity="0.18" />
      <ellipse cx={footprint.point.x} cy={footprint.point.y} rx={footprint.width / 2} ry={footprint.height / 2} fill={fill} stroke={theme.roomStroke} strokeWidth="3.2" opacity="0.98" />
      <ellipse cx={footprint.point.x} cy={footprint.point.y} rx={Math.max(footprint.width / 2 - 9, 1)} ry={Math.max(footprint.height / 2 - 9, 1)} fill="url(#premiumCaveFloor)" opacity="0.18" />
      <path d={`M${footprint.point.x - footprint.width * 0.28} ${footprint.point.y - footprint.height * 0.08} C${footprint.point.x - 12} ${footprint.point.y - footprint.height * 0.2} ${footprint.point.x + 12} ${footprint.point.y + footprint.height * 0.16} ${footprint.point.x + footprint.width * 0.28} ${footprint.point.y + footprint.height * 0.04}`} stroke="#fff8ef" strokeWidth="1.7" fill="none" opacity="0.32" />
    </g>
  );
}

function routeKey(connection: MapConnection) {
  return `${connection.from}-${connection.to}-${connection.type}-${connection.routeStyle ?? 'route'}`;
}

function PremiumSchematicBackground({ theme, isPlayer }: { theme: SchematicTheme; isPlayer: boolean }) {
  return (
    <g data-renderer="premium-schematic-background">
      <rect x="0" y="0" width="720" height="480" fill={theme.background} />
      <rect x="0" y="0" width="720" height="480" fill="url(#paperGrain)" opacity={isPlayer ? '0.2' : '0.3'} />
      <path d="M42 88 C128 28 226 54 276 118 C326 182 410 94 482 62 C568 24 642 64 690 126" stroke={theme.wash} strokeWidth="78" strokeLinecap="round" fill="none" opacity={isPlayer ? '0.08' : '0.12'} />
      <path d="M34 382 C126 338 202 406 286 352 C372 296 432 402 522 356 C598 318 648 334 694 380" stroke={theme.washAlt} strokeWidth="64" strokeLinecap="round" fill="none" opacity={isPlayer ? '0.06' : '0.1'} />
      <g opacity={isPlayer ? '0.06' : '0.09'}>
        {Array.from({ length: 8 }).map((_, index) => (
          <path key={`v-${index}`} d={`M${80 + index * 78} 18 V462`} stroke={theme.grid} strokeWidth="0.8" strokeDasharray="10 16" />
        ))}
        {Array.from({ length: 5 }).map((_, index) => (
          <path key={`h-${index}`} d={`M22 ${80 + index * 78} H698`} stroke={theme.grid} strokeWidth="0.8" strokeDasharray="10 16" />
        ))}
      </g>
      <path d="M36 40 H684 V440 H36 Z" fill="none" stroke={theme.grid} strokeWidth="1.5" opacity="0.22" strokeDasharray="24 14" />
      <path d="M58 58 h42 M58 58 v42 M662 58 h-42 M662 58 v42 M58 422 h42 M58 422 v-42 M662 422 h-42 M662 422 v-42" stroke={theme.roomStroke} strokeWidth="2" opacity="0.34" strokeLinecap="round" />
    </g>
  );
}

function PremiumSchematicRoutes({
  connections,
  anchorsByRoom,
  isPlayer,
  theme,
}: {
  connections: MapConnection[];
  anchorsByRoom: Map<number, PremiumMapOverlayAnchor & { point: { x: number; y: number } }>;
  isPlayer: boolean;
  theme: SchematicTheme;
}) {
  return (
    <g data-renderer="premium-schematic-routes">
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

        const routePath = `M${from.point.x} ${from.point.y} L${to.point.x} ${to.point.y}`;
        const isBridge = connection.routeStyle === 'bridge' || connection.routeStyle === 'stair' || connection.routeStyle === 'causeway';

        return (
          <g key={routeKey(connection)}>
            <path d={routePath} fill="none" stroke={isSecret ? theme.roomStroke : theme.routeWall} strokeDasharray={isSecret ? '10 8' : undefined} strokeLinecap="round" strokeLinejoin="round" strokeWidth={isSecret ? '6' : isBridge ? '13' : '18'} opacity={isSecret ? '0.5' : '0.24'} />
            <path d={routePath} fill="none" stroke={isSecret ? theme.roomStroke : theme.routeFloor} strokeDasharray={isSecret ? '8 9' : undefined} strokeLinecap="round" strokeLinejoin="round" strokeWidth={isSecret ? '3' : isBridge ? '7' : '10'} opacity={isSecret ? '0.86' : '0.92'} />
            {!isSecret && (
              <path d={routePath} fill="none" stroke={theme.feature} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" opacity={isBridge ? '0.34' : '0.18'} strokeDasharray={isBridge ? '6 8' : '3 12'} />
            )}
          </g>
        );
      })}
    </g>
  );
}

function PremiumSchematicMap({ mapData, mapStyle, isPlayer, showLabels = true }: { mapData?: DungeonMapData; mapStyle: MapStyle; isPlayer: boolean; showLabels?: boolean }) {
  const anchors = getSchematicPremiumAnchors(mapData);
  const markers = isPlayer ? [] : getSchematicPremiumMarkers(mapData);
  const footprints = getSchematicPremiumFootprints(mapData);
  const footprintsByRoom = new Map(footprints.map((footprint) => [footprint.roomNumber, footprint]));
  const anchorsByRoom = new Map(anchors.map((anchor) => [anchor.roomNumber, anchor]));
  const theme = schematicThemes[mapStyle] ?? schematicThemes.shrine;

  if (!anchors.length) {
    return null;
  }

  const connections = mapData?.connections ?? [];

  return (
    <g data-renderer="premium-schematic-map">
      <PremiumSchematicBackground theme={theme} isPlayer={isPlayer} />
      <PremiumSchematicRoutes connections={connections} anchorsByRoom={anchorsByRoom} isPlayer={isPlayer} theme={theme} />

      {footprints.map((footprint) => (
        <SchematicFootprint key={`${footprint.roomNumber}-${footprint.shape ?? 'ellipse'}`} footprint={footprint} theme={theme} />
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
            {!footprintsByRoom.has(anchor.roomNumber) && (
              <circle cx={anchor.point.x} cy={anchor.point.y} r="28" fill={theme.roomFill} stroke={theme.roomStroke} strokeWidth="4" />
            )}
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
  const premiumSchematic = <PremiumSchematicMap mapData={mapData} mapStyle={mapStyle} isPlayer={isPlayer} showLabels={showLabels} />;

  if (mapData?.premiumMap && getSchematicPremiumAnchors(mapData).length) {
    return premiumSchematic;
  }

  return <EnhancedFallbackMap mapData={mapData} style={mapStyle} palette={palette} isPlayer={isPlayer} enhanced={false} showLabels={showLabels} />;
}
