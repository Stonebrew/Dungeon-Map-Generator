import { ArrowLeft, FileDown, Printer } from 'lucide-react';
import { useRef, useState, type ReactNode } from 'react';
import type { Dungeon, TableEntry, TierId } from '../types';
import { canAccessFeature } from '../lib/entitlements';
import { DungeonMap } from './DungeonMap';
import { Badge } from './Badge';

function PrintSection({
  title,
  kicker,
  children,
  pageBreak = false,
}: {
  title: string;
  kicker?: string;
  children: ReactNode;
  pageBreak?: boolean;
}) {
  return (
    <section className={`print-section ${pageBreak ? 'print-page' : ''}`}>
      {kicker && <p className="print-kicker text-xs font-bold uppercase tracking-[0.14em] text-ember">{kicker}</p>}
      <h2 className="font-serif text-2xl font-bold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function PrintField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="print-field">
      <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">{label}</h4>
      <div className="mt-1 text-sm leading-6 text-ink/75">{children}</div>
    </div>
  );
}

function PrintTable({ title, entries }: { title: string; entries: TableEntry[] }) {
  return (
    <div className="print-avoid rounded-md border border-ink/10 bg-white p-4">
      <h3 className="font-serif text-xl font-bold">{title}</h3>
      <div className="mt-3 overflow-hidden rounded-md border border-ink/10">
        {entries.map((entry, index) => (
          <div key={`${title}-${entry.roll}-${entry.result}`} className={`grid grid-cols-[3.25rem_1fr] ${index > 0 ? 'border-t border-ink/10' : ''}`}>
            <div className="bg-ink/5 px-3 py-2 text-center text-sm font-black">{entry.roll}</div>
            <div className="px-3 py-2 text-sm leading-6 text-ink/75">
              {entry.result}
              {entry.type && <span className="ml-2 text-xs font-bold uppercase tracking-[0.08em] text-moss">{entry.type}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function toSafeFilenamePart(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function getDungeonPdfFilename(dungeon: Dungeon) {
  const title = toSafeFilenamePart(dungeon.title) || 'daily-dungeon';
  const date = toSafeFilenamePart(dungeon.dateIso) || 'undated';
  return `daily-dungeon-${title}-${date}.pdf`;
}

export function PrintPacketView({ dungeon, tier, onBack }: { dungeon: Dungeon; tier: TierId; onBack: () => void }) {
  const hasColorMap = canAccessFeature(tier, 'colorMap');
  const packetContentRef = useRef<HTMLDivElement | null>(null);
  const [isCreatingPdf, setIsCreatingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const handleSavePdf = async () => {
    if (!packetContentRef.current || isCreatingPdf) {
      return;
    }

    setIsCreatingPdf(true);
    setPdfError(null);

    try {
      const { default: html2pdf } = await import('html2pdf.js');
      const pdfOptions = {
        filename: getDungeonPdfFilename(dungeon),
        margin: [0.45, 0.45, 0.45, 0.45] as [number, number, number, number],
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          backgroundColor: '#ffffff',
          logging: false,
          scale: 2,
          useCORS: true,
          windowWidth: 1120,
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const },
        pagebreak: { mode: ['css', 'legacy'], before: '.print-page', avoid: '.print-avoid' },
      };

      await html2pdf()
        .set(pdfOptions)
        .from(packetContentRef.current)
        .save();
    } catch (error) {
      console.error('PDF export failed', error);
      setPdfError('Could not create the PDF. Try Print instead, or try again in a moment.');
    } finally {
      setIsCreatingPdf(false);
    }
  };

  return (
    <article className="print-packet space-y-6">
      <div className="no-print flex flex-col gap-3 rounded-md border border-ink/10 bg-white p-4 shadow-tool sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge tone="warning">Prototype print preview</Badge>
          <h2 className="mt-2 font-serif text-3xl font-bold">Print Packet</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-ink/65">
            Browser print and direct PDF download are available now. Server-side PDF, PNG, and SVG exports are not implemented yet.
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">
            Use Print for your system print dialog. Use Save as PDF to download this packet directly.
          </p>
          {pdfError && (
            <p role="alert" className="mt-2 max-w-2xl rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {pdfError}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-md bg-ember px-3 py-2 text-sm font-bold text-white">
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print
          </button>
          <button
            type="button"
            onClick={handleSavePdf}
            disabled={isCreatingPdf}
            className="inline-flex items-center gap-2 rounded-md bg-brass px-3 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-65"
          >
            <FileDown className="h-4 w-4" aria-hidden="true" />
            {isCreatingPdf ? 'Creating PDF...' : 'Save as PDF'}
          </button>
        </div>
      </div>

      <div ref={packetContentRef} className="export-packet-content space-y-6 bg-white text-ink">
        <PrintSection title={dungeon.title} kicker="Daily Dungeon Packet">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Date</p>
              <p className="mt-1 text-sm font-bold">{dungeon.dateIso}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Difficulty</p>
              <p className="mt-1 text-sm font-bold">{dungeon.difficulty}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Party Size</p>
              <p className="mt-1 text-sm font-bold">{dungeon.partySize}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Play Time</p>
              <p className="mt-1 text-sm font-bold">{dungeon.estimatedPlayTime}</p>
            </div>
          </div>
          <div className="print-hook mt-4 rounded-md border border-brass/30 bg-brass/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brass">Story Hook</p>
            <p className="mt-2 text-sm leading-6 text-ink/75">{dungeon.hook}</p>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h3 className="font-serif text-xl font-bold">GM Summary</h3>
              <p className="mt-2 text-sm leading-6 text-ink/75">{dungeon.background}</p>
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold">Running Notes</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-ink/75">
                {dungeon.gmNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </PrintSection>

        <PrintSection title="GM Map" kicker="Page 2" pageBreak>
          <figure className="print-map-frame">
            <DungeonMap mode="gm" mapData={dungeon.map} mapStyle={dungeon.mapStyle} colorEnabled={hasColorMap} showLegend presentation="print" />
            <figcaption className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink/55">
              GM reference map. Includes keyed areas, GM markers, secret routes, and map legend.
            </figcaption>
          </figure>
        </PrintSection>

        <PrintSection title="Player-Safe Map" kicker="Page 3" pageBreak>
          {dungeon.map.playerSafe.description && <p className="mb-3 text-sm leading-6 text-ink/65">{dungeon.map.playerSafe.description}</p>}
          <figure className="print-map-frame">
            <DungeonMap mode="player" mapData={dungeon.map} mapStyle={dungeon.mapStyle} colorEnabled={hasColorMap} showLegend presentation="print" />
            <figcaption className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink/55">
              Player handout map. GM markers, secret routes, treasure, hazards, and GM-only labels are hidden.
            </figcaption>
          </figure>
        </PrintSection>

        <PrintSection title="Room And Keyed Area Notes" kicker="GM Packet" pageBreak>
          <div className="space-y-4 print-room-list">
            {dungeon.rooms.map((room) => (
              <section key={room.id} className="print-room-card print-avoid rounded-md border border-ink/10 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <span className="print-room-number flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ink text-lg font-black text-white">{room.number}</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-ember">Keyed Area</p>
                      <h3 className="font-serif text-xl font-bold">{room.name}</h3>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge tone={room.threat === 'Severe' ? 'danger' : room.threat === 'High' ? 'warning' : room.threat === 'Moderate' ? 'success' : 'neutral'}>
                      {room.threat}
                    </Badge>
                    {room.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  <PrintField label="Read Aloud">
                    <p className="print-read-aloud">{room.readAloud}</p>
                  </PrintField>
                  <PrintField label="GM Notes">
                    <p>{room.gmNotes}</p>
                  </PrintField>
                </div>

                {room.inhabitants.length > 0 && (
                  <PrintField label="Inhabitants">
                    <div className="mt-2 grid gap-2 lg:grid-cols-2">
                      {room.inhabitants.map((inhabitant) => (
                        <div key={inhabitant.name} className="print-inhabitant rounded-md bg-parchment/70 p-3 text-sm leading-6 text-ink/75">
                          <p className="font-bold text-ink">{inhabitant.name}</p>
                          <p>Role: {inhabitant.role}</p>
                          <p>Threat: {inhabitant.threat}</p>
                          <p>Tactics: {inhabitant.tactics}</p>
                          <p>Morale: {inhabitant.morale}</p>
                          <p>Wants: {inhabitant.wants}</p>
                          <p>Leverage: {inhabitant.leverage}</p>
                        </div>
                      ))}
                    </div>
                  </PrintField>
                )}

                <div className="mt-3 grid gap-3 lg:grid-cols-3">
                  <PrintField label="Treasure">
                    <p>{room.treasure}</p>
                  </PrintField>
                  <PrintField label="Secrets / GM Only">
                    <p>{room.secrets}</p>
                  </PrintField>
                  <PrintField label="Exits">
                    <p>{room.exits}</p>
                  </PrintField>
                </div>
              </section>
            ))}
          </div>
        </PrintSection>

        <PrintSection title="Encounter Tables" kicker="Reference Tables" pageBreak>
          <div className="grid gap-4 lg:grid-cols-3">
            <PrintTable title="Wandering Encounters" entries={dungeon.encounterTables.wandering} />
            <PrintTable title="Environmental Events" entries={dungeon.encounterTables.environmental} />
            <PrintTable title="Room Complications" entries={dungeon.encounterTables.complications} />
          </div>
        </PrintSection>

        <PrintSection title="Treasure Table" kicker="Rewards">
          <PrintTable title="Treasure" entries={dungeon.treasureTable} />
        </PrintSection>
      </div>
    </article>
  );
}
