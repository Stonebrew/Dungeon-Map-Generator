import { cavernTheme } from '../themes';
import { LevelTwoConnectionApron, LevelTwoConnectionRoutes, LevelTwoCrack, LevelTwoFoundation, LevelTwoMarker, LevelTwoRoomNumbers, LevelTwoRubble } from '../shared';
import type { LevelTwoMapTheme, LevelTwoRendererProps } from '../types';

type CavernChamberProps = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  theme: LevelTwoMapTheme;
  final?: boolean;
  seed?: number;
};

function cavernPath(cx: number, cy: number, rx: number, ry: number, seed = 0) {
  const offsets = [
    [0, -1, -4 + seed, 0],
    [0.62, -0.72, 8, -4],
    [1, -0.08, 4, 5],
    [0.76, 0.7, -5, 6],
    [0.1, 1, 2, -2],
    [-0.58, 0.78, -7, 4],
    [-1, 0.08, -3, -5],
    [-0.72, -0.68, 5, -7],
  ];
  const points = offsets.map(([mx, my, ox, oy]) => [cx + mx * rx + ox, cy + my * ry + oy]);
  return `M${points[0][0]} ${points[0][1]} C${points[1][0]} ${points[1][1]} ${points[1][0]} ${points[1][1]} ${points[2][0]} ${points[2][1]} C${points[3][0]} ${points[3][1]} ${points[3][0]} ${points[3][1]} ${points[4][0]} ${points[4][1]} C${points[5][0]} ${points[5][1]} ${points[5][0]} ${points[5][1]} ${points[6][0]} ${points[6][1]} C${points[7][0]} ${points[7][1]} ${points[7][0]} ${points[7][1]} ${points[0][0]} ${points[0][1]} Z`;
}

function LevelTwoCavernChamber({ cx, cy, rx, ry, theme, final = false, seed = 0 }: CavernChamberProps) {
  const outerPath = cavernPath(cx, cy, rx, ry, seed);
  const innerPath = cavernPath(cx, cy, rx - 14, ry - 12, seed + 2);
  const clipId = `level-two-cavern-${cx}-${cy}`;

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <path d={innerPath} />
        </clipPath>
      </defs>
      <path d={outerPath} fill={theme.shadow} opacity="0.36" transform="translate(4 8)" />
      <path d={outerPath} fill={theme.wallDark} stroke={theme.wallStroke} strokeWidth="3.5" filter="url(#inkRoughen)" />
      <path d={innerPath} fill={final ? theme.floorTiles[1] : theme.floorTiles[0]} stroke={theme.wallMid} strokeWidth="8" />
      <g clipPath={`url(#${clipId})`}>
        <rect x={cx - rx} y={cy - ry} width={rx * 2} height={ry * 2} fill={final ? theme.floorTiles[1] : theme.floorTiles[0]} opacity="0.96" />
        {Array.from({ length: 18 }).map((_, index) => {
          const x = cx - rx + 14 + ((index * 31 + seed * 11) % Math.max(24, rx * 2 - 28));
          const y = cy - ry + 12 + ((index * 19 + seed * 7) % Math.max(24, ry * 2 - 24));
          return <circle key={index} cx={x} cy={y} r={index % 3 === 0 ? 2.6 : 1.6} fill={index % 2 ? theme.floorStroke : theme.floorHighlight} opacity={index % 2 ? '0.28' : '0.2'} />;
        })}
        <path d={`M${cx - rx + 18} ${cy + 3} C${cx - 20} ${cy - 24} ${cx + 24} ${cy + 28} ${cx + rx - 20} ${cy - 2}`} stroke={theme.floorStroke} strokeWidth="4" fill="none" opacity="0.22" />
        <path d={`M${cx - 24} ${cy + ry - 18} l16 -10 l14 13 M${cx + 12} ${cy - ry + 20} l18 -7 l13 15`} stroke={theme.wallHighlight} strokeWidth="2" fill="none" opacity="0.38" />
      </g>
      <path d={innerPath} fill="none" stroke={theme.floorHighlight} strokeWidth="2" opacity="0.22" />
      <path d={outerPath} fill="none" stroke={theme.wallHighlight} strokeWidth="2.4" opacity="0.28" strokeDasharray="14 12" />
    </g>
  );
}

function LevelTwoMineralVein({ x, y, w, rotate = 0, theme }: { x: number; y: number; w: number; rotate?: number; theme: LevelTwoMapTheme }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.68">
      <path d={`M0 0 C${w * 0.25} -10 ${w * 0.55} 12 ${w} 0`} stroke={theme.runeGlow} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d={`M8 4 C${w * 0.4} -4 ${w * 0.62} 9 ${w - 8} 3`} stroke="#e2f5ec" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.45" />
    </g>
  );
}

function LevelTwoFungusPatch({ x, y, theme, scale = 1 }: { x: number; y: number; theme: LevelTwoMapTheme; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity="0.78">
      {[0, 9, 18, 27].map((offset, index) => (
        <g key={offset}>
          <path d={`M${offset + 4} 14 V7`} stroke={theme.moss} strokeWidth="2" strokeLinecap="round" />
          <ellipse cx={offset + 4} cy="6" rx={index % 2 ? 5 : 4} ry="3" fill={index % 2 ? theme.residue : theme.moss} opacity="0.68" />
        </g>
      ))}
    </g>
  );
}

function LevelTwoStoneCluster({ x, y, theme, scale = 1 }: { x: number; y: number; theme: LevelTwoMapTheme; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity="0.84">
      <path d="M0 14 l10 -12 l12 7 l-4 14 l-14 2 Z" fill={theme.rubble} stroke={theme.wallStroke} strokeWidth="1.4" />
      <path d="M22 16 l8 -10 l11 5 l-2 12 l-12 3 Z" fill={theme.wallMid} stroke={theme.wallStroke} strokeWidth="1.2" />
      <path d="M8 9 h8 M28 13 h8" stroke={theme.wallHighlight} strokeWidth="1.2" opacity="0.4" />
    </g>
  );
}

function LevelTwoUndergroundPool({ x, y, w, h, theme }: { x: number; y: number; w: number; h: number; theme: LevelTwoMapTheme }) {
  return (
    <g opacity="0.8">
      <path d={`M${x} ${y + h / 2} C${x + w * 0.18} ${y - h * 0.3} ${x + w * 0.78} ${y - h * 0.2} ${x + w} ${y + h / 2} C${x + w * 0.72} ${y + h * 1.16} ${x + w * 0.26} ${y + h * 1.02} ${x} ${y + h / 2} Z`} fill={theme.water} opacity="0.5" />
      <path d={`M${x + 10} ${y + h / 2} C${x + w * 0.35} ${y + 4} ${x + w * 0.63} ${y + h - 3} ${x + w - 8} ${y + h / 2}`} stroke="#d2f1ed" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.45" />
    </g>
  );
}

export function LevelTwoCavernRenderer({ connections, secretStroke, isPlayer, presentation = 'screen' }: LevelTwoRendererProps) {
  const roomNumbers = [
    { x: 96, y: 238, label: '1' },
    { x: 218, y: 174, label: '2' },
    { x: 222, y: 326, label: '3' },
    { x: 352, y: 220, label: '4' },
    { x: 498, y: 154, label: '5' },
    { x: 600, y: 300, label: '6' },
  ];
  const footprintPath = 'M34 226 C118 110 186 286 276 190 C360 102 454 84 536 180 C594 248 618 360 690 278 C628 398 526 410 454 354 C358 398 280 380 220 344 C144 354 66 322 34 226 Z';

  return (
    <>
      <LevelTwoFoundation id="level-two-cavern-footprint" path={footprintPath} theme={cavernTheme} presentation={presentation}>
        <path d="M52 226 C142 118 196 318 286 194 S440 80 526 188 S612 354 684 278" stroke={cavernTheme.shadow} strokeWidth="46" strokeLinecap="round" fill="none" opacity="0.18" />
        <path d="M66 236 C150 146 202 294 286 212 S438 112 510 198 S598 330 662 282" stroke={cavernTheme.wallHighlight} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.18" strokeDasharray="3 16" />
        <path d="M118 136 C178 102 250 116 304 150 M438 96 C508 88 568 134 602 196 M108 350 C188 390 282 378 340 330" stroke={cavernTheme.moss} strokeWidth="15" strokeLinecap="round" fill="none" opacity="0.1" />
      </LevelTwoFoundation>
      <LevelTwoConnectionApron connections={connections} theme={cavernTheme} presentation={presentation} />
      <LevelTwoConnectionRoutes connections={connections} secretStroke={secretStroke} isPlayer={isPlayer} theme={cavernTheme} variant="cavern" presentation={presentation} />
      <LevelTwoCavernChamber cx={96} cy={238} rx={68} ry={52} theme={cavernTheme} seed={1} />
      <LevelTwoCavernChamber cx={218} cy={174} rx={72} ry={48} theme={cavernTheme} seed={2} />
      <LevelTwoCavernChamber cx={222} cy={326} rx={68} ry={48} theme={cavernTheme} seed={3} />
      <LevelTwoCavernChamber cx={352} cy={220} rx={86} ry={62} theme={cavernTheme} seed={4} />
      <LevelTwoCavernChamber cx={498} cy={154} rx={70} ry={52} theme={cavernTheme} seed={5} />
      <LevelTwoCavernChamber cx={600} cy={300} rx={78} ry={58} theme={cavernTheme} final seed={6} />
      <g>
        <LevelTwoUndergroundPool x={460} y={150} w={74} h={22} theme={cavernTheme} />
        <LevelTwoUndergroundPool x={570} y={306} w={54} h={18} theme={cavernTheme} />
        <LevelTwoMineralVein x={378} y={194} w={48} rotate={-32} theme={cavernTheme} />
        <LevelTwoMineralVein x={190} y={166} w={42} rotate={12} theme={cavernTheme} />
        <LevelTwoMineralVein x={548} y={284} w={52} rotate={18} theme={cavernTheme} />
        <LevelTwoFungusPatch x={116} y={260} scale={0.72} theme={cavernTheme} />
        <LevelTwoFungusPatch x={474} y={178} scale={0.66} theme={cavernTheme} />
        <LevelTwoStoneCluster x={322} y={238} scale={0.72} theme={cavernTheme} />
        <LevelTwoStoneCluster x={232} y={340} scale={0.58} theme={cavernTheme} />
        <LevelTwoRubble x={584} y={326} scale={0.55} theme={cavernTheme} />
        <LevelTwoCrack x={184} y={170} scale={0.68} stroke="#3d3932" />
        <LevelTwoCrack x={324} y={234} scale={0.78} stroke="#3d3932" />
        <LevelTwoCrack x={232} y={340} scale={0.64} stroke="#3d3932" />
      </g>
      {!isPlayer && (
        <>
          <LevelTwoMarker x={410} y={184} label="H" presentation={presentation} />
          <LevelTwoMarker x={270} y={300} label="T" presentation={presentation} />
          <LevelTwoMarker x={652} y={276} label="B" presentation={presentation} />
        </>
      )}
      <LevelTwoRoomNumbers rooms={roomNumbers} presentation={presentation} />
    </>
  );
}
