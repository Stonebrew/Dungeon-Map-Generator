import { Badge } from './Badge';
import { EnhancedFallbackMap, MapDefs, MapTexture, type MapPalette } from './maps/fallback/EnhancedFallbackMap';
import { getLevelTwoEnvironment } from './maps/LevelTwoMapRenderer';
import { PremiumMapLayer } from './maps/premium/PremiumMapLayer';
import { hasPremiumMapAsset } from './maps/premium/premiumMapAssets';
import { SchematicDungeonMap } from './maps/schematic/SchematicDungeonMap';
import type { DungeonMapData, MapStyle } from '../types';
import type { MapPresentation } from './maps/level-two/types';

function createMapPalette({ enhanced, isPlayer, presentation }: { enhanced: boolean; isPlayer: boolean; presentation: MapPresentation }): MapPalette {
  const isPrint = presentation === 'print';
  const roomFill = isPrint ? (isPlayer ? '#fffaf0' : '#f3ead7') : enhanced && !isPlayer ? '#e3eedc' : isPlayer ? '#fbf7eb' : '#f8f8f8';

  return {
    roomFill,
    featureFill: isPrint ? '#e9dbc2' : enhanced ? (isPlayer ? '#e5dfca' : '#cfe7ee') : '#efefef',
    secretStroke: isPlayer ? 'transparent' : isPrint ? '#8f3f26' : '#b85c38',
    finalFill: isPrint ? '#ead5bd' : enhanced && !isPlayer ? '#ead9cc' : isPlayer ? '#fbf7eb' : '#f8f8f8',
    wallStroke: enhanced ? '#211a16' : '#171717',
    floorLine: isPrint ? '#5f4937' : enhanced ? '#7b5d45' : '#3a3a3a',
    roomShadow: enhanced ? '#5f4937' : '#111',
    water: isPrint ? '#4f8388' : enhanced ? '#6fa1a5' : '#d9d9d9',
    accent: isPrint ? '#7a4d2c' : enhanced ? '#9b6b3e' : '#555',
  };
}

function MapContent({
  mapData,
  mapStyle,
  palette,
  isPlayer,
  enhanced,
  presentation,
  showLabels,
}: {
  mapData?: DungeonMapData;
  mapStyle: MapStyle;
  palette: MapPalette;
  isPlayer: boolean;
  enhanced: boolean;
  presentation: MapPresentation;
  showLabels: boolean;
}) {
  if (!enhanced) {
    return <SchematicDungeonMap mapData={mapData} mapStyle={mapStyle} palette={palette} isPlayer={isPlayer} showLabels={showLabels} />;
  }

  const levelTwoEnvironment = getLevelTwoEnvironment(mapStyle);

  if (levelTwoEnvironment) {
    const LevelTwoRenderer = levelTwoEnvironment.renderer;
    const fallback = <LevelTwoRenderer connections={mapData?.connections ?? []} secretStroke={palette.secretStroke} isPlayer={isPlayer} presentation={presentation} showLabels={showLabels} />;

    if (hasPremiumMapAsset(mapData, isPlayer)) {
      return <PremiumMapLayer mapData={mapData} isPlayer={isPlayer} fallback={fallback} showLabels={showLabels} />;
    }

    return fallback;
  }

  const fallback = <EnhancedFallbackMap mapData={mapData} style={mapStyle} palette={palette} isPlayer={isPlayer} enhanced showLabels={showLabels} />;

  if (hasPremiumMapAsset(mapData, isPlayer)) {
    return <PremiumMapLayer mapData={mapData} isPlayer={isPlayer} fallback={fallback} showLabels={showLabels} />;
  }

  return fallback;
}

export function DungeonMap({
  mode,
  mapData,
  mapStyle,
  colorEnabled,
  compact = false,
  showLegend = false,
  presentation = 'screen',
  playerLabelsVisible = true,
}: {
  mode: 'gm' | 'player' | 'fog';
  mapData?: DungeonMapData;
  mapStyle: MapStyle;
  colorEnabled: boolean;
  compact?: boolean;
  showLegend?: boolean;
  presentation?: MapPresentation;
  playerLabelsVisible?: boolean;
}) {
  const isPlayer = mode === 'player';
  const isFog = mode === 'fog';
  const enhanced = colorEnabled;
  const palette = createMapPalette({ enhanced, isPlayer, presentation });
  const isPrintPresentation = presentation === 'print';
  const showLabels = !isPlayer || playerLabelsVisible;
  const hasLegendContent = showLabels || !isPlayer;

  return (
    <div className={`map-ledger-frame w-full max-w-full overflow-hidden rounded-md border shadow-tool ${isPrintPresentation ? 'border-ink/35 print-map-card' : 'border-[#bba98f]'}`}>
      <div
        className={`flex items-center justify-between gap-3 border-b px-4 ${
          isPrintPresentation ? 'border-ink/25 bg-white' : 'border-[#cdbfa9] bg-[#fbf4e6]/95'
        } ${compact ? 'py-2.5' : 'py-3'}`}
      >
        <div>
          <h2 className={`survey-title font-serif font-bold ${compact ? 'text-lg' : 'text-xl'}`}>{isPlayer ? 'Player-Safe Map' : isFog ? 'Fog-of-War Map' : 'GM Map Preview'}</h2>
          <p className="ledger-label text-xs font-semibold uppercase text-ink/45">{isPrintPresentation ? 'Print-optimized map' : enhanced ? 'Enhanced tabletop map' : 'Surveyor schematic map'}</p>
        </div>
        {isPlayer ? <Badge tone="success">Secrets hidden</Badge> : <Badge tone="accent">GM labels</Badge>}
      </div>

      <svg viewBox="0 0 720 480" role="img" aria-label={`${isPlayer ? 'Player safe' : 'GM'} dungeon map`} className={`block h-auto w-full max-w-full ${isPrintPresentation ? 'bg-[#f8f1e2]' : enhanced ? 'bg-[#edf0ec]' : 'bg-[#fff9ec]'}`}>
        <MapDefs />
        <MapTexture isPlayer={isPlayer} enhanced={enhanced && !isPrintPresentation} />
        <MapContent mapData={mapData} mapStyle={mapStyle} palette={palette} isPlayer={isPlayer} enhanced={enhanced} presentation={presentation} showLabels={showLabels} />
        {isFog && <rect x="46" y="44" width="628" height="392" fill="#211a16" opacity="0.22" />}
      </svg>

      {showLegend && hasLegendContent && (
        <div className="flex flex-wrap gap-2 border-t border-[#cdbfa9] bg-[#f4ead8]/95 px-4 py-2 text-xs font-bold text-ink/60">
          {showLabels && <span>Numbers: keyed rooms</span>}
          {!isPlayer && <span>T: treasure</span>}
          {!isPlayer && <span>H: hazard</span>}
          {!isPlayer && <span>B: boss/objective</span>}
          {!isPlayer && <span>Dashed lines: secret routes</span>}
        </div>
      )}
    </div>
  );
}
