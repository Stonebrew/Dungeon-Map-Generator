import type { Dungeon, PremiumMapBattlePrintCalibration, PremiumMapImageAsset } from '../types';

export type BattleMapOverlapInches = 0 | 0.25 | 0.5;

export type BattleMapPrintTile = {
  index: number;
  total: number;
  column: number;
  row: number;
  xInches: number;
  yInches: number;
  widthInches: number;
  heightInches: number;
  sourceXInches: number;
  sourceYInches: number;
  gridOffsetXInches: number;
  gridOffsetYInches: number;
};

export type BattleMapPrintPlan = {
  dungeonTitle: string;
  image: PremiumMapImageAsset;
  calibration: PremiumMapBattlePrintCalibration;
  squareWidthPx: number;
  squareHeightPx: number;
  crop: {
    xPx: number;
    yPx: number;
    widthPx: number;
    heightPx: number;
  };
  imagePrintWidthInches: number;
  imagePrintHeightInches: number;
  cropPrintWidthInches: number;
  cropPrintHeightInches: number;
  originXInches: number;
  originYInches: number;
  rotationDeg: number;
  overlapInches: BattleMapOverlapInches;
  page: {
    widthInches: number;
    heightInches: number;
    printableWidthInches: number;
    printableHeightInches: number;
  };
  columns: number;
  rows: number;
  tiles: BattleMapPrintTile[];
};

export type BattleMapPrintAvailability =
  | { available: true; plan: BattleMapPrintPlan }
  | { available: false; reason: 'no-premium-map' | 'missing-image' | 'not-calibrated' | 'missing-grid'; message: string };

const A4_LANDSCAPE_INCHES = {
  width: 11.69,
  height: 8.27,
};

const PAGE_MARGIN_INCHES = 0.25;
const TILE_HEADER_INCHES = 0.42;

function getBattleMapImage(dungeon: Dungeon) {
  const premiumMap = dungeon.map.premiumMap;

  return premiumMap?.playerBaseMapImage ?? premiumMap?.baseMapImage ?? premiumMap?.gmBaseMapImage;
}

function getSquareWidth(calibration: PremiumMapBattlePrintCalibration) {
  return calibration.grid?.squareWidthPx ?? calibration.grid?.squarePx;
}

function getSquareHeight(calibration: PremiumMapBattlePrintCalibration) {
  return calibration.grid?.squareHeightPx ?? calibration.grid?.squarePx;
}

function clampOverlap(overlap: number | undefined): BattleMapOverlapInches {
  if (overlap === 0 || overlap === 0.25 || overlap === 0.5) {
    return overlap;
  }

  return 0.25;
}

function getCrop(calibration: PremiumMapBattlePrintCalibration, image: PremiumMapImageAsset) {
  const bounds = calibration.cropBoundsPercent ?? { x: 0, y: 0, width: 100, height: 100 };

  return {
    xPx: image.width * (bounds.x / 100),
    yPx: image.height * (bounds.y / 100),
    widthPx: image.width * (bounds.width / 100),
    heightPx: image.height * (bounds.height / 100),
  };
}

function createTiles({
  columns,
  rows,
  crop,
  cropPrintWidthInches,
  cropPrintHeightInches,
  printableWidthInches,
  printableHeightInches,
  overlapInches,
  squareWidthPx,
  squareHeightPx,
  originXInches,
  originYInches,
}: {
  columns: number;
  rows: number;
  crop: BattleMapPrintPlan['crop'];
  cropPrintWidthInches: number;
  cropPrintHeightInches: number;
  printableWidthInches: number;
  printableHeightInches: number;
  overlapInches: BattleMapOverlapInches;
  squareWidthPx: number;
  squareHeightPx: number;
  originXInches: number;
  originYInches: number;
}) {
  const tiles: BattleMapPrintTile[] = [];
  const stepX = Math.max(0.25, printableWidthInches - overlapInches);
  const stepY = Math.max(0.25, printableHeightInches - overlapInches);
  const cropSourceXInches = crop.xPx / squareWidthPx;
  const cropSourceYInches = crop.yPx / squareHeightPx;
  const total = columns * rows;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const xInches = column * stepX;
      const yInches = row * stepY;
      const widthInches = Math.min(printableWidthInches, cropPrintWidthInches - xInches);
      const heightInches = Math.min(printableHeightInches, cropPrintHeightInches - yInches);
      const sourceXInches = cropSourceXInches + xInches;
      const sourceYInches = cropSourceYInches + yInches;

      tiles.push({
        index: tiles.length + 1,
        total,
        column,
        row,
        xInches,
        yInches,
        widthInches,
        heightInches,
        sourceXInches,
        sourceYInches,
        gridOffsetXInches: originXInches - sourceXInches,
        gridOffsetYInches: originYInches - sourceYInches,
      });
    }
  }

  return tiles;
}

export function getBattleMapPrintAvailability(dungeon: Dungeon, overlapOverride?: BattleMapOverlapInches): BattleMapPrintAvailability {
  const premiumMap = dungeon.map.premiumMap;

  if (!premiumMap) {
    return {
      available: false,
      reason: 'no-premium-map',
      message: 'Battle Map Print is only available for premium illustrated maps.',
    };
  }

  const image = getBattleMapImage(dungeon);

  if (!image) {
    return {
      available: false,
      reason: 'missing-image',
      message: 'Battle Map Print needs a premium map image before it can be prepared.',
    };
  }

  const calibration = premiumMap.battleMapPrint;

  if (calibration?.status !== 'calibrated') {
    return {
      available: false,
      reason: 'not-calibrated',
      message: 'Battle Map Print is not calibrated for this map yet.',
    };
  }

  const squareWidthPx = getSquareWidth(calibration);
  const squareHeightPx = getSquareHeight(calibration);

  if (!squareWidthPx || !squareHeightPx || squareWidthPx <= 0 || squareHeightPx <= 0) {
    return {
      available: false,
      reason: 'missing-grid',
      message: 'Battle Map Print is not calibrated for this map yet.',
    };
  }

  const overlapInches = overlapOverride ?? clampOverlap(calibration.defaultOverlapInches);
  const crop = getCrop(calibration, image);
  const imagePrintWidthInches = image.width / squareWidthPx;
  const imagePrintHeightInches = image.height / squareHeightPx;
  const cropPrintWidthInches = crop.widthPx / squareWidthPx;
  const cropPrintHeightInches = crop.heightPx / squareHeightPx;
  const printableWidthInches = A4_LANDSCAPE_INCHES.width - PAGE_MARGIN_INCHES * 2;
  const printableHeightInches = A4_LANDSCAPE_INCHES.height - PAGE_MARGIN_INCHES * 2 - TILE_HEADER_INCHES;
  const stepX = Math.max(0.25, printableWidthInches - overlapInches);
  const stepY = Math.max(0.25, printableHeightInches - overlapInches);
  const columns = Math.max(1, Math.ceil(Math.max(0, cropPrintWidthInches - overlapInches) / stepX));
  const rows = Math.max(1, Math.ceil(Math.max(0, cropPrintHeightInches - overlapInches) / stepY));
  const originXInches = image.width * ((calibration.grid?.originXPercent ?? 0) / 100) / squareWidthPx;
  const originYInches = image.height * ((calibration.grid?.originYPercent ?? 0) / 100) / squareHeightPx;

  return {
    available: true,
    plan: {
      dungeonTitle: dungeon.title,
      image,
      calibration,
      squareWidthPx,
      squareHeightPx,
      crop,
      imagePrintWidthInches,
      imagePrintHeightInches,
      cropPrintWidthInches,
      cropPrintHeightInches,
      originXInches,
      originYInches,
      rotationDeg: calibration.grid?.rotationDeg ?? 0,
      overlapInches,
      page: {
        widthInches: A4_LANDSCAPE_INCHES.width,
        heightInches: A4_LANDSCAPE_INCHES.height,
        printableWidthInches,
        printableHeightInches,
      },
      columns,
      rows,
      tiles: createTiles({
        columns,
        rows,
        crop,
        cropPrintWidthInches,
        cropPrintHeightInches,
        printableWidthInches,
        printableHeightInches,
        overlapInches,
        squareWidthPx,
        squareHeightPx,
        originXInches,
        originYInches,
      }),
    },
  };
}
