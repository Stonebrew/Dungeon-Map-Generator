export type UserTier = 'lantern' | 'adventurer' | 'dungeonwright';

export type TierId = UserTier;

export type Threat = 'Low' | 'Moderate' | 'High' | 'Severe';

export type EncounterType = 'Combat' | 'Social' | 'Hazard' | 'Puzzle' | 'Exploration';

export type MapStyle = 'blackfen' | 'shrine' | 'cavern' | 'crypt' | 'sewer' | 'laboratory' | 'forestRuin' | 'volcanicForge' | 'frozenRuin' | 'desertTemple';

export type LayoutRole = 'hub' | 'branch' | 'loop' | 'spoke' | 'island' | 'threshold' | 'deadEnd' | 'secretPocket' | 'landmark' | 'objective' | 'transition';

export type AreaShape = 'rectilinear' | 'organic' | 'platform' | 'clearing' | 'chamber' | 'shaft' | 'bridge' | 'fragment' | 'hall' | 'ledge' | 'pool' | 'courtyard' | 'channel' | 'stair';

export type AreaScale = 'tiny' | 'small' | 'medium' | 'large' | 'huge';

export type AreaOpenness = 'enclosed' | 'semiOpen' | 'open' | 'exposed' | 'platform';

export type EnvironmentRole = 'safe' | 'hazardAdjacent' | 'hazardCrossing' | 'flooded' | 'elevated' | 'collapsed' | 'overgrown' | 'ritual' | 'mechanical' | 'natural' | 'fortified';

export type RouteStyle = 'corridor' | 'trail' | 'bridge' | 'tunnel' | 'ledge' | 'channel' | 'stair' | 'crawl' | 'servicePath' | 'causeway' | 'ford' | 'grate';

export type RouteDifficulty = 'clear' | 'narrow' | 'unstable' | 'hidden' | 'hazardous' | 'blocked';

export type LayoutGrammar = 'constructedHub' | 'linearRoute' | 'loopedDungeon' | 'organicCave' | 'openKeyedArea' | 'hazardIslands' | 'floodedIslands' | 'fragmentedVertical' | 'branchingShafts' | 'manorFloorplan';

export type MapConnection = {
  from: number;
  to: number;
  type: 'normal' | 'secret';
  note?: string;
  routeStyle?: RouteStyle;
  routeDifficulty?: RouteDifficulty;
  // SVG route path used by the prototype renderer. Backend-generated maps should derive this from the same source as room exits.
  path?: string;
  // Reserved for future one-way routes. Current mock validation treats links as bidirectional unless this is set.
  oneWay?: boolean;
};

export type PremiumMapImageAsset = {
  id: string;
  url: string;
  width: number;
  height: number;
  mimeType?: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/svg+xml';
  dpi?: number;
  alt?: string;
};

export type MapBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PremiumMapOverlayAnchor = {
  roomNumber: number;
  x?: number;
  y?: number;
  xPercent?: number;
  yPercent?: number;
  label?: string;
};

export type PremiumMapMarkerAnchor = PremiumMapOverlayAnchor & {
  marker: 'treasure' | 'hazard' | 'secret' | 'boss' | 'objective' | 'custom';
};

export type PremiumMapRouteOverlay = {
  from: number;
  to: number;
  type?: 'normal' | 'secret';
  path: string;
};

export type PremiumMapSchematicFootprint = {
  roomNumber: number;
  shape?: 'ellipse' | 'rect';
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  rotation?: number;
  label?: string;
};

export type PremiumMapBattlePrintCalibration = {
  status: 'calibrated' | 'uncalibrated' | 'unavailable';
  grid?: {
    squareWidthPx: number;
    squareHeightPx: number;
    originXPercent?: number;
    originYPercent?: number;
    rotationDeg?: number;
    // Legacy package support: older annotator exports used one uniform square size.
    squarePx?: number;
  };
  cropBoundsPercent?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  defaultOverlapInches?: 0 | 0.25 | 0.5;
  notes?: string;
};

export type PremiumMapOverlay = {
  viewBox?: string;
  labelAnchors?: PremiumMapOverlayAnchor[];
  markerAnchors?: PremiumMapMarkerAnchor[];
  routeOverlayPaths?: PremiumMapRouteOverlay[];
  notes?: string;
};

export type PremiumMapMetadata = {
  status?: 'planned' | 'available' | 'unavailable';
  baseMapImage?: PremiumMapImageAsset;
  gmBaseMapImage?: PremiumMapImageAsset;
  playerBaseMapImage?: PremiumMapImageAsset;
  printableMapVariant?: 'standard' | 'inkLight' | 'highContrast' | 'playerHandout';
  mapBounds?: MapBounds;
  imageSize?: {
    width: number;
    height: number;
  };
  overlayViewBox?: string;
  gmOverlay?: PremiumMapOverlay;
  playerOverlay?: PremiumMapOverlay;
  schematicFootprints?: PremiumMapSchematicFootprint[];
  battleMapPrint?: PremiumMapBattlePrintCalibration;
  showNormalRouteOverlay?: boolean;
  printNotes?: string;
};

export type RoomExitType = 'normal' | 'secret' | 'locked' | 'oneWay';

export type RoomExit = {
  id?: string;
  toRoomId?: string;
  toRoomNumber?: number;
  type: RoomExitType;
  label: string;
  description?: string;
  note?: string;
};

export type DungeonMapData = {
  style: MapStyle;
  layout?: {
    grammar?: LayoutGrammar | LayoutGrammar[];
    notes?: string;
  };
  // Deprecated for backend planning: prefer generated map assets or richer geometry metadata.
  gmMapId: string;
  // Deprecated for backend planning: prefer generated player-safe map assets or richer geometry metadata.
  playerMapId: string;
  // Source of truth for room connectivity; room exit text and visual routes should match these links.
  connections?: MapConnection[];
  // Optional future illustrated map layer. SVG schematic/Level 2 maps remain the fallback when this is absent.
  premiumMap?: PremiumMapMetadata;
  playerSafe: {
    hideSecrets: boolean;
    hideTreasure: boolean;
    hideHazards: boolean;
    hideGmNotes: boolean;
    description?: string;
  };
};

export type Inhabitant = {
  name: string;
  role: string;
  threat: string;
  durability: 'Fragile' | 'Standard' | 'Tough' | 'Very Tough';
  damage: 'Light' | 'Serious' | 'Severe';
  tactics: string;
  morale: string;
  wants: string;
  leverage: string;
};

export type DungeonRoom = {
  id: string;
  number: number;
  name: string;
  readAloud: string;
  readAloudText?: string;
  gmNotes: string;
  threat: Threat;
  tags: string[];
  layoutRole?: LayoutRole;
  areaShape?: AreaShape;
  areaScale?: AreaScale;
  openness?: AreaOpenness;
  environmentRole?: EnvironmentRole;
  inhabitants: Inhabitant[];
  treasure: string;
  secrets: string;
  // UI-facing prose kept for table readability. Backend payloads should also provide structuredExits.
  exits: string;
  structuredExits: RoomExit[];
  refreshEligibility?: {
    eligible: boolean;
    reason?: string;
  };
};

export type Room = DungeonRoom;

export type EncounterEntry = {
  roll: string;
  result: string;
  type?: EncounterType;
};

export type TreasureEntry = EncounterEntry;

export type EncounterTable = EncounterEntry[];

export type TableEntry = EncounterEntry;

export type EncounterTables = {
  wandering: EncounterTable;
  environmental: EncounterTable;
  complications: EncounterTable;
};

export type Dungeon = {
  id: string;
  dateIso: string;
  // Display date used by the current UI. Keep formatting in the frontend or backend presentation layer.
  date: string;
  // Repo-based content queue metadata. Add future packets with status "scheduled" and a YYYY-MM-DD releaseDate.
  releaseDate?: string;
  tier?: 'surveyor' | 'cartographer';
  status?: 'scheduled' | 'active' | 'archived';
  title: string;
  theme: string;
  difficulty: string;
  partySize: string;
  estimatedPlayTime: string;
  hook: string;
  background: string;
  map: DungeonMapData;
  // Deprecated compatibility field. Use map.style for renderer selection.
  mapStyle: MapStyle;
  // Deprecated compatibility field. Use map.gmMapId or future map asset metadata.
  mapPlaceholder: string;
  // Deprecated compatibility field. Use map.playerMapId or future player-safe map asset metadata.
  playerMapPlaceholder: string;
  rooms: DungeonRoom[];
  encounterTables: EncounterTables;
  treasureTable: TreasureEntry[];
  gmNotes: string[];
  featureMetadata?: {
    premiumMapAvailable?: boolean;
    playerMapAvailable?: boolean;
    freeSamplePacket?: boolean;
    refreshableRoomNumbers?: number[];
  };
};

export type RerollResources = {
  remainingFull: number;
  storedFull: number;
  remainingPartial: number;
  storedPartial: number;
};

export type RerollCounts = RerollResources;

export type RerollAllowance = {
  fullDailyLimit: number;
  partialDailyLimit: number;
};

export type Plan = {
  id: TierId;
  name: string;
  priceLabel: string;
  tagline: string;
  featureGroups: {
    title: string;
    features: string[];
  }[];
  rerolls: string;
  refreshes: string;
};
