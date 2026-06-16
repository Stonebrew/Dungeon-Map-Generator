import { ArrowLeft, BookOpenText, Bookmark, ChevronLeft, ChevronRight, Coins, DoorOpen, EyeOff, Lock, MapPin, ScrollText, ShieldAlert, UsersRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { Dungeon, Room, TierId } from '../types';
import { canAccessDungeonFeature, canAccessFeature } from '../lib/entitlements';
import { Badge, Field, Panel } from './Badge';
import { DungeonMap } from './DungeonMap';
import { EncounterTablesSection } from './EncounterTable';

const quickSections = [
  { id: 'read-aloud', label: 'Read', icon: BookOpenText },
  { id: 'gm-notes', label: 'Notes', icon: ScrollText },
  { id: 'inhabitants', label: 'Inhabitants', icon: UsersRound },
  { id: 'treasure', label: 'Treasure', icon: Coins },
  { id: 'secrets', label: 'Secrets', icon: EyeOff },
  { id: 'exits', label: 'Exits', icon: DoorOpen },
  { id: 'encounter-tables', label: 'Tables', icon: ShieldAlert },
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

function RunSection({
  id,
  title,
  icon,
  accent = false,
  children,
}: {
  id: string;
  title: string;
  icon: ReactNode;
  accent?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={`run-${id}`} className={`scroll-mt-32 rounded-md border p-3 ${accent ? 'border-ember/25 bg-ember/[0.07]' : 'border-slatewood/20 bg-[#fbfaf5]'}`}>
      <h3 className="ledger-label flex items-center gap-2 text-xs font-bold uppercase text-ink/50">
        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${accent ? 'bg-ember/10 text-ember' : 'bg-slatewood/10 text-slatewood'}`}>{icon}</span>
        {title}
      </h3>
      <div className="mt-2 text-[15px] leading-7 text-ink/75 sm:text-sm sm:leading-6">{children}</div>
    </section>
  );
}

function CurrentRoomPanel({ room }: { room: Room }) {
  return (
    <Panel className="space-y-3 p-3 sm:p-4">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slatewood/20 pb-3">
        <div>
          <p className="ledger-label inline-flex items-center gap-2 text-xs font-bold uppercase text-ember">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            Players Here: Room {room.number}
          </p>
          <h2 className="survey-title font-serif text-3xl font-bold leading-tight">{room.name}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={threatTone(room.threat)}>{room.threat}</Badge>
          {room.tags.slice(0, 3).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>

      <RunSection id="read-aloud" title="Read Aloud" icon={<BookOpenText className="h-4 w-4" aria-hidden="true" />} accent>
        <p className="border-l-4 border-slatewood/35 pl-3 font-medium text-ink/80">{room.readAloud}</p>
      </RunSection>

      <RunSection id="gm-notes" title="GM Notes" icon={<ScrollText className="h-4 w-4" aria-hidden="true" />}>
        <p>{room.gmNotes}</p>
      </RunSection>

      <RunSection id="inhabitants" title="Inhabitants" icon={<UsersRound className="h-4 w-4" aria-hidden="true" />}>
        {room.inhabitants.length > 0 ? (
          <div className="space-y-3">
            {room.inhabitants.map((inhabitant) => (
              <div key={inhabitant.name} className="rounded-md border border-slatewood/20 bg-[#fbfaf5] p-3">
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
        <RunSection id="treasure" title="Treasure" icon={<Coins className="h-4 w-4" aria-hidden="true" />}>
          <p>{room.treasure}</p>
        </RunSection>
        <RunSection id="secrets" title="Secrets" icon={<EyeOff className="h-4 w-4" aria-hidden="true" />}>
          <p>{room.secrets}</p>
        </RunSection>
        <RunSection id="exits" title="Exits" icon={<DoorOpen className="h-4 w-4" aria-hidden="true" />} accent>
          <p className="font-semibold text-ink/80">{room.exits}</p>
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
  const hasColorMap = canAccessDungeonFeature(tier, dungeon, 'colorMap');
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
      <div className="paper-panel field-corner rounded-md border border-slatewood/20 p-3 shadow-tool sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Badge tone="danger">Live Table Mode</Badge>
          <h1 className="survey-title mt-2 font-serif text-3xl font-bold leading-tight sm:text-4xl">{dungeon.title}</h1>
          <p className="mt-1 text-sm font-semibold text-ink/55">
            Room {currentRoom.number}: {currentRoom.name} · {currentRoom.exits}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => (hasFavorite ? onToggleFavorite() : onLockedFeature('favorite'))}
            className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-bold shadow-tool ${
              hasFavorite ? 'bg-slatewood text-white hover:bg-slatewood/90' : 'bg-ink/10 text-ink/45 hover:bg-ink/15'
            }`}
          >
            {hasFavorite ? <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-white' : ''}`} aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
            {isSaved ? 'Saved' : 'Save'}
          </button>
          <button type="button" onClick={onExit} className="inline-flex items-center justify-center gap-2 rounded-md border border-slatewood/20 bg-white px-3 py-2 text-sm font-bold text-ink/70 shadow-tool">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Return to App
          </button>
        </div>
        </div>
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
        <div className="min-w-0 space-y-4">
          <div className="min-w-0 max-w-full overflow-hidden">
            <DungeonMap mode="gm" mapData={dungeon.map} mapStyle={dungeon.mapStyle} colorEnabled={hasColorMap} compact showLegend />
          </div>

          <Panel className="sticky top-3 z-10 p-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="survey-title font-serif text-xl font-bold">Room Quick Jump</h2>
              <Badge tone="accent">{currentIndex + 1} / {dungeon.rooms.length}</Badge>
            </div>
            <div className="mt-3 grid max-h-[28rem] gap-2 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-1">
              {dungeon.rooms.map((room) => {
                const active = room.number === currentRoom.number;
                return (
                  <button
                    key={room.number}
                    type="button"
                    onClick={() => selectRoom(room.number)}
                    className={`rounded-md border p-3 text-left text-[15px] leading-5 sm:p-2 sm:text-sm ${
                      active ? 'border-slatewood bg-slatewood text-white shadow-tool ring-2 ring-slatewood/20' : 'border-slatewood/20 bg-[#fbfaf5] text-ink/75 hover:bg-slatewood/10'
                    }`}
                  >
                    <span className="flex items-start justify-between gap-2">
                      <span className="font-bold">
                        {room.number}. {room.name}
                      </span>
                      <span className={`status-tag rounded-[3px] border-l-2 px-2 py-0.5 text-[11px] font-black ${active ? 'border-l-white/45 bg-white/20 text-white/80' : 'border-l-slatewood/30 bg-slatewood/[0.045] text-ink/55'}`}>
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

        <div id="run-current-room" className="min-w-0 scroll-mt-24 space-y-4">
          <div className="sticky top-0 z-20 rounded-md border border-slatewood/20 bg-[#fbfaf5]/95 p-2 shadow-tool backdrop-blur">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={!canGoPrevious}
              onClick={() => moveRoom(-1)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ink px-3 py-2.5 text-sm font-bold text-white disabled:bg-ink/10 disabled:text-ink/40 sm:min-h-11 sm:py-2"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span>
                    <span className="ledger-label block text-[11px] uppercase opacity-70">Previous</span>
                <span>Room</span>
              </span>
            </button>
            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => moveRoom(1)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ink px-3 py-2.5 text-sm font-bold text-white disabled:bg-ink/10 disabled:text-ink/40 sm:min-h-11 sm:py-2"
            >
              <span>
                <span className="ledger-label block text-[11px] uppercase opacity-70">Next</span>
                <span>Room</span>
              </span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {quickSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToRunSection(section.id)}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-slatewood/20 bg-white px-3.5 py-2.5 text-sm font-bold text-ink/65 shadow-tool hover:bg-slatewood/10 sm:min-h-10 sm:px-3 sm:py-2 sm:text-xs"
              >
                <section.icon className="h-3.5 w-3.5" aria-hidden="true" />
                {section.label}
              </button>
            ))}
          </div>
          </div>

          <CurrentRoomPanel room={currentRoom} />

          <section id="run-encounter-tables" className="scroll-mt-28">
            <details className="paper-panel rounded-md border border-slatewood/20 p-3 shadow-tool">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                <span>
                  <span className="ledger-label flex items-center gap-2 text-xs font-bold uppercase text-ember">
                    <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                    Encounter Tables
                  </span>
                  <span className="mt-1 block text-sm text-ink/60">Open when the table needs motion, pressure, or complications.</span>
                </span>
                <Badge tone="accent">d6 tables</Badge>
              </summary>
              <div className="mt-3 border-t border-slatewood/20 pt-3">
                <EncounterTablesSection tables={dungeon.encounterTables} embedded />
              </div>
            </details>
          </section>
        </div>
      </div>
    </div>
  );
}
