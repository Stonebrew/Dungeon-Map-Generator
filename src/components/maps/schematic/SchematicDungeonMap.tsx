import { EnhancedFallbackMap, type MapPalette } from '../fallback/EnhancedFallbackMap';
import type { DungeonMapData, MapStyle } from '../../../types';

export function SchematicDungeonMap({ mapData, mapStyle, palette, isPlayer }: { mapData?: DungeonMapData; mapStyle: MapStyle; palette: MapPalette; isPlayer: boolean }) {
  return <EnhancedFallbackMap mapData={mapData} style={mapStyle} palette={palette} isPlayer={isPlayer} enhanced={false} />;
}
