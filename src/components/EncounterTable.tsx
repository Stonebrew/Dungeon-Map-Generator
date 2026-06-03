import type { TableEntry } from '../types';
import { Badge, Panel, SectionHeader } from './Badge';

export function EncounterTable({ title, die, entries }: { title: string; die: string; entries: TableEntry[] }) {
  return (
    <Panel>
      <div className="flex items-center justify-between gap-3">
        <h3 className="survey-title font-serif text-xl font-bold">{title}</h3>
        <Badge tone="accent">{die}</Badge>
      </div>
      <div className="mt-4 overflow-hidden rounded-md border border-slatewood/20 bg-[#fbfaf5]">
        {entries.map((entry, index) => (
          <div key={`${entry.roll}-${entry.result}`} className={`grid grid-cols-[3rem_1fr] ${index > 0 ? 'border-t border-slatewood/20' : ''}`}>
            <div className="bg-slatewood/10 px-3 py-3 text-center text-sm font-black text-slatewood">{entry.roll}</div>
            <div className="px-3 py-3 text-sm leading-6 text-ink/75">
              {entry.result}
              {entry.type && <span className="ml-2 inline-block"><Badge tone="success">{entry.type}</Badge></span>}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function EncounterTablesSection({
  tables,
  embedded = false,
}: {
  tables: { wandering: TableEntry[]; environmental: TableEntry[]; complications: TableEntry[] };
  embedded?: boolean;
}) {
  return (
    <div className="space-y-4">
      {!embedded && <SectionHeader eyebrow="At The Table" title="Encounter Tables" text="Quick d6 prompts for motion, pressure, and complications during play." />}
      <div className="grid gap-4 xl:grid-cols-3">
        <EncounterTable title="Wandering Encounters" die="d6" entries={tables.wandering} />
        <EncounterTable title="Environmental Events" die="d6" entries={tables.environmental} />
        <EncounterTable title="Room Complications" die="d6" entries={tables.complications} />
      </div>
    </div>
  );
}
