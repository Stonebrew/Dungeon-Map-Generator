import { ArrowLeft, FileDown, Grid3X3, Printer } from 'lucide-react';
import { useRef, useState, type ReactNode } from 'react';
import type { Dungeon, TableEntry, TierId } from '../types';
import { canAccessDungeonFeature } from '../lib/entitlements';
import { getBattleMapPrintAvailability } from '../lib/battleMapPrint';
import { DungeonMap } from './DungeonMap';
import { Badge } from './Badge';

function PrintSection({
  title,
  kicker,
  children,
  pageBreak = false,
  className = '',
}: {
  title: string;
  kicker?: string;
  children: ReactNode;
  pageBreak?: boolean;
  className?: string;
}) {
  return (
    <section className={`print-section ${pageBreak ? 'print-page' : ''} ${className}`}>
      {kicker && <p className="print-kicker ledger-label text-xs font-bold uppercase text-ember">{kicker}</p>}
      <h2 className="survey-title font-serif text-2xl font-bold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function PrintField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="print-field">
      <h4 className="ledger-label text-xs font-bold uppercase text-ink/45">{label}</h4>
      <div className="mt-1 text-sm leading-6 text-ink/75">{children}</div>
    </div>
  );
}

function PrintTable({ title, entries }: { title: string; entries: TableEntry[] }) {
  return (
    <div className="print-avoid rounded-md border border-ink/10 bg-white p-4">
      <h3 className="survey-title font-serif text-xl font-bold">{title}</h3>
      <div className="mt-3 overflow-hidden rounded-md border border-ink/10">
        {entries.map((entry, index) => (
          <div key={`${title}-${entry.roll}-${entry.result}`} className={`grid grid-cols-[3.25rem_1fr] ${index > 0 ? 'border-t border-ink/10' : ''}`}>
            <div className="bg-ink/5 px-3 py-2 text-center text-sm font-black">{entry.roll}</div>
            <div className="px-3 py-2 text-sm leading-6 text-ink/75">
              {entry.result}
              {entry.type && <span className="ledger-label ml-2 text-xs font-bold uppercase text-moss">{entry.type}</span>}
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
  const title = toSafeFilenamePart(dungeon.title) || 'dungeon-dossier';
  const date = toSafeFilenamePart(dungeon.dateIso) || 'undated';
  return `dungeon-dossier-${title}-${date}.pdf`;
}

type PrintOrientation = 'portrait' | 'landscape';

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Could not read premium map image data.'));
      }
    });
    reader.addEventListener('error', () => reject(reader.error ?? new Error('Could not read premium map image data.')));
    reader.readAsDataURL(blob);
  });
}

async function inlinePremiumMapImagesForPdf(root: ParentNode) {
  const imageNodes = Array.from(root.querySelectorAll<SVGImageElement>('image'));

  await Promise.all(
    imageNodes.map(async (image) => {
      const originalHref = image.getAttribute('href') ?? image.getAttribute('xlink:href');

      if (!originalHref || originalHref.startsWith('data:')) {
        return;
      }

      const response = await fetch(new URL(originalHref, window.location.href), { cache: 'force-cache' });

      if (!response.ok) {
        throw new Error(`Could not load premium map image for PDF export: ${originalHref}`);
      }

      const dataUrl = await blobToDataUrl(await response.blob());
      image.setAttribute('href', dataUrl);
      image.setAttribute('xlink:href', dataUrl);
    }),
  );
}

function getSvgRenderSize(svg: SVGSVGElement) {
  const viewBox = svg.viewBox.baseVal;

  if (viewBox.width > 0 && viewBox.height > 0) {
    return { width: viewBox.width, height: viewBox.height };
  }

  return {
    width: svg.width.baseVal.value || svg.clientWidth || 720,
    height: svg.height.baseVal.value || svg.clientHeight || 480,
  };
}

function waitForImageLoad(image: HTMLImageElement) {
  if (image.complete && image.naturalWidth > 0) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => reject(new Error('Timed out rendering map snapshot for PDF export.')), 8000);

    image.addEventListener(
      'load',
      () => {
        window.clearTimeout(timeoutId);
        resolve();
      },
      { once: true },
    );
    image.addEventListener(
      'error',
      () => {
        window.clearTimeout(timeoutId);
        reject(new Error('Could not render map snapshot for PDF export.'));
      },
      { once: true },
    );
  });
}

async function renderSvgToPngDataUrl(svg: SVGSVGElement) {
  await document.fonts?.ready;

  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  await inlinePremiumMapImagesForPdf(clone);

  const { width, height } = getSvgRenderSize(svg);
  const svgText = new XMLSerializer().serializeToString(clone);
  const svgUrl = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }));
  const image = new Image();

  try {
    image.src = svgUrl;
    await waitForImageLoad(image);

    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(width * scale);
    canvas.height = Math.ceil(height * scale);

    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Could not create map snapshot canvas for PDF export.');
    }

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/png');
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function createTextElement(tagName: 'p' | 'h2' | 'figcaption', className: string, textContent: string | null | undefined) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = textContent ?? '';
  return element;
}

async function flattenMapSectionsForPdf(root: HTMLElement) {
  const mapSections = Array.from(root.querySelectorAll<HTMLElement>('.pdf-map-section'));
  const restoreCallbacks: Array<() => void> = [];

  if (import.meta.env.DEV) {
    console.info(`[PrintPacket] Flattening ${mapSections.length} map section(s) for PDF export.`);
  }

  await Promise.all(
    mapSections.map(async (section, index) => {
      const svg = section.querySelector<SVGSVGElement>('.print-map-frame svg');

      if (!svg) {
        throw new Error('Could not find map SVG for PDF export.');
      }

      const dataUrl = await renderSvgToPngDataUrl(svg);
      const replacement = document.createElement('section');
      const snapshot = document.createElement('img');
      const kicker = section.querySelector('.print-kicker')?.textContent;
      const title = section.querySelector('h2')?.textContent;
      const description = section.querySelector('.pdf-map-description')?.textContent;
      const caption = section.querySelector('figcaption')?.textContent;

      replacement.className = 'print-section print-page print-avoid pdf-map-section-snapshot';
      if (kicker) {
        replacement.appendChild(createTextElement('p', 'print-kicker pdf-map-kicker', kicker));
      }
      replacement.appendChild(createTextElement('h2', 'pdf-map-title', title));
      if (description) {
        replacement.appendChild(createTextElement('p', 'pdf-map-description', description));
      }

      const figure = document.createElement('figure');
      figure.className = 'pdf-map-frame';

      snapshot.src = dataUrl;
      snapshot.alt = title ? `${title} map` : `Printable dungeon map ${index + 1}`;
      snapshot.className = 'pdf-map-snapshot';
      await snapshot.decode?.().catch(() => undefined);
      figure.appendChild(snapshot);

      if (caption) {
        figure.appendChild(createTextElement('figcaption', 'pdf-map-caption', caption));
      }
      replacement.appendChild(figure);

      const parent = section.parentNode;

      if (!parent) {
        throw new Error('Could not replace map section for PDF export.');
      }

      parent.replaceChild(replacement, section);
      restoreCallbacks.push(() => {
        if (replacement.parentNode) {
          replacement.parentNode.replaceChild(section, replacement);
        }
      });

      if (import.meta.env.DEV) {
        console.info(`[PrintPacket] Map section ${index + 1} flattened for PDF export.`);
      }
    }),
  );

  return () => {
    restoreCallbacks.forEach((restore) => restore());
  };
}

export function PrintPacketView({ dungeon, tier, onBack, onOpenBattleMap }: { dungeon: Dungeon; tier: TierId; onBack: () => void; onOpenBattleMap: () => void }) {
  const hasColorMap = canAccessDungeonFeature(tier, dungeon, 'colorMap');
  const canUseBattleMapPrint = canAccessDungeonFeature(tier, dungeon, 'pdfExport');
  const battleMapAvailability = getBattleMapPrintAvailability(dungeon);
  const packetContentRef = useRef<HTMLDivElement | null>(null);
  const [isCreatingPdf, setIsCreatingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [printOrientation, setPrintOrientation] = useState<PrintOrientation>('landscape');
  const [showPlayerRoomNumbers, setShowPlayerRoomNumbers] = useState(true);

  const handleSavePdf = async () => {
    if (!packetContentRef.current || isCreatingPdf) {
      return;
    }

    setIsCreatingPdf(true);
    setPdfError(null);

    let restoreMapSnapshots: (() => void) | undefined;

    try {
      const { default: html2pdf } = await import('html2pdf.js');
      restoreMapSnapshots = await flattenMapSectionsForPdf(packetContentRef.current);

      const pdfOptions = {
        filename: getDungeonPdfFilename(dungeon),
        margin: [0.45, 0.45, 0.45, 0.45] as [number, number, number, number],
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          backgroundColor: '#ffffff',
          logging: false,
          scale: 2,
          useCORS: true,
          windowWidth: printOrientation === 'landscape' ? 1440 : 1120,
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: printOrientation },
        pagebreak: { mode: ['css', 'legacy'], before: '.print-page', avoid: ['.print-avoid', '.pdf-map-section-snapshot', '.pdf-map-frame', '.pdf-map-snapshot', '.print-map-frame', '.print-map-card'] },
      };

      await html2pdf()
        .set(pdfOptions)
        .from(packetContentRef.current)
        .save();
    } catch (error) {
      console.error('PDF export failed', error);
      setPdfError('Could not create the PDF. Try Print instead, or try again in a moment.');
    } finally {
      restoreMapSnapshots?.();
      setIsCreatingPdf(false);
    }
  };

  return (
    <article className={`print-packet print-orientation-${printOrientation} space-y-6`}>
      <div className="no-print paper-panel field-corner flex flex-col gap-3 rounded-md border border-slatewood/20 p-4 shadow-tool sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge tone="warning">Print Packet Preview</Badge>
          <h2 className="survey-title mt-2 font-serif text-3xl font-bold">Print Packet</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-ink/65">
            Review and export your table-ready packet with portrait or landscape pages and labeled or clean player maps.
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">
            Use Print for your system print dialog. Use Save as PDF to download this packet directly.
          </p>
          {pdfError && (
            <p role="alert" className="mt-2 max-w-2xl rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {pdfError}
            </p>
          )}
          <div className="mt-3 grid max-w-2xl gap-3 rounded-md border border-slatewood/20 bg-[#fbfaf5] p-3 text-sm text-ink sm:grid-cols-2">
            <fieldset>
              <legend className="ledger-label text-xs font-bold uppercase text-ink/45">Page Orientation</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {(['landscape', 'portrait'] as const).map((orientation) => (
                  <label key={orientation} className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 font-bold capitalize ${printOrientation === orientation ? 'border-slatewood bg-white text-slatewood' : 'border-slatewood/20 bg-white/70 text-ink'}`}>
                    <input
                      type="radio"
                      name="print-orientation"
                      value={orientation}
                      checked={printOrientation === orientation}
                      onChange={() => setPrintOrientation(orientation)}
                      className="h-4 w-4 accent-ember"
                    />
                    {orientation}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="ledger-label text-xs font-bold uppercase text-ink/45">Player Map</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                <label className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 font-bold ${showPlayerRoomNumbers ? 'border-slatewood bg-white text-slatewood' : 'border-slatewood/20 bg-white/70 text-ink'}`}>
                  <input
                    type="radio"
                    name="player-map-labels"
                    checked={showPlayerRoomNumbers}
                    onChange={() => setShowPlayerRoomNumbers(true)}
                    className="h-4 w-4 accent-ember"
                  />
                  Labeled
                </label>
                <label className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 font-bold ${!showPlayerRoomNumbers ? 'border-slatewood bg-white text-slatewood' : 'border-slatewood/20 bg-white/70 text-ink'}`}>
                  <input
                    type="radio"
                    name="player-map-labels"
                    checked={!showPlayerRoomNumbers}
                    onChange={() => setShowPlayerRoomNumbers(false)}
                    className="h-4 w-4 accent-ember"
                  />
                  Clean
                </label>
              </div>
            </fieldset>
          </div>
          <div className="mt-3 rounded-md border border-slatewood/20 bg-[#fbfaf5] p-3 text-sm text-ink">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="ledger-label text-xs font-bold uppercase text-ink/45">Battle Map Print</p>
                <p className="mt-1 leading-6 text-ink/70">
                  {battleMapAvailability.available
                    ? `Print a player-safe 1-inch grid map across ${battleMapAvailability.plan.tiles.length} A4 landscape tiles. Use 100% scale and disable browser headers and footers.`
                    : battleMapAvailability.message}
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenBattleMap}
                disabled={!canUseBattleMapPrint || !battleMapAvailability.available}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-slatewood bg-slatewood px-3 py-2 text-sm font-bold text-white shadow-tool disabled:cursor-not-allowed disabled:border-ink/10 disabled:bg-ink/10 disabled:text-ink/45"
              >
                <Grid3X3 className="h-4 w-4" aria-hidden="true" />
                Battle Map Print
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-md border border-ember bg-ember px-3 py-2 text-sm font-bold text-white shadow-tool">
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print
          </button>
          <button
            type="button"
            onClick={handleSavePdf}
            disabled={isCreatingPdf}
            className="inline-flex items-center gap-2 rounded-md border border-slatewood bg-slatewood px-3 py-2 text-sm font-bold text-white shadow-tool disabled:cursor-not-allowed disabled:opacity-65"
          >
            <FileDown className="h-4 w-4" aria-hidden="true" />
            {isCreatingPdf ? 'Creating PDF...' : 'Save as PDF'}
          </button>
        </div>
      </div>

      <div ref={packetContentRef} className={`export-packet-content export-packet-${printOrientation} space-y-6 bg-white text-ink`}>
        <PrintSection title={dungeon.title} kicker="Dungeon Dossier Packet">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="ledger-label text-xs font-bold uppercase text-ink/45">Date</p>
              <p className="mt-1 text-sm font-bold">{dungeon.dateIso}</p>
            </div>
            <div>
              <p className="ledger-label text-xs font-bold uppercase text-ink/45">Difficulty</p>
              <p className="mt-1 text-sm font-bold">{dungeon.difficulty}</p>
            </div>
            <div>
              <p className="ledger-label text-xs font-bold uppercase text-ink/45">Party Size</p>
              <p className="mt-1 text-sm font-bold">{dungeon.partySize}</p>
            </div>
            <div>
              <p className="ledger-label text-xs font-bold uppercase text-ink/45">Play Time</p>
              <p className="mt-1 text-sm font-bold">{dungeon.estimatedPlayTime}</p>
            </div>
          </div>
          <div className="print-hook mt-4 rounded-md border border-brass/30 bg-brass/10 p-4">
            <p className="ledger-label text-xs font-bold uppercase text-brass">Story Hook</p>
            <p className="mt-2 text-sm leading-6 text-ink/75">{dungeon.hook}</p>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h3 className="survey-title font-serif text-xl font-bold">GM Summary</h3>
              <p className="mt-2 text-sm leading-6 text-ink/75">{dungeon.background}</p>
            </div>
            <div>
              <h3 className="survey-title font-serif text-xl font-bold">Running Notes</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-ink/75">
                {dungeon.gmNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </PrintSection>

        <PrintSection title="GM Map" kicker="Page 2" pageBreak className="pdf-map-section">
          <figure className="print-map-frame">
            <DungeonMap mode="gm" mapData={dungeon.map} mapStyle={dungeon.mapStyle} colorEnabled={hasColorMap} showLegend presentation="print" />
            <figcaption className="ledger-label mt-2 text-xs font-semibold uppercase text-ink/55">
              GM reference map. Includes keyed areas, GM markers, secret routes, and map legend.
            </figcaption>
          </figure>
        </PrintSection>

        <PrintSection title="Player-Safe Map" kicker="Page 3" pageBreak className="pdf-map-section">
          {dungeon.map.playerSafe.description && <p className="pdf-map-description mb-3 text-sm leading-6 text-ink/65">{dungeon.map.playerSafe.description}</p>}
          <figure className="print-map-frame">
            <DungeonMap mode="player" mapData={dungeon.map} mapStyle={dungeon.mapStyle} colorEnabled={hasColorMap} showLegend presentation="print" playerLabelsVisible={showPlayerRoomNumbers} />
            <figcaption className="ledger-label mt-2 text-xs font-semibold uppercase text-ink/55">
              {showPlayerRoomNumbers
                ? 'Player-safe map. Keyed numbers remain visible, but GM markers, hidden routes, treasure, hazards, and GM-only labels are not shown.'
                : 'Clean player-safe map. Room numbers, GM markers, hidden routes, treasure, hazards, and GM-only labels are not shown.'}
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
                      <p className="ledger-label text-xs font-bold uppercase text-ember">Keyed Area</p>
                      <h3 className="survey-title font-serif text-xl font-bold">{room.name}</h3>
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

        <PrintSection title="Treasure Table" kicker="Rewards" className="print-avoid">
          <PrintTable title="Treasure" entries={dungeon.treasureTable} />
        </PrintSection>
      </div>
    </article>
  );
}
