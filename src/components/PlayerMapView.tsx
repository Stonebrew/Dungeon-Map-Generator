import { useState } from 'react';
import type { Dungeon } from '../types';
import { DungeonMap } from './DungeonMap';
import { Panel, SectionHeader } from './Badge';

export function PlayerMapView({ dungeon, premiumUnlocked }: { dungeon: Dungeon; premiumUnlocked: boolean }) {
  const [showRoomNumbers, setShowRoomNumbers] = useState(true);
  const playerSafeDescription =
    dungeon.map.playerSafe.description ??
    `${dungeon.title} is shown as a player-safe ${dungeon.theme.toLowerCase()} map. Obvious rooms and routes are visible, while GM-only secrets and hidden rewards stay off the handout.`;

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow={dungeon.date}
        title="Player Safe View"
        text="A clean map handout that hides traps, treasure, secret doors, room notes, and GM-only information."
      />
      <Panel className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-serif text-xl font-bold">Player Map Labels</h3>
          <p className="mt-1 text-sm leading-6 text-ink/65">Turn room numbers off for a clean player-facing handout.</p>
        </div>
        <label className="inline-flex items-center gap-3 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-bold text-ink">
          <input
            type="checkbox"
            checked={showRoomNumbers}
            onChange={(event) => setShowRoomNumbers(event.target.checked)}
            className="h-4 w-4 accent-ember"
          />
          Show room numbers
        </label>
      </Panel>
      <DungeonMap mode="player" mapData={dungeon.map} mapStyle={dungeon.mapStyle} colorEnabled={premiumUnlocked} playerLabelsVisible={showRoomNumbers} />
      <Panel>
        <h3 className="font-serif text-2xl font-bold">Visible To Players</h3>
        <p className="mt-3 text-sm leading-6 text-ink/75">{playerSafeDescription}</p>
        <p className="mt-3 text-sm leading-6 text-ink/65">Hidden routes, trap marks, treasure labels, and GM-only notes are withheld.</p>
      </Panel>
    </div>
  );
}
