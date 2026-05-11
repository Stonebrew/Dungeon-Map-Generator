export type TierId = 'lantern' | 'adventurer' | 'dungeonwright';

export type Threat = 'Low' | 'Moderate' | 'High' | 'Severe';

export type EncounterType = 'Combat' | 'Social' | 'Hazard' | 'Puzzle' | 'Exploration';

export type MapStyle = 'blackfen' | 'shrine' | 'cavern' | 'crypt' | 'sewer' | 'laboratory';

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

export type Room = {
  number: number;
  name: string;
  readAloud: string;
  gmNotes: string;
  threat: Threat;
  tags: string[];
  inhabitants: Inhabitant[];
  treasure: string;
  secrets: string;
  exits: string;
};

export type TableEntry = {
  roll: string;
  result: string;
  type?: EncounterType;
};

export type EncounterTables = {
  wandering: TableEntry[];
  environmental: TableEntry[];
  complications: TableEntry[];
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
  mapStyle: MapStyle;
  mapPlaceholder: string;
  playerMapPlaceholder: string;
  rooms: Room[];
  encounterTables: EncounterTables;
  treasureTable: TableEntry[];
  gmNotes: string[];
};

export type RerollCounts = {
  remainingFull: number;
  storedFull: number;
  remainingPartial: number;
  storedPartial: number;
};

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
