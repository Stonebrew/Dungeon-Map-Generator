import { ArrowLeft, Bookmark, ChevronLeft, ChevronRight, Lock, MapPin } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { Dungeon, Room, TierId } from '../types';
import { canAccessFeature } from '../lib/entitlements';
import { Badge, Field, Panel } from './Badge';
import { DungeonMap } from './DungeonMap';
import { EncounterTablesSection } from './EncounterTable';

const quickSections = [
  { id: 'read-aloud', label: 'Read Aloud' },
  { id: 'gm-notes', label: 'GM Notes' },
  { id: 'inhabitants', label: 'Inhabitants' },
  { id: 'treasure', label: 'Treasure' },
  { id: 'secrets', label: 'Secrets' },
  { id: 'exits', label: 'Exits' },
  { id: 'encounter-tables', label: 'Encounter Tables' },
];

function threatTone(threat: string) {
  if (threat === 'Severe') return 'danger';
  if (threat === 'High') return 'warning';
  if (threat === 'Moderate') return 'success';
  return 'neutral';
}

function scrollToRunSection(sectionId: string) {
  window.requestAnimationFrame(() => {
    document.getElementById(`run-${sectionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function RunSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={`run-${id}`} className="scroll-mt-28 rounded-md border border-ink/10 bg-parchment/55 p-3">
      <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45">{title}</h3>
      <div className="mt-2 text-sm leading-6 text-ink/75">{children}</div>
    </section>
  );
}

function CurrentRoomPanel({ room }: { room: Room }) {
  return (
    <Panel className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ember">Current Room {room.number}</p>
          <h2 className="font-serif text-3xl font-bold leading-tight">{room.name}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={threatTone(room.threat)}>{room.threat}</Badge>
          {room.tags.slice(0, 3).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>

      <RunSection id="read-aloud" title="Read Aloud">
        <p className="border-l-4 border-brass/50 pl-3">{room.readAloud}</p>
      </RunSection>

      <RunSection id="gm-notes" title="GM Notes">
        <p>{room.gmNotes}</p>
      </RunSection>

      <RunSection id="inhabitants" title="Inhabitants">
        {room.inhabitants.length > 0 ? (
          <div className="space-y-3">
            {room.inhabitants.map((inhabitant) => (
              <div key={inhabitant.name} className="rounded-md border border-ink/10 bg-white p-3">
                <h4 className="font-bold text-ink">{inhabitant.name}</h4>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <Field compact label="Role" value={inhabitant.role} />
                  <Field compact label="Threat" value={inhabitant.threat} />
                  <Field compact label="Durability" value={inhabitant.durability} />
                  <Field compact label="Damage" value={inhabitant.damage} />
                  <Field compact label="Tactics" value={inhabitant.tactics} />
                  <Field compact label="Morale" value={inhabitant.morale} />
                  <Field compact label="Wants" value={inhabitant.wants} />
                  <Field compact label="Leverage" value={inhabitant.leverage} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No fixed inhabitants.</p>
        )}
      </RunSection>

      <div className="grid gap-3 lg:grid-cols-3">
        <RunSection id="treasure" title="Treasure">
          <p>{room.treasure}</p>
        </RunSection>
        <RunSection id="secrets" title="Secrets">
          <p>{room.secrets}</p>
        </RunSection>
        <RunSection id="exits" title="Exits">
          <p>{room.exits}</p>
        </RunSection>
      </div>
    </Panel>
  );
}

export function RunMode({
  dungeon,
  tier,
  isSaved,
  onToggleFavorite,
  onLockedFeature,
  onExit,
}: {
  dungeon: Dungeon;
  tier: TierId;
  isSaved: boolean;
  onToggleFavorite: () => void;
  onLockedFeature: (feature: 'favorite') => void;
  onExit: () => void;
}) {
  const [currentRoomNumber, setCurrentRoomNumber] = useState(dungeon.rooms[0]?.number ?? 1);
  const hasColorMap = canAccessFeature(tier, 'colorMap');
  const hasFavorite = canAccessFeature(tier, 'favorite');
  const currentIndex = useMemo(
    () => Math.max(0, dungeon.rooms.findIndex((room) => room.number === currentRoomNumber)),
    [dungeon.rooms, currentRoomNumber],
  );
  const currentRoom = dungeon.rooms[currentIndex] ?? dungeon.rooms[0];
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < dungeon.rooms.length - 1;

  useEffect(() => {
    setCurrentRoomNumber(dungeon.rooms[0]?.number ?? 1);
  }, [dungeon.id, dungeon.rooms]);

  const selectRoom = (roomNumber: number) => {
    setCurrentRoomNumber(roomNumber);
    window.requestAnimationFrame(() => {
      document.getElementById('run-current-room')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const moveRoom = (direction: -1 | 1) => {
    const nextRoom = dungeon.rooms[currentIndex + direction];
    if (nextRoom) {
      selectRoom(nextRoom.number);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Badge tone="danger">Run Mode</Badge>
          <h1 className="mt-2 font-serif text-3xl font-bold leading-tight sm:text-4xl">{dungeon.title}</h1>
          <p className="mt-1 text-sm font-semibold text-ink/55">Live table view focused on one room at a time.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => (hasFavorite ? onToggleFavorite() : onLockedFeature('favorite'))}
            className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-bold shadow-tool ${
              hasFavorite ? 'bg-brass text-white hover:bg-brass/90' : 'bg-ink/10 text-ink/45 hover:bg-ink/15'
            }`}
          >
            {hasFavorite ? <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-white' : ''}`} aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
            {isSaved ? 'Saved' : 'Save'}
          </button>
          <button type="button" onClick={onExit} className="inline-flex items-center justify-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-bold text-ink/70 shadow-tool">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Return to App
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
        <div className="space-y-4">
          <DungeonMap mode="gm" mapData={dungeon.map} mapStyle={dungeon.mapStyle} colorEnabled={hasColorMap} compact showLegend />

          <Panel className="p-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-xl font-bold">Room Quick Jump</h2>
              <Badge tone="accent">{currentIndex + 1} / {dungeon.rooms.length}</Badge>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {dungeon.rooms.map((room) => {
                const active = room.number === currentRoom.number;
                return (
                  <button
                    key={room.number}
                    type="button"
                    onClick={() => selectRoom(room.number)}
                    className={`rounded-md border p-2 text-left text-sm ${
                      active ? 'border-ember bg-ember text-white shadow-tool' : 'border-ink/10 bg-parchment/60 text-ink/75 hover:bg-parchment'
                    }`}
                  >
                    <span className="flex items-start justify-between gap-2">
                      <span className="font-bold">
                        {room.number}. {room.name}
                      </span>
                      <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${active ? 'bg-white/20 text-white' : 'bg-white text-ink/55'}`}>
                        {room.threat}
                      </span>
                    </span>
                    {room.tags[0] && <span className={`mt-1 block text-xs ${active ? 'text-white/75' : 'text-ink/50'}`}>{room.tags[0]}</span>}
                  </button>
                );
              })}
            </div>
          </Panel>
        </div>

        <div id="run-current-room" className="scroll-mt-24 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={!canGoPrevious}
              onClick={() => moveRoom(-1)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white disabled:bg-ink/10 disabled:text-ink/40"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Previous Room
            </button>
            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => moveRoom(1)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white disabled:bg-ink/10 disabled:text-ink/40"
            >
              Next Room
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {quickSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToRunSection(section.id)}
                className="inline-flex shrink-0 items-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-xs font-bold text-ink/65 shadow-tool hover:bg-parchment"
              >
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {section.label}
              </button>
            ))}
          </div>

          <CurrentRoomPanel room={currentRoom} />

          <section id="run-encounter-tables" className="scroll-mt-28">
            <EncounterTablesSection tables={dungeon.encounterTables} embedded />
          </section>
        </div>
      </div>
    </div>
  );
}
