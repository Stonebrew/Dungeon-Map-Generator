import { ArrowLeft, Lock, Printer } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Dungeon, TierId } from '../types';
import { getBattleMapPrintAvailability, type BattleMapOverlapInches, type BattleMapPrintPlan, type BattleMapPrintTile } from '../lib/battleMapPrint';
import { canAccessFeature } from '../lib/entitlements';
import { Badge, Panel } from './Badge';

const overlapOptions: BattleMapOverlapInches[] = [0, 0.25, 0.5];

function formatInches(value: number) {
  return `${value.toFixed(value >= 10 ? 1 : 2)} in`;
}

function TilePreview({ plan, tile, showDebugGrid }: { plan: BattleMapPrintPlan; tile: BattleMapPrintTile; showDebugGrid: boolean }) {
  const imageStyle = {
    width: `${tile.widthInches}in`,
    height: `${tile.heightInches}in`,
    backgroundImage: `url("${plan.image.url}")`,
    backgroundSize: `${plan.imagePrintWidthInches}in ${plan.imagePrintHeightInches}in`,
    backgroundPosition: `-${tile.sourceXInches}in -${tile.sourceYInches}in`,
  };
  const gridStyle = {
    backgroundPosition: `${tile.gridOffsetXInches}in ${tile.gridOffsetYInches}in`,
    transform: plan.rotationDeg ? `rotate(${plan.rotationDeg}deg)` : undefined,
    transformOrigin: `${tile.gridOffsetXInches}in ${tile.gridOffsetYInches}in`,
  };

  return (
    <section className="battle-map-tile-page" style={{ width: `${plan.page.widthInches}in`, minHeight: `${plan.page.heightInches}in` }}>
      <header className="battle-map-tile-header">
        <div>
          <p className="battle-map-tile-kicker">1-inch battle map</p>
          <h2>{plan.dungeonTitle} - Battle Map Tile {tile.index} of {tile.total}</h2>
        </div>
        <p>Row {tile.row + 1}, Column {tile.column + 1}</p>
      </header>
      <div className="battle-map-tile-stage" style={{ width: `${plan.page.printableWidthInches}in`, height: `${plan.page.printableHeightInches}in` }}>
        <div className="battle-map-tile-image" style={imageStyle}>
          {showDebugGrid && <div className="battle-map-print-grid no-print" style={gridStyle} aria-hidden="true" />}
        </div>
      </div>
      <footer className="battle-map-tile-footer">Print at actual size / 100% scale. Do not use Fit to Page. Disable browser headers and footers.</footer>
    </section>
  );
}

export function BattleMapPrintView({ dungeon, tier, onBack }: { dungeon: Dungeon; tier: TierId; onBack: () => void }) {
  const canUseBattleMapPrint = canAccessFeature(tier, 'pdfExport');
  const defaultAvailability = useMemo(() => getBattleMapPrintAvailability(dungeon), [dungeon]);
  const defaultOverlap = defaultAvailability.available ? defaultAvailability.plan.overlapInches : 0.25;
  const [overlapInches, setOverlapInches] = useState<BattleMapOverlapInches>(defaultOverlap);
  const [showDebugGrid, setShowDebugGrid] = useState(false);
  const availability = useMemo(() => getBattleMapPrintAvailability(dungeon, overlapInches), [dungeon, overlapInches]);

  return (
    <article className="battle-map-print space-y-5">
      <div className="no-print paper-panel field-corner rounded-md border border-slatewood/20 p-4 shadow-tool">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge tone="warning">Cartographer Print Tool</Badge>
            <h2 className="survey-title mt-2 font-serif text-3xl font-bold">Battle Map Print</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/70">
              Print only the player-safe map as tiled A4 landscape pages. Calibration metadata scales the baked-in map grid to approximately 1 inch.
            </p>
            <p className="mt-2 max-w-3xl rounded-md border border-ember/25 bg-ember/10 px-3 py-2 text-sm font-bold leading-6 text-ink">
              Print at actual size / 100% scale. Do not use Fit to Page. Disable browser headers and footers.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              disabled={!canUseBattleMapPrint || !availability.available}
              className="inline-flex items-center gap-2 rounded-md border border-ember bg-ember px-3 py-2 text-sm font-bold text-white shadow-tool disabled:cursor-not-allowed disabled:border-ink/10 disabled:bg-ink/10 disabled:text-ink/45"
            >
              {canUseBattleMapPrint && availability.available ? <Printer className="h-4 w-4" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
              Print Battle Map
            </button>
          </div>
        </div>

        {!canUseBattleMapPrint && (
          <div className="mt-4 rounded-md border border-ink/10 bg-[#fbfaf5] p-3 text-sm leading-6 text-ink/70">
            Battle Map Print is a Cartographer print/export feature.
          </div>
        )}

        {canUseBattleMapPrint && !availability.available && (
          <div className="mt-4 rounded-md border border-ink/10 bg-[#fbfaf5] p-3 text-sm leading-6 text-ink/70">
            {availability.message}
          </div>
        )}

        {canUseBattleMapPrint && availability.available && (
          <div className="mt-4 grid gap-3 rounded-md border border-slatewood/20 bg-[#fbfaf5] p-3 text-sm text-ink sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="ledger-label text-xs font-bold uppercase text-ink/45">Map Size</p>
                <p className="mt-1 font-bold">{formatInches(availability.plan.cropPrintWidthInches)} x {formatInches(availability.plan.cropPrintHeightInches)}</p>
              </div>
              <div>
                <p className="ledger-label text-xs font-bold uppercase text-ink/45">Tiles</p>
                <p className="mt-1 font-bold">{availability.plan.columns} x {availability.plan.rows} ({availability.plan.tiles.length} pages)</p>
              </div>
              <div>
                <p className="ledger-label text-xs font-bold uppercase text-ink/45">Grid Calibration</p>
                <p className="mt-1 font-bold">{availability.plan.squareWidthPx}px x {availability.plan.squareHeightPx}px</p>
              </div>
              <label>
                <span className="ledger-label text-xs font-bold uppercase text-ink/45">Tile Overlap</span>
                <select
                  value={overlapInches}
                  onChange={(event) => setOverlapInches(Number(event.target.value) as BattleMapOverlapInches)}
                  className="mt-1 min-h-10 w-full rounded-md border border-slatewood/20 bg-white px-2 text-sm font-bold text-ink"
                >
                  {overlapOptions.map((option) => (
                    <option key={option} value={option}>
                      {option} in
                    </option>
                  ))}
                </select>
              </label>
              {import.meta.env.DEV && (
                <label className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slatewood/20 bg-white px-3 text-sm font-bold text-ink">
                  <input
                    type="checkbox"
                    checked={showDebugGrid}
                    onChange={(event) => setShowDebugGrid(event.target.checked)}
                    className="h-4 w-4 accent-ember"
                  />
                  Show calibration grid
                </label>
              )}
            </div>
          </div>
        )}
      </div>

      {!canUseBattleMapPrint || !availability.available ? (
        <Panel>
          <h3 className="survey-title font-serif text-2xl font-bold">Battle Map Print Unavailable</h3>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            This view is intentionally limited to calibrated Cartographer premium maps so the printed grid is accurate at tabletop scale.
          </p>
        </Panel>
      ) : (
        <div className="battle-map-print-preview rounded-md border border-slatewood/20 bg-white p-3 shadow-tool">
          <p className="no-print mb-3 text-sm font-semibold leading-6 text-ink/65">
            Preview shows the tiled output. Use your print dialog with A4 landscape pages at 100% scale, and disable browser headers and footers.
          </p>
          <div className="battle-map-print-pages">
            {availability.plan.tiles.map((tile) => (
              <TilePreview key={tile.index} plan={availability.plan} tile={tile} showDebugGrid={import.meta.env.DEV && showDebugGrid} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
