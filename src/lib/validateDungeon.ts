import type { Dungeon, DungeonRoom, MapConnection } from '../types';

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

export function validateDungeon(dungeon: Dungeon): DungeonValidationResult {
  const errors: DungeonValidationIssue[] = [];
  const warnings: DungeonValidationIssue[] = [];
  const roomsByNumber = new Map(dungeon.rooms.map((room) => [room.number, room]));
  const seenConnectionKeys = new Set<string>();
  const connectedPairs = new Set<string>();
  const connections = dungeon.map.connections ?? [];

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
