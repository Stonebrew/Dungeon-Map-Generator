import { useEffect, useState } from 'react';
import { FileDown, Lock, Printer } from 'lucide-react';
import type { Dungeon, TierId } from '../types';
import { canAccessFeature, type FeatureKey } from '../lib/entitlements';
import { DungeonMap } from './DungeonMap';
import { EncounterTable, EncounterTablesSection } from './EncounterTable';
import { Badge, Panel, SectionHeader } from './Badge';
import { RoomCard } from './RoomCard';

type GmTab = 'setup' | 'map' | 'areas' | 'encounters' | 'treasure' | 'notes';

const gmTabs: { id: GmTab; label: string }[] = [
  { id: 'setup', label: 'Setup' },
  { id: 'map', label: 'Map' },
  { id: 'areas', label: 'Areas' },
  { id: 'encounters', label: 'Encounters' },
  { id: 'treasure', label: 'Treasure' },
  { id: 'notes', label: 'GM Notes' },
];

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slatewood/20 bg-[#fbfaf5] p-3 shadow-sm">
      <dt className="ledger-label text-xs font-bold uppercase text-ink/45">{label}</dt>
      <dd className="mt-1 text-sm font-bold leading-5">{value}</dd>
    </div>
  );
}

export function GMView({
  dungeon,
  tier,
  onOpenPrint,
  onLockedFeature,
}: {
  dungeon: Dungeon;
  tier: TierId;
  onOpenPrint: () => void;
  onLockedFeature: (feature: FeatureKey) => void;
}) {
  const [activeTab, setActiveTab] = useState<GmTab>('setup');
  const [expandedRoom, setExpandedRoom] = useState<number | undefined>();
  const hasColorMap = canAccessFeature(tier, 'colorMap');
  const canPrintPacket = canAccessFeature(tier, 'pdfExport');

  useEffect(() => {
    setExpandedRoom(undefined);
  }, [dungeon.id]);

  const openRoom = (roomNumber: number, shouldScroll = false) => {
    setExpandedRoom((currentRoom) => (currentRoom === roomNumber && !shouldScroll ? undefined : roomNumber));

    if (shouldScroll) {
      window.requestAnimationFrame(() => {
        document.getElementById(`room-${roomNumber}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <SectionHeader eyebrow="Dungeon Detail" title="GM View" text="Room-by-room notes for running the dungeon at the table." />
        <div className="no-print flex shrink-0 flex-col gap-2 sm:items-end">
          <p className="max-w-64 text-xs font-semibold leading-5 text-ink/55 sm:text-right">Preview, print, or save this dungeon as a PDF packet.</p>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => (canPrintPacket ? onOpenPrint() : onLockedFeature('pdfExport'))}
              className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-bold shadow-tool transition ${
                canPrintPacket ? 'border-ember bg-ember text-white hover:bg-ember/90' : 'border-ink/10 bg-ink/10 text-ink/45 hover:bg-ink/15'
              }`}
            >
              {canPrintPacket ? <Printer className="h-4 w-4" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
              Print / Export Packet
            </button>
            <button
              type="button"
              onClick={() => (canPrintPacket ? onOpenPrint() : onLockedFeature('pdfExport'))}
              className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-bold shadow-tool transition ${
                canPrintPacket ? 'border-slatewood bg-slatewood text-white hover:bg-slatewood/90' : 'border-ink/10 bg-ink/10 text-ink/45 hover:bg-ink/15'
              }`}
            >
              {canPrintPacket ? <FileDown className="h-4 w-4" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
              Save as PDF
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto rounded-md border border-slatewood/20 bg-[#fbfaf5]/85 p-1 shadow-sm">
        {gmTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 rounded-md border px-3 py-2 text-sm font-bold transition ${
              activeTab === tab.id ? 'border-slatewood bg-slatewood text-white shadow-tool' : 'border-transparent bg-transparent text-ink/70 hover:bg-slatewood/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'setup' && (
        <Panel>
          <h3 className="survey-title font-serif text-2xl font-bold">Story Setup</h3>
          <p className="mt-3 text-sm leading-6 text-ink/75">{dungeon.background}</p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <InfoPill label="Theme" value={dungeon.theme} />
            <InfoPill label="Difficulty" value={dungeon.difficulty} />
            <InfoPill label="Party size" value={dungeon.partySize} />
            <InfoPill label="Estimated play" value={dungeon.estimatedPlayTime} />
          </dl>
        </Panel>
      )}

      {activeTab === 'map' && <DungeonMap mode="gm" mapData={dungeon.map} mapStyle={dungeon.mapStyle} colorEnabled={hasColorMap} />}
      {activeTab === 'areas' && (
        <div className="space-y-4">
          <Panel className="p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="survey-title font-serif text-xl font-bold">Room Index</h3>
                <p className="ledger-label mt-1 text-xs font-semibold uppercase text-ink/45">Tap a room to expand and jump</p>
              </div>
              <Badge tone="accent">{dungeon.rooms.length} rooms</Badge>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {dungeon.rooms.map((room) => (
                <button
                  key={room.number}
                  type="button"
                  onClick={() => openRoom(room.number, true)}
                  className={`rounded-md border p-2 text-left text-sm ${
                    expandedRoom === room.number ? 'border-ember bg-ember/10' : 'border-slatewood/20 bg-[#fbfaf5] hover:bg-slatewood/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold">
                      {room.number}. {room.name}
                    </span>
                    <Badge tone={room.threat === 'Severe' ? 'danger' : room.threat === 'High' ? 'warning' : room.threat === 'Moderate' ? 'success' : 'neutral'}>
                      {room.threat}
                    </Badge>
                  </div>
                  {room.tags[0] && <p className="mt-1 text-xs font-semibold text-ink/55">{room.tags[0]}</p>}
                </button>
              ))}
            </div>
          </Panel>

          <div className="grid gap-3 xl:grid-cols-2">
            {dungeon.rooms.map((room) => (
              <RoomCard
                key={room.number}
                room={room}
                expanded={expandedRoom === room.number}
                onToggle={() => openRoom(room.number)}
              />
            ))}
          </div>
        </div>
      )}
      {activeTab === 'encounters' && <EncounterTablesSection tables={dungeon.encounterTables} embedded />}
      {activeTab === 'treasure' && <EncounterTable title="Treasure Table" die="d6" entries={dungeon.treasureTable} />}
      {activeTab === 'notes' && (
        <Panel>
          <h3 className="survey-title font-serif text-2xl font-bold">GM Notes</h3>
          <ul className="mt-4 space-y-3">
            {dungeon.gmNotes.map((note) => (
              <li key={note} className="rounded-md border border-slatewood/20 bg-[#fbfaf5] p-3 text-sm leading-6 text-ink/75">
                {note}
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
