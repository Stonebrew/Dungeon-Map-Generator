import type { MapConnection } from '../../../../types';
import { forestRuinTheme } from '../themes';
import { LevelTwoCrack, LevelTwoDebris, LevelTwoFoundation, LevelTwoMarker, LevelTwoMoss, LevelTwoRoomNumbers, LevelTwoRubble, LevelTwoWater } from '../shared';

function RootTendril({ x, y, w = 80, rotate = 0 }: { x: number; y: number; w?: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.78">
      <path d={`M0 0 C${w * 0.22} -18 ${w * 0.55} 20 ${w} 0`} stroke="#4a2e1e" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d={`M${w * 0.35} 2 C${w * 0.46} 10 ${w * 0.58} 16 ${w * 0.72} 20`} stroke="#5b3a24" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d={`M${w * 0.22} -3 C${w * 0.3} -12 ${w * 0.42} -17 ${w * 0.52} -20`} stroke="#5b3a24" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </g>
  );
}

function FeyLight({ x, y, r = 12 }: { x: number; y: number; r?: number }) {
  return (
    <g opacity="0.82">
      <circle cx={x} cy={y} r={r + 9} fill="#98e49a" opacity="0.11" />
      <circle cx={x} cy={y} r={r} fill="#ccffb8" opacity="0.2" />
      <circle cx={x} cy={y} r="2.5" fill="#efffdc" opacity="0.88" />
    </g>
  );
}

function MushroomCluster({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity="0.82">
      {[0, 10, 21].map((offset, index) => (
        <g key={offset}>
          <path d={`M${offset + 4} 16 V8`} stroke="#d8d0b1" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx={offset + 4} cy="7" rx={index === 1 ? 6 : 4.5} ry="3.2" fill={index === 1 ? forestRuinTheme.runeGlow : '#c68fd0'} opacity="0.68" />
        </g>
      ))}
    </g>
  );
}

function VineMark({ x, y, w = 70, rotate = 0 }: { x: number; y: number; w?: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.72">
      <path d={`M0 0 C${w * 0.22} -12 ${w * 0.48} 12 ${w} 0`} stroke={forestRuinTheme.moss} strokeWidth="3" strokeLinecap="round" fill="none" />
      {[12, 28, 46, 60].map((offset) => (
        <path key={offset} d={`M${offset} 0 c6 -8 12 -8 17 -2 c-6 6 -12 8 -17 2 Z`} fill="#5f9147" opacity="0.62" />
      ))}
    </g>
  );
}

function StandingStone({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.84">
      <path d="M-13 18 L-9 -14 L4 -22 L14 -10 L11 19 Z" fill={forestRuinTheme.wallMid} stroke={forestRuinTheme.wallStroke} strokeWidth="2" />
      <path d="M-5 -8 h10 M-2 5 h8" stroke={forestRuinTheme.runeGlow} strokeWidth="1.5" opacity="0.45" />
    </g>
  );
}

function LeafScatter({ x, y }: { x: number; y: number }) {
  return (
    <g opacity="0.62">
      <path d={`M${x} ${y} c8 -8 15 -6 19 2 c-8 6 -14 6 -19 -2 Z M${x + 22} ${y + 10} c7 -6 13 -3 15 3 c-7 5 -11 4 -15 -3 Z M${x + 8} ${y + 20} c8 -7 14 -4 17 3 c-7 5 -13 4 -17 -3 Z`} fill="#66853d" />
    </g>
  );
}

function TreeCluster({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity="0.86">
      {[
        { x: 0, y: 12, r: 22 },
        { x: 22, y: 4, r: 26 },
        { x: 46, y: 16, r: 20 },
        { x: 24, y: 28, r: 18 },
      ].map((tree) => (
        <g key={`${tree.x}-${tree.y}`}>
          <circle cx={tree.x} cy={tree.y} r={tree.r} fill="#284326" opacity="0.68" />
          <circle cx={tree.x - 5} cy={tree.y - 6} r={tree.r * 0.56} fill="#496d35" opacity="0.56" />
          <circle cx={tree.x + 3} cy={tree.y + 4} r="4" fill="#5a3923" opacity="0.7" />
        </g>
      ))}
    </g>
  );
}

function RockCluster({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity="0.78">
      <path d="M0 18 l12 -15 l18 6 l-4 18 l-20 4 Z" fill="#68715a" stroke="#354236" strokeWidth="1.4" />
      <path d="M28 20 l13 -13 l16 7 l-3 17 l-18 5 Z" fill="#798064" stroke="#354236" strokeWidth="1.4" />
      <path d="M10 14 h12 M36 18 h13" stroke="#c4c7a7" strokeWidth="1.2" opacity="0.36" />
    </g>
  );
}

function forestClearingPath(cx: number, cy: number, rx: number, ry: number, seed = 0) {
  const offsets = [
    [0, -1, -6 + seed, 0],
    [0.62, -0.76, 10, -7],
    [1, -0.08, 6, 5],
    [0.78, 0.72, -7, 8],
    [0.08, 1, 3, -3],
    [-0.62, 0.76, -10, 5],
    [-1, 0.06, -5, -7],
    [-0.72, -0.64, 7, -9],
  ];
  const points = offsets.map(([mx, my, ox, oy]) => [cx + mx * rx + ox, cy + my * ry + oy]);

  return `M${points[0][0]} ${points[0][1]} C${points[1][0]} ${points[1][1]} ${points[1][0]} ${points[1][1]} ${points[2][0]} ${points[2][1]} C${points[3][0]} ${points[3][1]} ${points[3][0]} ${points[3][1]} ${points[4][0]} ${points[4][1]} C${points[5][0]} ${points[5][1]} ${points[5][0]} ${points[5][1]} ${points[6][0]} ${points[6][1]} C${points[7][0]} ${points[7][1]} ${points[7][0]} ${points[7][1]} ${points[0][0]} ${points[0][1]} Z`;
}

function BrokenRuinWall({ x, y, w = 72, rotate = 0 }: { x: number; y: number; w?: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.86">
      <path d={`M0 0 h${w * 0.34} M${w * 0.5} 0 h${w * 0.28} M${w * 0.88} 0 h${w * 0.12}`} stroke={forestRuinTheme.wallDark} strokeWidth="12" strokeLinecap="round" />
      <path d={`M3 -2 h${w * 0.25} M${w * 0.54} -2 h${w * 0.2}`} stroke={forestRuinTheme.wallHighlight} strokeWidth="2" strokeLinecap="round" opacity="0.46" />
      <path d={`M${w * 0.36} -4 l8 -4 l7 7 l-6 8 Z M${w * 0.8} 3 l6 -3 l5 5 l-5 5 Z`} fill={forestRuinTheme.rubble} opacity="0.7" />
    </g>
  );
}

function OvergrownThreshold({ x, y, w = 64, rotate = 0 }: { x: number; y: number; w?: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.78">
      <path d={`M0 0 H${w}`} stroke={forestRuinTheme.wallMid} strokeWidth="7" strokeLinecap="round" />
      <path d={`M4 1 C18 -8 28 7 42 -2 S58 2 ${w} -3`} stroke={forestRuinTheme.moss} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d={`M9 4 l8 -6 M${w - 22} 4 l7 -7`} stroke={forestRuinTheme.floorHighlight} strokeWidth="1.3" opacity="0.45" />
    </g>
  );
}

function ForestKeyedArea({
  cx,
  cy,
  rx,
  ry,
  seed,
  final = false,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  seed: number;
  final?: boolean;
}) {
  const outerPath = forestClearingPath(cx, cy, rx, ry, seed);
  const innerPath = forestClearingPath(cx, cy, rx - 8, ry - 7, seed + 2);
  const clipId = `forest-keyed-area-${cx}-${cy}`;
  const floor = final ? forestRuinTheme.floorTiles[1] : forestRuinTheme.floorTiles[0];

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <path d={innerPath} />
        </clipPath>
      </defs>
      <path d={outerPath} fill={forestRuinTheme.shadow} opacity="0.1" transform="translate(4 8)" />
      <path d={outerPath} fill="#506b3a" opacity="0.2" />
      <path d={innerPath} fill={floor} opacity="0.58" />
      <g clipPath={`url(#${clipId})`}>
        <rect x={cx - rx} y={cy - ry} width={rx * 2} height={ry * 2} fill={floor} opacity="0.34" />
        <path d={`M${cx - rx + 8} ${cy - 8} C${cx - 18} ${cy - 28} ${cx + 24} ${cy + 30} ${cx + rx - 12} ${cy + 4}`} stroke={forestRuinTheme.floorStroke} strokeWidth="4" fill="none" opacity="0.15" />
        <path d={`M${cx - rx + 18} ${cy + ry - 14} C${cx - 12} ${cy + ry - 30} ${cx + 24} ${cy + ry - 4} ${cx + rx - 22} ${cy + ry - 20}`} stroke={forestRuinTheme.moss} strokeWidth="7" fill="none" opacity="0.18" />
        {Array.from({ length: 8 }).map((_, index) => {
          const x = cx - rx + 14 + ((index * 29 + seed * 13) % Math.max(24, rx * 2 - 28));
          const y = cy - ry + 12 + ((index * 17 + seed * 11) % Math.max(24, ry * 2 - 24));
          return <rect key={index} x={x} y={y} width={index % 3 === 0 ? 20 : 14} height={index % 2 === 0 ? 10 : 14} rx="2" fill={forestRuinTheme.floorTiles[(index + seed) % forestRuinTheme.floorTiles.length]} stroke={forestRuinTheme.floorStroke} strokeWidth="0.8" opacity="0.24" transform={`rotate(${(index % 5) * 4 - 8} ${x} ${y})`} />;
        })}
      </g>
      <path d={outerPath} fill="none" stroke={forestRuinTheme.moss} strokeWidth="2.6" opacity="0.22" strokeDasharray="3 16" />
    </g>
  );
}

function ForestTrailRoutes({ connections, secretStroke, isPlayer }: { connections: MapConnection[]; secretStroke: string; isPlayer: boolean }) {
  const normalPaths = connections.filter((connection) => connection.type === 'normal' && connection.path).map((connection) => connection.path as string);
  const secretPaths = connections.filter((connection) => connection.type === 'secret' && connection.path).map((connection) => connection.path as string);

  return (
    <g>
      {normalPaths.map((path) => (
        <g key={`${path}-forest-trail`}>
          <path d={path} stroke="#172011" strokeWidth="42" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.05" />
          <path d={path} stroke="#566b3f" strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.14" />
          <path d={path} stroke="#9b895e" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.46" />
          <path d={path} stroke="#d0bd85" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.26" strokeDasharray="8 18" />
          <path d={path} stroke="#446238" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.26" strokeDasharray="3 20" />
        </g>
      ))}
      {!isPlayer &&
        secretPaths.map((path) => (
          <g key={`${path}-hidden-game-trail`}>
            <path d={path} stroke={secretStroke} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8" strokeDasharray="8 9" filter="url(#inkRoughen)" />
            <path d={path} stroke="#4a2e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.46" strokeDasharray="2 13" />
          </g>
        ))}
    </g>
  );
}

export function LevelTwoForestRuinRenderer({ connections, secretStroke, isPlayer }: { connections: MapConnection[]; secretStroke: string; isPlayer: boolean }) {
  const roomNumbers = [
    { x: 126, y: 246, label: '1' },
    { x: 292, y: 190, label: '2' },
    { x: 476, y: 190, label: '3' },
    { x: 536, y: 347, label: '4' },
    { x: 335, y: 349, label: '5' },
    { x: 166, y: 358, label: '6' },
  ];
  const footprintPath =
    'M48 210 C94 118 194 138 248 122 C330 72 438 110 520 136 C608 166 644 270 606 356 C562 456 430 430 352 426 C268 468 132 442 78 372 C28 306 30 250 48 210 Z';

  return (
    <>
      <LevelTwoFoundation id="level-two-forest-ruin-footprint" path={footprintPath} theme={forestRuinTheme}>
        <path d="M54 224 C126 148 210 154 286 144 S448 130 560 188 C616 244 614 328 568 378 C486 430 398 398 338 410 C244 438 146 418 82 356 C42 306 34 258 54 224 Z" fill="#496238" opacity="0.28" />
        <path d="M72 220 C150 154 218 160 290 150 S446 128 540 176 M82 382 C164 430 252 402 334 384 S506 414 584 340" stroke={forestRuinTheme.moss} strokeWidth="28" strokeLinecap="round" fill="none" opacity="0.12" />
        <path d="M100 284 C178 248 240 288 310 260 S458 220 548 270" stroke={forestRuinTheme.water} strokeWidth="13" strokeLinecap="round" fill="none" opacity="0.08" />
        <path d="M78 206 C144 156 222 150 300 134 M420 134 C506 142 574 196 598 278 M96 382 C178 420 258 410 340 386" stroke="#172011" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.08" strokeDasharray="34 22 12 18" />
      </LevelTwoFoundation>
      <path d="M98 206 C166 164 232 172 304 154 C386 136 474 156 546 196 C572 260 548 320 576 358 C496 402 424 386 350 398 C260 418 172 398 108 350 C76 298 78 248 98 206 Z" fill="#41592f" opacity="0.09" />
      <TreeCluster x={36} y={126} scale={0.92} />
      <TreeCluster x={572} y={148} scale={0.78} />
      <TreeCluster x={40} y={356} scale={0.76} />
      <TreeCluster x={610} y={350} scale={0.68} />
      <TreeCluster x={356} y={96} scale={0.58} />
      <RockCluster x={388} y={248} scale={0.68} />
      <RockCluster x={214} y={392} scale={0.56} />
      <ForestTrailRoutes connections={connections} secretStroke={secretStroke} isPlayer={isPlayer} />
      <ForestKeyedArea cx={126} cy={246} rx={74} ry={58} seed={1} />
      <ForestKeyedArea cx={292} cy={190} rx={82} ry={62} seed={2} />
      <ForestKeyedArea cx={476} cy={190} rx={76} ry={58} seed={3} />
      <ForestKeyedArea cx={536} cy={347} rx={84} ry={60} final seed={4} />
      <ForestKeyedArea cx={335} cy={349} rx={80} ry={58} seed={5} />
      <ForestKeyedArea cx={166} cy={358} rx={74} ry={52} seed={6} />
      <g>
        <RootTendril x={62} y={220} w={132} rotate={10} />
        <RootTendril x={232} y={214} w={128} rotate={-18} />
        <RootTendril x={430} y={214} w={112} rotate={18} />
        <RootTendril x={280} y={370} w={126} rotate={-6} />
        <RootTendril x={124} y={398} w={86} rotate={-20} />
        <RootTendril x={474} y={392} w={106} rotate={-28} />
        <BrokenRuinWall x={96} y={206} w={84} rotate={-4} />
        <BrokenRuinWall x={252} y={150} w={92} rotate={6} />
        <BrokenRuinWall x={420} y={172} w={74} rotate={-12} />
        <BrokenRuinWall x={488} y={374} w={82} rotate={8} />
        <BrokenRuinWall x={302} y={326} w={68} rotate={-18} />
        <OvergrownThreshold x={112} y={286} w={58} rotate={4} />
        <OvergrownThreshold x={322} y={376} w={66} rotate={-10} />
        <VineMark x={118} y={280} w={60} rotate={-10} />
        <VineMark x={430} y={170} w={66} rotate={6} />
        <VineMark x={490} y={366} w={70} rotate={-8} />
        <VineMark x={242} y={150} w={82} rotate={-4} />
        <LevelTwoMoss x={74} y={258} scale={0.62} theme={forestRuinTheme} />
        <LevelTwoMoss x={318} y={168} scale={0.52} theme={forestRuinTheme} />
        <LevelTwoMoss x={506} y={326} scale={0.58} theme={forestRuinTheme} />
        <LevelTwoRubble x={232} y={176} scale={0.58} theme={forestRuinTheme} />
        <LevelTwoRubble x={536} y={370} scale={0.52} theme={forestRuinTheme} />
        <LevelTwoWater x={118} y={372} w={58} h={11} theme={forestRuinTheme} />
        <StandingStone x={476} y={190} rotate={-8} />
        <StandingStone x={172} y={352} rotate={11} />
        <FeyLight x={292} y={190} r={11} />
        <FeyLight x={532} y={346} r={12} />
        <MushroomCluster x={508} y={218} scale={0.72} />
        <MushroomCluster x={142} y={376} scale={0.62} />
        <LeafScatter x={86} y={194} />
        <LeafScatter x={386} y={392} />
        <LevelTwoDebris x={238} y={334} fill="#576843" />
        <LevelTwoDebris x={532} y={174} fill="#576843" />
        <LevelTwoCrack x={262} y={164} scale={0.72} stroke="#34462e" />
        <LevelTwoCrack x={504} y={330} scale={0.7} stroke="#34462e" />
      </g>
      {!isPlayer && (
        <>
          <LevelTwoMarker x={330} y={164} label="H" />
          <LevelTwoMarker x={520} y={326} label="T" />
          <LevelTwoMarker x={188} y={340} label="B" />
        </>
      )}
      <LevelTwoRoomNumbers rooms={roomNumbers} />
    </>
  );
}
