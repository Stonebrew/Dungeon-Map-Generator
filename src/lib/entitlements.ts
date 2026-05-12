import type { TierId } from '../types';

export type FeatureKey =
  | 'dailyDungeon'
  | 'gmView'
  | 'colorMap'
  | 'playerMap'
  | 'pdfExport'
  | 'archive'
  | 'favorite'
  | 'fullReroll'
  | 'partialRefresh'
  | 'advancedControls'
  | 'fogOfWar'
  | 'exportBundle'
  | 'dungeonSize'
  | 'themeSelector'
  | 'difficultySelector'
  | 'dayNightVariant'
  | 'inhabitantType'
  | 'puzzleFrequency'
  | 'hazardFrequency'
  | 'treasureFrequency'
  | 'secretFrequency';

type FeatureDefinition = {
  label: string;
  requiredTier: TierId;
  description: string;
};

export const tierRank: Record<TierId, number> = {
  lantern: 0,
  adventurer: 1,
  dungeonwright: 2,
};

const featureDefinitions: Record<FeatureKey, FeatureDefinition> = {
  dailyDungeon: {
    label: 'Daily Dungeon',
    requiredTier: 'lantern',
    description: 'Open the shared daily dungeon with basic room descriptions, GM notes, and encounter tables.',
  },
  gmView: {
    label: 'GM View',
    requiredTier: 'lantern',
    description: 'Run the dungeon from GM-facing notes, rooms, encounters, treasure, and table prompts.',
  },
  colorMap: {
    label: 'Color Map',
    requiredTier: 'adventurer',
    description: 'Use the color version of the dungeon map for easier scanning at the table.',
  },
  playerMap: {
    label: 'Player-Safe Map',
    requiredTier: 'adventurer',
    description: 'Share a spoiler-free map with your players while keeping traps, secrets, treasure, and GM-only labels hidden.',
  },
  pdfExport: {
    label: 'PDF Export',
    requiredTier: 'adventurer',
    description: 'Prepare a table-ready handout packet for the dungeon. This prototype only shows the export entry point.',
  },
  archive: {
    label: 'Archive Access',
    requiredTier: 'adventurer',
    description: 'Keep previous daily dungeons available for later sessions, reskins, or campaign prep.',
  },
  favorite: {
    label: 'Save / Favorite Dungeons',
    requiredTier: 'adventurer',
    description: 'Mark useful dungeons so they can be found again later when real storage exists.',
  },
  fullReroll: {
    label: 'Reroll / Refresh Tools',
    requiredTier: 'adventurer',
    description: 'Adjust today’s dungeon with full rerolls, map-preserving variants, or targeted partial refreshes.',
  },
  partialRefresh: {
    label: 'Partial Refresh',
    requiredTier: 'adventurer',
    description: 'Refresh a single room, encounter table, treasure result, story hook, or dungeon section.',
  },
  advancedControls: {
    label: 'Advanced Controls',
    requiredTier: 'dungeonwright',
    description: 'Fine-tune dungeon generation controls for theme, difficulty, pacing, inhabitants, hazards, treasure, and secrets.',
  },
  fogOfWar: {
    label: 'Fog-of-war Map View',
    requiredTier: 'dungeonwright',
    description: 'Reveal only explored areas while keeping the rest of the dungeon obscured during play.',
  },
  exportBundle: {
    label: 'Export Bundle',
    requiredTier: 'dungeonwright',
    description: 'Prepare grouped GM notes, player maps, and table handouts as a future export bundle.',
  },
  dungeonSize: {
    label: 'Dungeon Size',
    requiredTier: 'dungeonwright',
    description: 'Scale the dungeon up or down for the session length you actually have.',
  },
  themeSelector: {
    label: 'Theme Selector',
    requiredTier: 'dungeonwright',
    description: 'Choose a dungeon mood before generating or refreshing content.',
  },
  difficultySelector: {
    label: 'Difficulty Selector',
    requiredTier: 'dungeonwright',
    description: 'Tune the danger level to match the table’s appetite tonight.',
  },
  dayNightVariant: {
    label: 'Day / Night Variant',
    requiredTier: 'dungeonwright',
    description: 'Shift the dungeon atmosphere and encounter behavior without changing the whole premise.',
  },
  inhabitantType: {
    label: 'Inhabitant Type',
    requiredTier: 'dungeonwright',
    description: 'Steer the main opposition toward bandits, undead, constructs, spirits, or other fantasy groups.',
  },
  puzzleFrequency: {
    label: 'Puzzle Frequency',
    requiredTier: 'dungeonwright',
    description: 'Adjust how often rooms ask players to solve, infer, or experiment.',
  },
  hazardFrequency: {
    label: 'Hazard Frequency',
    requiredTier: 'dungeonwright',
    description: 'Adjust how often the dungeon itself creates pressure.',
  },
  treasureFrequency: {
    label: 'Treasure Frequency',
    requiredTier: 'dungeonwright',
    description: 'Adjust how reward-dense the dungeon feels.',
  },
  secretFrequency: {
    label: 'Secret Room Frequency',
    requiredTier: 'dungeonwright',
    description: 'Adjust how many hidden rooms, routes, and clues appear.',
  },
};

export function canAccessFeature(tier: TierId, feature: FeatureKey) {
  return tierRank[tier] >= tierRank[getRequiredTier(feature)];
}

export function getRequiredTier(feature: FeatureKey) {
  return featureDefinitions[feature].requiredTier;
}

export function getFeatureLabel(feature: FeatureKey) {
  return featureDefinitions[feature].label;
}

export function getFeatureDescription(feature: FeatureKey) {
  return featureDefinitions[feature].description;
}

export function getTierLabel(tier: TierId) {
  const labels: Record<TierId, string> = {
    lantern: 'Lantern',
    adventurer: 'Adventurer',
    dungeonwright: 'Dungeonwright',
  };

  return labels[tier];
}
