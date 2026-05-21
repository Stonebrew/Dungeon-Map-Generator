import type { ComponentType } from 'react';
import type { MapConnection, MapStyle } from '../../../types';

export type LevelTwoGeometryStrategy = 'constructed' | 'organic' | 'hybrid';
export type LevelTwoRendererLevel = 2;
export type LevelTwoRouteVariant = 'ruin' | 'crypt' | 'sewer' | 'laboratory' | 'blackfen' | 'cavern' | 'volcanicForge';

export type LevelTwoMapTheme = {
  floorTiles: string[];
  floorStroke: string;
  floorHighlight: string;
  foundationFill: string;
  foundationTileStroke: string;
  wallDark: string;
  wallStroke: string;
  wallMid: string;
  wallHighlight: string;
  shadow: string;
  corridorShadow: string;
  corridorOuter: string;
  corridorMid: string;
  corridorFloor: string;
  corridorSeam: string;
  corridorHighlight: string;
  moss: string;
  water: string;
  dust: string;
  rubble: string;
  metal: string;
  sludge: string;
  brass: string;
  runeGlow: string;
  scorch: string;
  residue: string;
};

export type RoomNumberPoint = { x: number; y: number; label: string };

export type LevelTwoRendererProps = {
  connections: MapConnection[];
  secretStroke: string;
  isPlayer: boolean;
};

export type LevelTwoEnvironmentDefinition = {
  mapStyle: MapStyle;
  renderer: ComponentType<LevelTwoRendererProps>;
  theme: LevelTwoMapTheme;
  geometryStrategy: LevelTwoGeometryStrategy;
  rendererLevel: LevelTwoRendererLevel;
  routeVariant: LevelTwoRouteVariant;
  playerSafe?: {
    hideSecretRoutes: boolean;
    hideGmMarkers: boolean;
  };
};
