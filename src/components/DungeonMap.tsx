import { Badge } from './Badge';
import { EnhancedFallbackMap, MapDefs, MapTexture, type MapPalette } from './maps/fallback/EnhancedFallbackMap';
import { getLevelTwoEnvironment } from './maps/LevelTwoMapRenderer';
import { SchematicDungeonMap } from './maps/schematic/SchematicDungeonMap';
import type { DungeonMapData, MapStyle } from '../types';

function createMapPalette({ enhanced, isPlayer }: { enhanced: boolean; isPlayer: boolean }): MapPalette {
  const roomFill = enhanced && !isPlayer ? '#e3eedc' : isPlayer ? '#fbf7eb' : '#f8f8f8';

  return {
    roomFill,
    featureFill: enhanced ? (isPlayer ? '#e5dfca' : '#cfe7ee') : '#efefef',
    secretStroke: isPlayer ? 'transparent' : '#b85c38',
    finalFill: enhanced && !isPlayer ? '#ead9cc' : isPlayer ? '#fbf7eb' : '#f8f8f8',
    wallStroke: enhanced ? '#211a16' : '#171717',
    floorLine: enhanced ? '#7b5d45' : '#3a3a3a',
    roomShadow: enhanced ? '#5f4937' : '#111',
    water: enhanced ? '#6fa1a5' : '#d9d9d9',
    accent: enhanced ? '#9b6b3e' : '#555',
  };
}

function MapContent({ mapData, mapStyle, palette, isPlayer, enhanced }: { mapData?: DungeonMapData; mapStyle: MapStyle; palette: MapPalette; isPlayer: boolean; enhanced: boolean }) {
  if (!enhanced) {
    return <SchematicDungeonMap mapData={mapData} mapStyle={mapStyle} palette={palette} isPlayer={isPlayer} />;
  }

  const levelTwoEnvironment = getLevelTwoEnvironment(mapStyle);

  if (levelTwoEnvironment) {
    const LevelTwoRenderer = levelTwoEnvironment.renderer;
    return <LevelTwoRenderer connections={mapData?.connections ?? []} secretStroke={palette.secretStroke} isPlayer={isPlayer} />;
  }

  return <EnhancedFallbackMap mapData={mapData} style={mapStyle} palette={palette} isPlayer={isPlayer} enhanced />;
}

export function DungeonMap({
  mode,
  mapData,
  mapStyle,
  colorEnabled,
  compact = false,
  showLegend = false,
}: {
  mode: 'gm' | 'player' | 'fog';
  mapData?: DungeonMapData;
  mapStyle: MapStyle;
  colorEnabled: boolean;
  compact?: boolean;
  showLegend?: boolean;
}) {
  const isPlayer = mode === 'player';
  const isFog = mode === 'fog';
  const enhanced = colorEnabled;
  const palette = createMapPalette({ enhanced, isPlayer });

  return (
    <div className="overflow-hidden rounded-md border border-ink/10 bg-white shadow-tool">
      <div className={`flex items-center justify-between gap-3 border-b border-ink/10 px-4 ${compact ? 'py-2.5' : 'py-3'}`}>
        <div>
          <h2 className={`font-serif font-bold ${compact ? 'text-lg' : 'text-xl'}`}>{isPlayer ? 'Player-Safe Map' : isFog ? 'Fog-of-War Map' : 'GM Map Preview'}</h2>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">{enhanced ? 'Enhanced tabletop map' : 'Lantern black-and-white map'}</p>
        </div>
        {isPlayer ? <Badge tone="success">Secrets hidden</Badge> : <Badge tone="accent">GM labels</Badge>}
      </div>

      <svg viewBox="0 0 720 480" role="img" aria-label={`${isPlayer ? 'Player safe' : 'GM'} dungeon map`} className={`h-auto w-full ${enhanced ? 'bg-[#efe7d6]' : 'bg-[#f7f7f7]'}`}>
        <MapDefs />
        <MapTexture isPlayer={isPlayer} enhanced={enhanced} />
        <MapContent mapData={mapData} mapStyle={mapStyle} palette={palette} isPlayer={isPlayer} enhanced={enhanced} />
        {isFog && <rect x="46" y="44" width="628" height="392" fill="#211a16" opacity="0.22" />}
      </svg>

      {showLegend && (
        <div className="flex flex-wrap gap-2 border-t border-ink/10 px-4 py-2 text-xs font-bold text-ink/55">
          <span>Numbers: keyed rooms</span>
          {!isPlayer && <span>T: treasure</span>}
          {!isPlayer && <span>H: hazard</span>}
          {!isPlayer && <span>B: boss/objective</span>}
          {!isPlayer && <span>Dashed lines: secret routes</span>}
        </div>
      )}
    </div>
  );
}
