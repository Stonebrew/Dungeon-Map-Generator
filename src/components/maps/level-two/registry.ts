import type { MapStyle } from '../../../types';
import { LevelTwoBlackfenRenderer, LevelTwoCavernRenderer, LevelTwoCryptRenderer, LevelTwoForestRuinRenderer, LevelTwoLaboratoryRenderer, LevelTwoSewerRenderer, LevelTwoShrineRenderer, LevelTwoVolcanicForgeRenderer } from './environments';
import { blackfenTheme, cavernTheme, cryptTheme, forestRuinTheme, laboratoryTheme, sewerTheme, shrineTheme, volcanicForgeTheme } from './themes';
import type { LevelTwoEnvironmentDefinition } from './types';

export const levelTwoEnvironmentRegistry: Partial<Record<MapStyle, LevelTwoEnvironmentDefinition>> = {
  blackfen: {
    mapStyle: 'blackfen',
    renderer: LevelTwoBlackfenRenderer,
    theme: blackfenTheme,
    geometryStrategy: 'constructed',
    rendererLevel: 2,
    routeVariant: 'blackfen',
    playerSafe: { hideGmMarkers: true, hideSecretRoutes: true },
  },
  cavern: {
    mapStyle: 'cavern',
    renderer: LevelTwoCavernRenderer,
    theme: cavernTheme,
    geometryStrategy: 'organic',
    rendererLevel: 2,
    routeVariant: 'cavern',
    playerSafe: { hideGmMarkers: true, hideSecretRoutes: true },
  },
  crypt: {
    mapStyle: 'crypt',
    renderer: LevelTwoCryptRenderer,
    theme: cryptTheme,
    geometryStrategy: 'constructed',
    rendererLevel: 2,
    routeVariant: 'crypt',
    playerSafe: { hideGmMarkers: true, hideSecretRoutes: true },
  },
  forestRuin: {
    mapStyle: 'forestRuin',
    renderer: LevelTwoForestRuinRenderer,
    theme: forestRuinTheme,
    geometryStrategy: 'hybrid',
    rendererLevel: 2,
    routeVariant: 'ruin',
    playerSafe: { hideGmMarkers: true, hideSecretRoutes: true },
  },
  laboratory: {
    mapStyle: 'laboratory',
    renderer: LevelTwoLaboratoryRenderer,
    theme: laboratoryTheme,
    geometryStrategy: 'constructed',
    rendererLevel: 2,
    routeVariant: 'laboratory',
    playerSafe: { hideGmMarkers: true, hideSecretRoutes: true },
  },
  sewer: {
    mapStyle: 'sewer',
    renderer: LevelTwoSewerRenderer,
    theme: sewerTheme,
    geometryStrategy: 'constructed',
    rendererLevel: 2,
    routeVariant: 'sewer',
    playerSafe: { hideGmMarkers: true, hideSecretRoutes: true },
  },
  shrine: {
    mapStyle: 'shrine',
    renderer: LevelTwoShrineRenderer,
    theme: shrineTheme,
    geometryStrategy: 'constructed',
    rendererLevel: 2,
    routeVariant: 'ruin',
    playerSafe: { hideGmMarkers: true, hideSecretRoutes: true },
  },
  volcanicForge: {
    mapStyle: 'volcanicForge',
    renderer: LevelTwoVolcanicForgeRenderer,
    theme: volcanicForgeTheme,
    geometryStrategy: 'constructed',
    rendererLevel: 2,
    routeVariant: 'volcanicForge',
    playerSafe: { hideGmMarkers: true, hideSecretRoutes: true },
  },
};

export function getLevelTwoEnvironment(mapStyle: MapStyle) {
  return levelTwoEnvironmentRegistry[mapStyle];
}
