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
        title="Saved Dungeons"
        text="Browse sample dungeons and favorites saved during this session."
      />

      <Panel className="border-brass/35 p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge tone="warning">Session archive</Badge>
            <p className="mt-2 text-sm leading-6 text-ink/65">Favorites are saved for this testing session, so you can compare packets without leaving the app.</p>
          </div>
          <Badge tone="accent">{savedDungeonIds.size} saved this session</Badge>
        </div>
      </Panel>

      <div className="grid gap-3 xl:grid-cols-2">
        {dungeons.map((dungeon) => {
          const active = dungeon.id === currentDungeonId;
          const saved = savedDungeonIds.has(dungeon.id);

          return (
            <article key={dungeon.id} className={`paper-panel field-corner rounded-md border p-4 shadow-tool ${active ? 'border-ember ring-1 ring-ember/15' : 'border-slatewood/20'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={active ? 'danger' : 'neutral'}>{active ? 'Selected' : dungeon.date}</Badge>
                    {saved && <Badge tone="success">Favorite</Badge>}
                  </div>
                  <h2 className="survey-title mt-2 font-serif text-2xl font-bold leading-tight">{dungeon.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-ink/65">{dungeon.hook}</p>
                </div>
                {saved && <Bookmark className="h-5 w-5 shrink-0 fill-brass text-brass" aria-hidden="true" />}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-black text-ink/65">
                <span className="catalog-tag px-2 py-1.5">{dungeon.theme}</span>
                <span className="catalog-tag px-2 py-1.5">{dungeon.difficulty}</span>
                <span className="catalog-tag px-2 py-1.5">{dungeon.partySize}</span>
                <span className="catalog-tag px-2 py-1.5">{dungeon.estimatedPlayTime}</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onSelectDungeon(dungeon.id)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slatewood/20 bg-white px-3 py-2 text-sm font-bold text-ink/70 shadow-sm transition hover:bg-slatewood/10"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Select
                </button>
                <button
                  type="button"
                  onClick={() => onRunDungeon(dungeon.id)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-ember bg-ember px-3 py-2 text-sm font-bold text-white shadow-tool transition hover:bg-ember/90"
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
