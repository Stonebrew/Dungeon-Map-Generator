import type { Dungeon } from '../types';
import { DungeonMap } from './DungeonMap';
import { Panel, SectionHeader } from './Badge';

export function PlayerMapView({ dungeon, premiumUnlocked }: { dungeon: Dungeon; premiumUnlocked: boolean }) {
  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow={dungeon.date}
        title="Player Safe View"
        text="A clean map handout that hides traps, treasure, secret doors, room notes, and GM-only information."
      />
      <DungeonMap mode="player" mapStyle={dungeon.mapStyle} colorEnabled={premiumUnlocked} />
      <Panel>
        <h3 className="font-serif text-2xl font-bold">Visible To Players</h3>
        <p className="mt-3 text-sm leading-6 text-ink/75">
          The tollhouse entrance, explored corridors, obvious doors, water channels, and room outlines are visible. Hidden routes, trap marks, treasure labels, and final-room clues are withheld.
        </p>
      </Panel>
    </div>
  );
}
