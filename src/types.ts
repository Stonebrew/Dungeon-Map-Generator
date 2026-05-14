export type UserTier = 'lantern' | 'adventurer' | 'dungeonwright';

export type TierId = UserTier;

export type Threat = 'Low' | 'Moderate' | 'High' | 'Severe';

export type EncounterType = 'Combat' | 'Social' | 'Hazard' | 'Puzzle' | 'Exploration';

export type MapStyle = 'blackfen' | 'shrine' | 'cavern' | 'crypt' | 'sewer' | 'laboratory';

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

export type DungeonMapData = {
  style: MapStyle;
  gmMapId: string;
  playerMapId: string;
  // Source of truth for room connectivity; room exit text and visual routes should match these links.
  connections?: MapConnection[];
  playerSafe: {
    hideSecrets: boolean;
    hideTreasure: boolean;
    hideHazards: boolean;
    hideGmNotes: boolean;
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
  id?: string;
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
  exits: string;
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
  date: string;
  title: string;
  theme: string;
  difficulty: string;
  partySize: string;
  estimatedPlayTime: string;
  hook: string;
  background: string;
  map: DungeonMapData;
  mapStyle: MapStyle;
  mapPlaceholder: string;
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
