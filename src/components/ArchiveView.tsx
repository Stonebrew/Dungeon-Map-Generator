import { Bookmark, Play, RotateCcw } from 'lucide-react';
import type { Dungeon } from '../types';
import { Badge, Panel, SectionHeader } from './Badge';

export function ArchiveView({
  dungeons,
  savedDungeonIds,
  currentDungeonId,
  onSelectDungeon,
  onRunDungeon,
}: {
  dungeons: Dungeon[];
  savedDungeonIds: Set<string>;
  currentDungeonId: string;
  onSelectDungeon: (dungeonId: string) => void;
  onRunDungeon: (dungeonId: string) => void;
}) {
  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Archive"
        title="Mock Dungeon Archive"
        text="Prototype-only archive surface using the existing mock dungeons. Real saved dungeon storage is not implemented yet."
      />

      <Panel className="border-brass/35 p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge tone="warning">Mock data</Badge>
            <p className="mt-2 text-sm leading-6 text-ink/65">Favorites only last until the page refreshes. Later this view can connect to account storage and daily dungeon history.</p>
          </div>
          <Badge tone="accent">{savedDungeonIds.size} saved this session</Badge>
        </div>
      </Panel>

      <div className="grid gap-3 xl:grid-cols-2">
        {dungeons.map((dungeon) => {
          const active = dungeon.id === currentDungeonId;
          const saved = savedDungeonIds.has(dungeon.id);

          return (
            <article key={dungeon.id} className={`rounded-md border bg-white p-4 shadow-tool ${active ? 'border-ember' : 'border-ink/10'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={active ? 'danger' : 'neutral'}>{active ? 'Selected' : dungeon.date}</Badge>
                    {saved && <Badge tone="success">Favorite</Badge>}
                  </div>
                  <h2 className="mt-2 font-serif text-2xl font-bold leading-tight">{dungeon.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-ink/65">{dungeon.hook}</p>
                </div>
                {saved && <Bookmark className="h-5 w-5 shrink-0 fill-brass text-brass" aria-hidden="true" />}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-bold text-ink/65">
                <span className="rounded-md bg-parchment px-2 py-2">{dungeon.theme}</span>
                <span className="rounded-md bg-parchment px-2 py-2">{dungeon.difficulty}</span>
                <span className="rounded-md bg-parchment px-2 py-2">{dungeon.partySize}</span>
                <span className="rounded-md bg-parchment px-2 py-2">{dungeon.estimatedPlayTime}</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onSelectDungeon(dungeon.id)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-bold text-ink/70 hover:bg-parchment"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Select
                </button>
                <button
                  type="button"
                  onClick={() => onRunDungeon(dungeon.id)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ember px-3 py-2 text-sm font-bold text-white hover:bg-ember/90"
                >
                  <Play className="h-4 w-4" aria-hidden="true" />
                  Run
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
