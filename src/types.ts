export type UserTier = 'lantern' | 'adventurer' | 'dungeonwright';

export type TierId = UserTier;

export type Threat = 'Low' | 'Moderate' | 'High' | 'Severe';

export type EncounterType = 'Combat' | 'Social' | 'Hazard' | 'Puzzle' | 'Exploration';

export type MapStyle = 'blackfen' | 'shrine' | 'cavern' | 'crypt' | 'sewer' | 'laboratory' | 'forestRuin' | 'volcanicForge';

export type MapConnection = {
  from: number;
  to: number;
  type: 'normal' | 'secret';
  note?: string;
  // SVG route path used by the prototype renderer. Backend-generated maps should derive this from the same source as room exits.
  path?: string;
  // Reserved for future one-way routes. Current mock validation treats links as bidirectional unless this is set.
  oneWay?: boolean;
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
  // Deprecated for backend planning: prefer generated map assets or richer geometry metadata.
  gmMapId: string;
  // Deprecated for backend planning: prefer generated player-safe map assets or richer geometry metadata.
  playerMapId: string;
  // Source of truth for room connectivity; room exit text and visual routes should match these links.
  connections?: MapConnection[];
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
