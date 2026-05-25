import type { Dungeon, DungeonRoom, MapConnection, PremiumMapImageAsset, PremiumMapMetadata, PremiumMapOverlay } from '../types';

export type DungeonValidationIssue = {
  severity: 'error' | 'warning';
  message: string;
  roomNumbers?: number[];
};

export type DungeonValidationResult = {
  dungeonId: string;
  dungeonTitle: string;
  errors: DungeonValidationIssue[];
  warnings: DungeonValidationIssue[];
  valid: boolean;
};

const hiddenRouteWords = [
  'secret',
  'hidden',
  'concealed',
  'crawlspace',
  'crawl',
  'collapsed',
  'cracked',
  'loose',
  'seam',
  'underwater',
  'chimney',
  'maintenance',
  'crate',
  'valve',
  'behind',
  'false',
];

const validLayoutGrammarValues = new Set(['constructedHub', 'linearRoute', 'loopedDungeon', 'organicCave', 'openKeyedArea', 'hazardIslands', 'floodedIslands', 'fragmentedVertical', 'branchingShafts', 'manorFloorplan']);
const validLayoutRoleValues = new Set(['hub', 'branch', 'loop', 'spoke', 'island', 'threshold', 'deadEnd', 'secretPocket', 'landmark', 'objective', 'transition']);
const validAreaShapeValues = new Set(['rectilinear', 'organic', 'platform', 'clearing', 'chamber', 'shaft', 'bridge', 'fragment', 'hall', 'ledge', 'pool', 'courtyard', 'channel', 'stair']);
const validAreaScaleValues = new Set(['tiny', 'small', 'medium', 'large', 'huge']);
const validOpennessValues = new Set(['enclosed', 'semiOpen', 'open', 'exposed', 'platform']);
const validEnvironmentRoleValues = new Set(['safe', 'hazardAdjacent', 'hazardCrossing', 'flooded', 'elevated', 'collapsed', 'overgrown', 'ritual', 'mechanical', 'natural', 'fortified']);
const validRouteStyleValues = new Set(['corridor', 'trail', 'bridge', 'tunnel', 'ledge', 'channel', 'stair', 'crawl', 'servicePath', 'causeway', 'ford', 'grate']);
const validRouteDifficultyValues = new Set(['clear', 'narrow', 'unstable', 'hidden', 'hazardous', 'blocked']);
const validPremiumMapStatusValues = new Set(['planned', 'available', 'unavailable']);
const validPrintableMapVariantValues = new Set(['standard', 'inkLight', 'highContrast', 'playerHandout']);
const validPremiumMapMimeTypes = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']);
const validPremiumMapMarkerValues = new Set(['treasure', 'hazard', 'secret', 'boss', 'objective', 'custom']);
const validPremiumMapSchematicFootprintShapes = new Set(['ellipse', 'rect']);

function validateOptionalValue(value: string | undefined, validValues: Set<string>, label: string, warnings: DungeonValidationIssue[], roomNumbers?: number[]) {
  if (value && !validValues.has(value)) {
    warnings.push({
      severity: 'warning',
      message: `${label} uses unknown layout metadata value "${value}".`,
      roomNumbers,
    });
  }
}

function validateOptionalValues(values: string | string[] | undefined, validValues: Set<string>, label: string, warnings: DungeonValidationIssue[]) {
  if (!values) {
    return;
  }

  for (const value of Array.isArray(values) ? values : [values]) {
    validateOptionalValue(value, validValues, label, warnings);
  }
}

function connectionKey(from: number, to: number) {
  return [from, to].sort((a, b) => a - b).join('-');
}

function connectionLabel(connection: MapConnection) {
  return `Room ${connection.from} to Room ${connection.to}`;
}

function roomText(room: DungeonRoom) {
  return `${room.exits} ${room.secrets} ${room.gmNotes}`.toLowerCase();
}

function exitRoomReferences(room: DungeonRoom) {
  const refs = new Set<number>();
  const matches = room.exits.matchAll(/\bRoom\s+(\d+)\b/gi);

  for (const match of matches) {
    refs.add(Number(match[1]));
  }

  for (const exit of room.structuredExits) {
    if (exit.toRoomNumber) {
      refs.add(exit.toRoomNumber);
    }
  }

  return refs;
}

function roomMentionsConnection(room: DungeonRoom, targetRoomNumber: number) {
  return room.structuredExits.some((exit) => exit.toRoomNumber === targetRoomNumber) || new RegExp(`\\bRoom\\s+${targetRoomNumber}\\b`, 'i').test(room.exits);
}

function roomMarksSecretConnection(room: DungeonRoom, targetRoomNumber: number) {
  const text = roomText(room);
  const structuredSecretText = room.structuredExits
    .filter((exit) => exit.toRoomNumber === targetRoomNumber)
    .map((exit) => `${exit.type} ${exit.label} ${exit.description ?? ''} ${exit.note ?? ''}`)
    .join(' ')
    .toLowerCase();
  const mentionsTarget = new RegExp(`\\bRoom\\s+${targetRoomNumber}\\b`, 'i').test(text);
  const structuredMarksSecret = hiddenRouteWords.some((word) => structuredSecretText.includes(word));

  return (mentionsTarget && hiddenRouteWords.some((word) => text.includes(word))) || structuredMarksSecret;
}

function validatePositiveNumber(value: number | undefined, label: string, warnings: DungeonValidationIssue[]) {
  if (value !== undefined && (!Number.isFinite(value) || value <= 0)) {
    warnings.push({
      severity: 'warning',
      message: `${label} should be a positive number when premium map metadata is present.`,
    });
  }
}

function validateFiniteNumber(value: number | undefined, label: string, warnings: DungeonValidationIssue[]) {
  if (value !== undefined && !Number.isFinite(value)) {
    warnings.push({
      severity: 'warning',
      message: `${label} should be a finite number when premium map metadata is present.`,
    });
  }
}

function validateViewBox(value: string | undefined, label: string, warnings: DungeonValidationIssue[]) {
  if (!value) {
    return;
  }

  const parts = value.trim().split(/\s+/).map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isFinite(part)) || parts[2] <= 0 || parts[3] <= 0) {
    warnings.push({
      severity: 'warning',
      message: `${label} should be four SVG viewBox numbers with positive width and height.`,
    });
  }
}

function validatePercentNumber(value: number | undefined, label: string, warnings: DungeonValidationIssue[]) {
  if (value !== undefined && (!Number.isFinite(value) || value < 0 || value > 100)) {
    warnings.push({
      severity: 'warning',
      message: `${label} should be a number from 0 to 100 when premium percentage anchors are present.`,
    });
  }
}

function validatePremiumAnchorPosition(anchor: { x?: number; y?: number; xPercent?: number; yPercent?: number }, label: string, warnings: DungeonValidationIssue[]) {
  const hasAbsolutePair = anchor.x !== undefined || anchor.y !== undefined;
  const hasPercentPair = anchor.xPercent !== undefined || anchor.yPercent !== undefined;

  if (hasAbsolutePair) {
    validateFiniteNumber(anchor.x, `${label} x`, warnings);
    validateFiniteNumber(anchor.y, `${label} y`, warnings);

    if (anchor.x === undefined || anchor.y === undefined) {
      warnings.push({
        severity: 'warning',
        message: `${label} should provide both x and y when using absolute premium map anchors.`,
      });
    }
  }

  if (hasPercentPair) {
    validatePercentNumber(anchor.xPercent, `${label} xPercent`, warnings);
    validatePercentNumber(anchor.yPercent, `${label} yPercent`, warnings);

    if (anchor.xPercent === undefined || anchor.yPercent === undefined) {
      warnings.push({
        severity: 'warning',
        message: `${label} should provide both xPercent and yPercent when using percentage premium map anchors.`,
      });
    }
  }

  if (!hasAbsolutePair && !hasPercentPair) {
    warnings.push({
      severity: 'warning',
      message: `${label} should provide either x/y or xPercent/yPercent.`,
    });
  }
}

function validatePremiumMapAsset(asset: PremiumMapImageAsset | undefined, label: string, warnings: DungeonValidationIssue[]) {
  if (!asset) {
    return;
  }

  if (!asset.id?.trim()) {
    warnings.push({ severity: 'warning', message: `${label} is missing a stable asset id.` });
  }

  if (!asset.url?.trim()) {
    warnings.push({ severity: 'warning', message: `${label} is missing an image URL or path.` });
  }

  validatePositiveNumber(asset.width, `${label} width`, warnings);
  validatePositiveNumber(asset.height, `${label} height`, warnings);
  validatePositiveNumber(asset.dpi, `${label} dpi`, warnings);

  if (asset.mimeType && !validPremiumMapMimeTypes.has(asset.mimeType)) {
    warnings.push({
      severity: 'warning',
      message: `${label} uses unsupported mimeType "${asset.mimeType}".`,
    });
  }
}

function validatePremiumMapOverlay(overlay: PremiumMapOverlay | undefined, label: string, roomsByNumber: Map<number, DungeonRoom>, warnings: DungeonValidationIssue[]) {
  if (!overlay) {
    return;
  }

  validateViewBox(overlay.viewBox, `${label} viewBox`, warnings);

  for (const anchor of overlay.labelAnchors ?? []) {
    if (!roomsByNumber.has(anchor.roomNumber)) {
      warnings.push({
        severity: 'warning',
        message: `${label} label anchor references missing Room ${anchor.roomNumber}.`,
        roomNumbers: [anchor.roomNumber],
      });
    }
    validatePremiumAnchorPosition(anchor, `${label} label anchor for Room ${anchor.roomNumber}`, warnings);
  }

  for (const anchor of overlay.markerAnchors ?? []) {
    if (!roomsByNumber.has(anchor.roomNumber)) {
      warnings.push({
        severity: 'warning',
        message: `${label} marker anchor references missing Room ${anchor.roomNumber}.`,
        roomNumbers: [anchor.roomNumber],
      });
    }
    validatePremiumAnchorPosition(anchor, `${label} marker anchor for Room ${anchor.roomNumber}`, warnings);

    if (!validPremiumMapMarkerValues.has(anchor.marker)) {
      warnings.push({
        severity: 'warning',
        message: `${label} marker anchor for Room ${anchor.roomNumber} uses unsupported marker "${anchor.marker}".`,
        roomNumbers: [anchor.roomNumber],
      });
    }
  }

  for (const route of overlay.routeOverlayPaths ?? []) {
    if (!roomsByNumber.has(route.from) || !roomsByNumber.has(route.to)) {
      warnings.push({
        severity: 'warning',
        message: `${label} route overlay references a missing room number.`,
        roomNumbers: [route.from, route.to],
      });
    }
    if (!route.path?.trim()) {
      warnings.push({
        severity: 'warning',
        message: `${label} route overlay for Room ${route.from} to Room ${route.to} is missing a path.`,
        roomNumbers: [route.from, route.to],
      });
    }
  }
}

function validatePremiumMapLabelCoverage(overlay: PremiumMapOverlay | undefined, label: string, roomsByNumber: Map<number, DungeonRoom>, warnings: DungeonValidationIssue[]) {
  if (!overlay?.labelAnchors?.length) {
    return;
  }

  const anchoredRooms = new Set(overlay.labelAnchors.map((anchor) => anchor.roomNumber));
  const missingRoomNumbers = [...roomsByNumber.keys()].filter((roomNumber) => !anchoredRooms.has(roomNumber));

  if (missingRoomNumbers.length) {
    warnings.push({
      severity: 'warning',
      message: `${label} label anchors are missing room numbers that exist in dungeon content: ${missingRoomNumbers.join(', ')}.`,
      roomNumbers: missingRoomNumbers,
    });
  }
}

function validatePremiumMapSchematicFootprints(premiumMap: PremiumMapMetadata, roomsByNumber: Map<number, DungeonRoom>, warnings: DungeonValidationIssue[]) {
  const footprints = premiumMap.schematicFootprints ?? [];
  for (const footprint of footprints) {
    if (!roomsByNumber.has(footprint.roomNumber)) {
      warnings.push({
        severity: 'warning',
        message: `Premium schematic footprint references missing Room ${footprint.roomNumber}.`,
        roomNumbers: [footprint.roomNumber],
      });
    }

    validateOptionalValue(footprint.shape, validPremiumMapSchematicFootprintShapes, `Premium schematic footprint shape for Room ${footprint.roomNumber}`, warnings, [footprint.roomNumber]);
    validatePremiumAnchorPosition(footprint, `Premium schematic footprint for Room ${footprint.roomNumber}`, warnings);
    validatePercentNumber(footprint.widthPercent, `Premium schematic footprint widthPercent for Room ${footprint.roomNumber}`, warnings);
    validatePercentNumber(footprint.heightPercent, `Premium schematic footprint heightPercent for Room ${footprint.roomNumber}`, warnings);
    validateFiniteNumber(footprint.rotation, `Premium schematic footprint rotation for Room ${footprint.roomNumber}`, warnings);
  }
}

function validatePremiumMapMetadata(premiumMap: PremiumMapMetadata | undefined, roomsByNumber: Map<number, DungeonRoom>, warnings: DungeonValidationIssue[]) {
  if (!premiumMap) {
    return;
  }

  validateOptionalValue(premiumMap.status, validPremiumMapStatusValues, 'Premium map status', warnings);
  validateOptionalValue(premiumMap.printableMapVariant, validPrintableMapVariantValues, 'Premium printableMapVariant', warnings);
  validatePremiumMapAsset(premiumMap.baseMapImage, 'Premium baseMapImage', warnings);
  validatePremiumMapAsset(premiumMap.gmBaseMapImage, 'Premium gmBaseMapImage', warnings);
  validatePremiumMapAsset(premiumMap.playerBaseMapImage, 'Premium playerBaseMapImage', warnings);
  validatePositiveNumber(premiumMap.imageSize?.width, 'Premium imageSize width', warnings);
  validatePositiveNumber(premiumMap.imageSize?.height, 'Premium imageSize height', warnings);
  validateViewBox(premiumMap.overlayViewBox, 'Premium overlayViewBox', warnings);
  validatePositiveNumber(premiumMap.mapBounds?.width, 'Premium mapBounds width', warnings);
  validatePositiveNumber(premiumMap.mapBounds?.height, 'Premium mapBounds height', warnings);
  validatePremiumMapOverlay(premiumMap.gmOverlay, 'Premium gmOverlay', roomsByNumber, warnings);
  validatePremiumMapOverlay(premiumMap.playerOverlay, 'Premium playerOverlay', roomsByNumber, warnings);
  validatePremiumMapLabelCoverage(premiumMap.gmOverlay, 'Premium gmOverlay', roomsByNumber, warnings);
  validatePremiumMapLabelCoverage(premiumMap.playerOverlay, 'Premium playerOverlay', roomsByNumber, warnings);
  validatePremiumMapSchematicFootprints(premiumMap, roomsByNumber, warnings);

  if (premiumMap.status === 'available' && !premiumMap.baseMapImage && !premiumMap.gmBaseMapImage && !premiumMap.playerBaseMapImage) {
    warnings.push({
      severity: 'warning',
      message: 'Premium map is marked available but does not include a baseMapImage, gmBaseMapImage, or playerBaseMapImage.',
    });
  }

  if (premiumMap.playerBaseMapImage && !premiumMap.baseMapImage && !premiumMap.gmBaseMapImage) {
    warnings.push({
      severity: 'warning',
      message: 'Premium playerBaseMapImage is present without a GM/shared illustrated base map.',
    });
  }
}

export function validateDungeon(dungeon: Dungeon): DungeonValidationResult {
  const errors: DungeonValidationIssue[] = [];
  const warnings: DungeonValidationIssue[] = [];
  const roomsByNumber = new Map(dungeon.rooms.map((room) => [room.number, room]));
  const seenConnectionKeys = new Set<string>();
  const connectedPairs = new Set<string>();
  const connections = dungeon.map.connections ?? [];

  validateOptionalValues(dungeon.map.layout?.grammar, validLayoutGrammarValues, 'Map layout grammar', warnings);
  validatePremiumMapMetadata(dungeon.map.premiumMap, roomsByNumber, warnings);

  if (connections.length === 0) {
    warnings.push({
      severity: 'warning',
      message: 'No map.connections metadata found. Room exit text cannot be validated against the map.',
    });
  }

  for (const connection of connections) {
    const fromRoom = roomsByNumber.get(connection.from);
    const toRoom = roomsByNumber.get(connection.to);
    const key = connectionKey(connection.from, connection.to);
    const typedKey = `${key}-${connection.type}`;

    if (!fromRoom || !toRoom) {
      errors.push({
        severity: 'error',
        message: `${connectionLabel(connection)} references a room number that does not exist.`,
        roomNumbers: [connection.from, connection.to],
      });
      continue;
    }

    if (seenConnectionKeys.has(typedKey)) {
      errors.push({
        severity: 'error',
        message: `${connectionLabel(connection)} has a duplicate ${connection.type} connection.`,
        roomNumbers: [connection.from, connection.to],
      });
    }

    seenConnectionKeys.add(typedKey);
    connectedPairs.add(key);

    if (!connection.path?.trim()) {
      warnings.push({
        severity: 'warning',
        message: `${connectionLabel(connection)} is missing a visual route path for the prototype map renderer.`,
        roomNumbers: [connection.from, connection.to],
      });
    }

    validateOptionalValue(connection.routeStyle, validRouteStyleValues, `${connectionLabel(connection)} routeStyle`, warnings, [connection.from, connection.to]);
    validateOptionalValue(connection.routeDifficulty, validRouteDifficultyValues, `${connectionLabel(connection)} routeDifficulty`, warnings, [connection.from, connection.to]);

    if (!fromRoom.structuredExits.some((exit) => exit.toRoomNumber === connection.to)) {
      warnings.push({
        severity: 'warning',
        message: `Room ${connection.from} is missing a structured exit to Room ${connection.to}.`,
        roomNumbers: [connection.from, connection.to],
      });
    }

    if (!connection.oneWay && !toRoom.structuredExits.some((exit) => exit.toRoomNumber === connection.from)) {
      warnings.push({
        severity: 'warning',
        message: `Room ${connection.to} is missing a structured exit to Room ${connection.from}.`,
        roomNumbers: [connection.to, connection.from],
      });
    }

    if (connection.type === 'normal') {
      const fromMentionsTo = roomMentionsConnection(fromRoom, connection.to);
      const toMentionsFrom = roomMentionsConnection(toRoom, connection.from);

      if (!fromMentionsTo || (!connection.oneWay && !toMentionsFrom)) {
        warnings.push({
          severity: 'warning',
          message: `${connectionLabel(connection)} is a normal connection, but ${!fromMentionsTo && !toMentionsFrom ? 'neither room mentions the other' : !fromMentionsTo ? `Room ${connection.from} does not mention Room ${connection.to}` : `Room ${connection.to} does not mention Room ${connection.from}`}.`,
          roomNumbers: [connection.from, connection.to],
        });
      }
    }

    if (connection.type === 'secret') {
      const secretMarked = roomMarksSecretConnection(fromRoom, connection.to) || roomMarksSecretConnection(toRoom, connection.from);

      if (!secretMarked) {
        warnings.push({
          severity: 'warning',
          message: `${connectionLabel(connection)} is secret, but neither relevant room clearly marks it as hidden, secret, concealed, collapsed, crawlspace, or similar.`,
          roomNumbers: [connection.from, connection.to],
        });
      }
    }
  }

  for (const room of dungeon.rooms) {
    validateOptionalValue(room.layoutRole, validLayoutRoleValues, `Room ${room.number} layoutRole`, warnings, [room.number]);
    validateOptionalValue(room.areaShape, validAreaShapeValues, `Room ${room.number} areaShape`, warnings, [room.number]);
    validateOptionalValue(room.areaScale, validAreaScaleValues, `Room ${room.number} areaScale`, warnings, [room.number]);
    validateOptionalValue(room.openness, validOpennessValues, `Room ${room.number} openness`, warnings, [room.number]);
    validateOptionalValue(room.environmentRole, validEnvironmentRoleValues, `Room ${room.number} environmentRole`, warnings, [room.number]);

    for (const targetRoomNumber of exitRoomReferences(room)) {
      if (!roomsByNumber.has(targetRoomNumber)) {
        errors.push({
          severity: 'error',
          message: `Room ${room.number} exits mention missing Room ${targetRoomNumber}.`,
          roomNumbers: [room.number, targetRoomNumber],
        });
        continue;
      }

      if (targetRoomNumber === room.number) {
        warnings.push({
          severity: 'warning',
          message: `Room ${room.number} exits mention itself.`,
          roomNumbers: [room.number],
        });
        continue;
      }

      if (!connectedPairs.has(connectionKey(room.number, targetRoomNumber))) {
        warnings.push({
          severity: 'warning',
          message: `Room ${room.number} exits mention Room ${targetRoomNumber}, but map.connections does not include that link.`,
          roomNumbers: [room.number, targetRoomNumber],
        });
      }
    }
  }

  return {
    dungeonId: dungeon.id,
    dungeonTitle: dungeon.title,
    errors,
    warnings,
    valid: errors.length === 0 && warnings.length === 0,
  };
}

export function validateDungeons(dungeons: Dungeon[]) {
  return dungeons.map((dungeon) => validateDungeon(dungeon));
}
