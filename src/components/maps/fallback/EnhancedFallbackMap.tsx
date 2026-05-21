import type { DungeonMapData, MapConnection, MapStyle } from '../../../types';

export type MapPalette = {
  roomFill: string;
  featureFill: string;
  secretStroke: string;
  finalFill: string;
  wallStroke: string;
  floorLine: string;
  roomShadow: string;
  water: string;
  accent: string;
};

function StoneFloor({ x, y, w, h, clipId }: { x: number; y: number; w: number; h: number; clipId: string }) {
  const tileW = 28;
  const tileH = 22;
  const cols = Math.ceil(w / tileW) + 1;
  const rows = Math.ceil(h / tileH) + 1;

  return (
    <g clipPath={`url(#${clipId})`}>
      <rect x={x} y={y} width={w} height={h} fill="#d9c9ac" />
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((__, col) => {
          const px = x + col * tileW - (row % 2 ? 12 : 0);
          const py = y + row * tileH;
          const tone = (row + col) % 3 === 0 ? '#cbb995' : (row + col) % 3 === 1 ? '#e4d6bd' : '#d4c19e';
          return <rect key={`${row}-${col}`} x={px} y={py} width={tileW + 1} height={tileH + 1} fill={tone} stroke="#8b6f4d" strokeWidth="1.1" opacity="0.72" />;
        }),
      )}
      <path d={`M${x + 12} ${y + h * 0.35} l24 -11 l15 18 M${x + w * 0.58} ${y + h - 18} l18 -16 l20 12`} stroke="#6f563d" strokeWidth="1.7" strokeLinecap="round" fill="none" opacity="0.38" />
      <rect x={x + 9} y={y + 9} width={w - 18} height={h - 18} rx="4" fill="none" stroke="#fff6e6" strokeWidth="2" opacity="0.32" />
      <rect x={x + 7} y={y + 7} width={w - 14} height={h - 14} rx="4" fill="none" stroke="#5b4331" strokeWidth="2.5" opacity="0.18" />
    </g>
  );
}

function WallStoneDetail({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const topMarks = [0.18, 0.38, 0.62, 0.82];
  const sideMarks = [0.25, 0.55, 0.78];

  return (
    <g opacity="0.48">
      {topMarks.map((mark) => (
        <path key={`top-${mark}`} d={`M${x + w * mark} ${y - 3} v10 M${x + w * mark} ${y + h - 7} v10`} stroke="#f4e8d2" strokeWidth="1.6" strokeLinecap="round" />
      ))}
      {sideMarks.map((mark) => (
        <path key={`side-${mark}`} d={`M${x - 3} ${y + h * mark} h10 M${x + w - 7} ${y + h * mark} h10`} stroke="#f4e8d2" strokeWidth="1.6" strokeLinecap="round" />
      ))}
      <path d={`M${x + 8} ${y + 4} h18 M${x + w - 30} ${y + h - 5} h20 M${x + 4} ${y + h - 24} v18`} stroke="#2b211b" strokeWidth="2" strokeLinecap="round" opacity="0.42" />
    </g>
  );
}

function RubbleChips({ chips }: { chips: { x: number; y: number; r?: number }[] }) {
  return (
    <g opacity="0.62">
      {chips.map((chip) => (
        <path key={`${chip.x}-${chip.y}`} d={`M${chip.x} ${chip.y} l${chip.r ?? 5} -2 l3 5 l-${chip.r ?? 5} 3 Z`} fill="#77624b" opacity="0.48" />
      ))}
    </g>
  );
}

function MapRoom({
  x,
  y,
  w,
  h,
  fill,
  palette,
  enhanced,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  fill: string;
  palette: MapPalette;
  enhanced: boolean;
}) {
  const clipId = `stone-room-${x}-${y}-${w}-${h}`;

  return (
    <g>
      {enhanced && (
        <defs>
          <clipPath id={clipId}>
            <rect x={x + 8} y={y + 8} width={w - 16} height={h - 16} rx="4" />
          </clipPath>
        </defs>
      )}
      {enhanced && <rect x={x - 9} y={y + 8} width={w + 18} height={h + 10} rx="10" fill={palette.roomShadow} opacity="0.32" />}
      <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx="8" fill="none" stroke={palette.floorLine} strokeWidth={enhanced ? '5' : '3'} opacity={enhanced ? '0.42' : '0.2'} />
      <rect x={x} y={y} width={w} height={h} rx="5" fill={fill} stroke={palette.wallStroke} strokeWidth={enhanced ? '10' : '6'} filter={enhanced ? 'url(#inkRoughen)' : undefined} />
      {enhanced && <StoneFloor x={x + 8} y={y + 8} w={w - 16} h={h - 16} clipId={clipId} />}
      {enhanced && <WallStoneDetail x={x} y={y} w={w} h={h} />}
      <path d={`M${x + 12} ${y + 10} H${x + w - 12} M${x + 12} ${y + h - 10} H${x + w - 12}`} stroke={palette.floorLine} strokeWidth={enhanced ? '2' : '1.5'} opacity={enhanced ? '0.38' : '0.1'} />
    </g>
  );
}

function RoomNumber({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect x={x - 20} y={y - 20} width="40" height="40" rx="10" fill="#fff8ef" opacity="0.82" />
      <text x={x} y={y + 9} textAnchor="middle" fontSize="34" fontWeight="900" fill="#211a16" paintOrder="stroke" stroke="#fff8ef" strokeWidth="4">
        {label}
      </text>
    </g>
  );
}

function RoomNumbers({ rooms }: { rooms: { x: number; y: number; label: string }[] }) {
  return (
    <>
      {rooms.map((room) => (
        <RoomNumber key={room.label} {...room} />
      ))}
    </>
  );
}

function MapMarker({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g filter="url(#markerInk)">
      <circle cx={x} cy={y} r="12" fill="#fff8ef" stroke="#7b3f28" strokeWidth="2.5" />
      <circle cx={x} cy={y} r="8.5" fill="#b85c38" opacity="0.94" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff8ef">
        {label}
      </text>
    </g>
  );
}

function OvalRoom({
  cx,
  cy,
  rx,
  ry,
  fill,
  palette,
  enhanced,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  label?: string;
  fill: string;
  palette: MapPalette;
  enhanced: boolean;
}) {
  const clipId = `cave-room-${cx}-${cy}-${rx}-${ry}`;

  return (
    <g>
      {enhanced && (
        <defs>
          <clipPath id={clipId}>
            <ellipse cx={cx} cy={cy} rx={rx - 8} ry={ry - 7} />
          </clipPath>
        </defs>
      )}
      {enhanced && <ellipse cx={cx + 5} cy={cy + 9} rx={rx + 12} ry={ry + 10} fill={palette.roomShadow} opacity="0.3" />}
      <ellipse cx={cx} cy={cy} rx={rx + 3} ry={ry + 3} fill="none" stroke={palette.floorLine} strokeWidth={enhanced ? '5' : '3'} opacity={enhanced ? '0.38' : '0.18'} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} stroke={palette.wallStroke} strokeWidth={enhanced ? '10' : '6'} filter={enhanced ? 'url(#inkRoughen)' : undefined} />
      {enhanced && (
        <g clipPath={`url(#${clipId})`}>
          <ellipse cx={cx} cy={cy} rx={rx - 8} ry={ry - 7} fill="url(#premiumCaveFloor)" opacity="0.94" />
          <path d={`M${cx - rx + 18} ${cy + 4} C${cx - 18} ${cy - 22} ${cx + 20} ${cy + 28} ${cx + rx - 18} ${cy - 4}`} stroke="#675744" strokeWidth="5" fill="none" opacity="0.24" />
          <path d={`M${cx - 34} ${cy + ry - 20} l18 -10 l15 14 M${cx + 12} ${cy - ry + 22} l20 -8 l14 16`} stroke="#5f5146" strokeWidth="2" fill="none" opacity="0.44" />
        </g>
      )}
      {enhanced && <ellipse cx={cx} cy={cy} rx={rx - 14} ry={ry - 12} fill="none" stroke="#fff8ef" strokeWidth="2" opacity="0.22" />}
      <path d={`M${cx - rx + 18} ${cy - ry / 2} C${cx - 18} ${cy - ry / 2 - 6} ${cx + 18} ${cy - ry / 2 + 6} ${cx + rx - 18} ${cy - ry / 2}`} stroke={palette.floorLine} strokeWidth={enhanced ? '2' : '1.5'} fill="none" opacity={enhanced ? '0.34' : '0.1'} />
    </g>
  );
}

type CorridorKind = 'constructed' | 'natural';

function Corridors({ paths, kind = 'constructed', enhanced }: { paths: string[]; kind?: CorridorKind; enhanced: boolean }) {
  const isNatural = kind === 'natural';
  const shadowWidth = enhanced ? (isNatural ? 38 : 32) : 14;
  const wallWidth = enhanced ? (isNatural ? 25 : 22) : 10;
  const floorWidth = enhanced ? (isNatural ? 15 : 16) : 6;
  const wallOpacity = enhanced ? (isNatural ? 0.72 : 0.5) : 0.9;
  const centerlineOpacity = enhanced ? (isNatural ? 0.18 : 0.16) : 0.08;

  return (
    <>
      {paths.map((path) => (
        <path key={`${path}-shadow`} d={path} stroke={enhanced ? '#7b5d45' : '#111'} strokeWidth={shadowWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={enhanced ? (isNatural ? '0.18' : '0.12') : '0.08'} />
      ))}
      {paths.map((path) => (
        <path
          key={`${path}-wall`}
          d={path}
          stroke={enhanced ? (isNatural ? '#211a16' : '#4a392e') : '#161616'}
          strokeWidth={wallWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={wallOpacity}
          filter={enhanced && isNatural ? 'url(#inkRoughen)' : undefined}
        />
      ))}
      {paths.map((path) => (
        <path key={`${path}-floor`} d={path} stroke={enhanced ? (isNatural ? '#efe4cf' : '#f7f1e4') : '#f8f8f8'} strokeWidth={floorWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={enhanced ? (isNatural ? '0.96' : '0.98') : '1'} />
      ))}
      {enhanced &&
        paths.map((path) => (
          <path key={`${path}-texture`} d={path} stroke={isNatural ? '#8b795f' : '#c8ab80'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isNatural ? '0.3' : '0.26'} strokeDasharray={isNatural ? '2 12' : '12 14'} />
        ))}
      {paths.map((path) => (
        <path key={`${path}-centerline`} d={path} stroke={enhanced ? '#b79d7a' : '#111'} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={centerlineOpacity} strokeDasharray={isNatural ? '4 11' : '7 12'} />
      ))}
    </>
  );
}

function SecretRoutes({ paths, stroke }: { paths: string[]; stroke: string }) {
  return (
    <>
      {paths.map((path) => (
        <path
          key={`${path}-secret`}
          d={path}
          stroke={stroke}
          strokeWidth="4.5"
          strokeDasharray="10 8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#inkRoughen)"
        />
      ))}
    </>
  );
}

function ConnectionRoutes({
  connections,
  palette,
  isPlayer,
  kind = 'constructed',
  enhanced,
}: {
  connections: MapConnection[];
  palette: MapPalette;
  isPlayer: boolean;
  kind?: CorridorKind;
  enhanced: boolean;
}) {
  const normalPaths = connections.filter((connection) => connection.type === 'normal' && connection.path).map((connection) => connection.path as string);
  const secretPaths = connections.filter((connection) => connection.type === 'secret' && connection.path).map((connection) => connection.path as string);

  return (
    <>
      <Corridors paths={normalPaths} kind={kind} enhanced={enhanced} />
      {!isPlayer && <SecretRoutes paths={secretPaths} stroke={palette.secretStroke} />}
    </>
  );
}

export function MapTexture({ isPlayer, enhanced }: { isPlayer: boolean; enhanced: boolean }) {
  if (!enhanced) {
    return (
      <>
        <rect x="0" y="0" width="720" height="480" fill="#f7f7f7" />
        <g opacity="0.1">
          {Array.from({ length: 8 }).map((_, index) => (
            <path key={index} d={`M${80 + index * 78} 0 V480`} stroke="#111" strokeWidth="0.7" />
          ))}
          {Array.from({ length: 5 }).map((_, index) => (
            <path key={index} d={`M0 ${80 + index * 78} H720`} stroke="#111" strokeWidth="0.7" />
          ))}
        </g>
      </>
    );
  }

  return (
    <>
      <rect x="0" y="0" width="720" height="480" fill="url(#paperBase)" />
      <rect x="0" y="0" width="720" height="480" fill="url(#paperGrain)" opacity={isPlayer ? '0.25' : '0.34'} />
      <path d="M360 28 V452 M30 240 H690" stroke="#8c7355" strokeWidth="1.2" opacity="0.12" strokeDasharray="18 12" />
      <path d="M96 88 C132 52 212 62 232 108 M516 382 C574 348 626 360 666 398" stroke="#a46f43" strokeWidth="38" fill="none" opacity={isPlayer ? '0.04' : '0.07'} />
      <g opacity={isPlayer ? '0.06' : '0.1'}>
        {Array.from({ length: 8 }).map((_, index) => (
          <path key={index} d={`M${80 + index * 78} 0 V480`} stroke="#7b5d45" strokeWidth="0.8" />
        ))}
        {Array.from({ length: 5 }).map((_, index) => (
          <path key={index} d={`M0 ${80 + index * 78} H720`} stroke="#7b5d45" strokeWidth="0.8" />
        ))}
      </g>
    </>
  );
}

export function MapDefs() {
  return (
    <defs>
      <linearGradient id="paperBase" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#f2ead8" />
        <stop offset="48%" stopColor="#e8dcc4" />
        <stop offset="100%" stopColor="#f5eedf" />
      </linearGradient>
      <pattern id="paperGrain" width="28" height="28" patternUnits="userSpaceOnUse">
        <rect width="28" height="28" fill="transparent" />
        <circle cx="3" cy="7" r="0.7" fill="#7b5d45" opacity="0.32" />
        <circle cx="18" cy="5" r="0.5" fill="#9a7d5b" opacity="0.26" />
        <circle cx="24" cy="18" r="0.8" fill="#7b5d45" opacity="0.2" />
        <path d="M6 23 C10 21 14 24 18 22" stroke="#9a7d5b" strokeWidth="0.6" opacity="0.22" fill="none" />
      </pattern>
      <pattern id="stoneTile" width="28" height="28" patternUnits="userSpaceOnUse">
        <rect width="28" height="28" fill="transparent" />
        <path d="M0 14 H28 M14 0 V28" stroke="#7b5d45" strokeWidth="0.8" opacity="0.25" />
        <path d="M2 2 H12 M17 18 H26" stroke="#ffffff" strokeWidth="0.8" opacity="0.16" />
      </pattern>
      <pattern id="premiumStoneTile" width="36" height="36" patternUnits="userSpaceOnUse">
        <rect width="36" height="36" fill="#e9dec8" opacity="0.78" />
        <path d="M0 18 H36 M18 0 V36" stroke="#8a6b4b" strokeWidth="1.2" opacity="0.34" />
        <path d="M5 5 H15 M22 24 H32 M24 7 V15" stroke="#fffaf0" strokeWidth="1.2" opacity="0.32" />
        <path d="M9 28 l8 -5 l6 7" stroke="#75583d" strokeWidth="0.9" opacity="0.2" fill="none" />
      </pattern>
      <pattern id="premiumCaveFloor" width="30" height="30" patternUnits="userSpaceOnUse">
        <rect width="30" height="30" fill="#d9cbb1" opacity="0.8" />
        <circle cx="7" cy="8" r="2" fill="#6b5a48" opacity="0.24" />
        <circle cx="22" cy="17" r="1.4" fill="#8d765d" opacity="0.28" />
        <path d="M3 25 C9 17 14 29 21 20" stroke="#5f5146" strokeWidth="1.4" opacity="0.24" fill="none" />
      </pattern>
      <pattern id="caveSpeckle" width="22" height="22" patternUnits="userSpaceOnUse">
        <rect width="22" height="22" fill="transparent" />
        <circle cx="5" cy="6" r="1.2" fill="#5d5147" opacity="0.2" />
        <circle cx="16" cy="13" r="0.9" fill="#8b795f" opacity="0.24" />
        <path d="M2 18 C6 14 10 20 14 16" stroke="#5d5147" strokeWidth="0.8" opacity="0.18" fill="none" />
      </pattern>
      <filter id="inkRoughen" x="-8%" y="-8%" width="116%" height="116%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="markerInk" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1" stdDeviation="0.7" floodColor="#211a16" floodOpacity="0.25" />
      </filter>
    </defs>
  );
}

function CrackMarks({ points, stroke }: { points: string[]; stroke: string }) {
  return (
    <>
      {points.map((path) => (
        <path key={path} d={path} stroke={stroke} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.32" />
      ))}
    </>
  );
}

function MossPatch({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity="0.72">
      <path d="M0 8 C12 -2 24 0 32 10 C22 18 10 18 0 8 Z" fill="#5d7b4c" opacity="0.5" />
      <path d="M8 10 C14 5 22 7 27 13" stroke="#2f4d32" strokeWidth="1.4" fill="none" opacity="0.42" />
    </g>
  );
}

function WaterPatch({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g opacity="0.72">
      <path d={`M${x} ${y + h / 2} C${x + w * 0.22} ${y - 4} ${x + w * 0.72} ${y + h + 5} ${x + w} ${y + h / 2}`} stroke="#4d8d96" strokeWidth={h} strokeLinecap="round" fill="none" opacity="0.34" />
      <path d={`M${x + 8} ${y + h / 2} C${x + w * 0.35} ${y + 3} ${x + w * 0.58} ${y + h - 3} ${x + w - 8} ${y + h / 2}`} stroke="#d9f2ee" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.34" />
    </g>
  );
}

function TombSlab({ x, y, w = 46, h = 16 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g opacity="0.68">
      <rect x={x} y={y} width={w} height={h} rx="3" fill="#8b7a63" opacity="0.28" />
      <path d={`M${x + 7} ${y + h / 2} H${x + w - 7}`} stroke="#5c4b3c" strokeWidth="1.4" opacity="0.4" />
    </g>
  );
}

function DrainGrate({ x, y }: { x: number; y: number }) {
  return (
    <g opacity="0.72">
      <rect x={x} y={y} width="34" height="18" rx="3" fill="#5f5146" opacity="0.26" />
      {[6, 13, 20, 27].map((offset) => (
        <path key={offset} d={`M${x + offset} ${y + 3} V${y + 15}`} stroke="#2f2925" strokeWidth="1.4" opacity="0.52" />
      ))}
    </g>
  );
}

function ArcaneCircle({ x, y, r = 24 }: { x: number; y: number; r?: number }) {
  return (
    <g opacity="0.75">
      <circle cx={x} cy={y} r={r} fill="none" stroke="#8f5fb6" strokeWidth="2" opacity="0.55" />
      <circle cx={x} cy={y} r={r * 0.55} fill="none" stroke="#d7b3ff" strokeWidth="1.6" opacity="0.4" />
      <path d={`M${x - r * 0.7} ${y + r * 0.4} L${x} ${y - r * 0.65} L${x + r * 0.7} ${y + r * 0.4} Z`} stroke="#8f5fb6" strokeWidth="1.5" fill="none" opacity="0.44" />
    </g>
  );
}

function Workbench({ x, y }: { x: number; y: number }) {
  return (
    <g opacity="0.72">
      <rect x={x} y={y} width="54" height="16" rx="3" fill="#704d32" opacity="0.42" />
      <path d={`M${x + 8} ${y + 5} H${x + 46} M${x + 12} ${y + 16} V${y + 24} M${x + 42} ${y + 16} V${y + 24}`} stroke="#3d2b22" strokeWidth="2" opacity="0.48" />
    </g>
  );
}

function SacredMark({ x, y }: { x: number; y: number }) {
  return (
    <g opacity="0.68">
      <circle cx={x} cy={y} r="18" fill="none" stroke="#a97839" strokeWidth="2" opacity="0.44" />
      <path d={`M${x} ${y - 15} V${y + 15} M${x - 13} ${y - 2} H${x + 13}`} stroke="#a97839" strokeWidth="2" opacity="0.44" />
    </g>
  );
}

function GearMark({ x, y }: { x: number; y: number }) {
  return (
    <g opacity="0.62">
      <circle cx={x} cy={y} r="15" fill="none" stroke="#6b5a48" strokeWidth="2.2" />
      <circle cx={x} cy={y} r="5" fill="#6b5a48" opacity="0.36" />
      {[0, 45, 90, 135].map((angle) => (
        <path key={angle} d={`M${x} ${y - 21} V${y - 15}`} stroke="#6b5a48" strokeWidth="2" transform={`rotate(${angle} ${x} ${y})`} />
      ))}
    </g>
  );
}

function BlackfenDetails({ palette, isPlayer }: { palette: MapPalette; isPlayer: boolean }) {
  return (
    <g opacity={isPlayer ? '0.42' : '0.58'}>
      <path d="M72 304 C154 282 242 310 314 288 S464 248 554 278" stroke={palette.water} strokeWidth="30" strokeLinecap="round" fill="none" opacity="0.24" />
      <path d="M90 158 C130 146 168 156 204 142 M392 102 C440 82 490 92 526 76" stroke={palette.accent} strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" fill="none" opacity="0.38" />
      <CrackMarks stroke={palette.floorLine} points={['M224 236 l18 -14 l9 19', 'M518 318 l20 -9 l12 17', 'M116 392 l16 -11 l8 13']} />
    </g>
  );
}

function ShrineDetails({ palette, isPlayer }: { palette: MapPalette; isPlayer: boolean }) {
  return (
    <g opacity={isPlayer ? '0.42' : '0.62'}>
      <path d="M168 130 H480 M168 406 H480 M146 150 V390 M504 150 V390" stroke={palette.floorLine} strokeWidth="2" strokeDasharray="18 10" fill="none" opacity="0.35" />
      <path d="M328 176 l10 18 l20 2 l-15 12 l5 20 l-20 -10 l-18 10 l5 -20 l-15 -12 l20 -2 Z" fill={palette.accent} opacity="0.16" />
      <CrackMarks stroke={palette.floorLine} points={['M462 288 l18 -20 l16 12', 'M242 346 l24 -12 l16 18', 'M176 222 l15 -10 l18 14']} />
    </g>
  );
}

function CavernDetails({ palette, isPlayer }: { palette: MapPalette; isPlayer: boolean }) {
  return (
    <g opacity={isPlayer ? '0.44' : '0.62'}>
      <path d="M420 118 C462 96 522 104 548 138 C526 166 464 174 420 154 Z" fill={palette.water} opacity="0.24" />
      <path d="M252 350 C318 376 416 374 496 338" stroke={palette.accent} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.22" />
      <CrackMarks stroke={palette.floorLine} points={['M124 250 l18 -8 l10 14', 'M338 184 l16 -22 l18 18', 'M604 342 l22 -12 l12 18']} />
    </g>
  );
}

function CryptDetails({ palette, isPlayer }: { palette: MapPalette; isPlayer: boolean }) {
  return (
    <g opacity={isPlayer ? '0.4' : '0.58'}>
      <path d="M132 300 h72 v20 h-72 Z M516 302 h74 v20 h-74 Z M326 318 h68 v18 h-68 Z" fill={palette.accent} opacity="0.14" />
      <path d="M120 116 H600 M120 276 H600" stroke={palette.floorLine} strokeWidth="1.4" strokeDasharray="10 12" opacity="0.28" />
      <CrackMarks stroke={palette.floorLine} points={['M374 88 l18 -16 l16 14', 'M194 378 l18 -14 l18 12', 'M548 216 l20 -11 l12 19']} />
    </g>
  );
}

function SewerDetails({ palette, isPlayer }: { palette: MapPalette; isPlayer: boolean }) {
  return (
    <g opacity={isPlayer ? '0.44' : '0.64'}>
      <path d="M48 238 H674" stroke={palette.water} strokeWidth="24" strokeLinecap="round" fill="none" opacity="0.24" />
      <path d="M156 112 V238 M536 238 V368" stroke={palette.water} strokeWidth="16" strokeLinecap="round" fill="none" opacity="0.18" />
      <path d="M74 186 h24 M400 184 h26 M596 168 h28 M492 420 h34" stroke={palette.floorLine} strokeWidth="4" strokeLinecap="round" opacity="0.34" />
      <CrackMarks stroke={palette.floorLine} points={['M286 272 l12 18 l-9 18', 'M450 250 l20 10 l-4 18']} />
    </g>
  );
}

function LaboratoryDetails({ palette, isPlayer }: { palette: MapPalette; isPlayer: boolean }) {
  return (
    <g opacity={isPlayer ? '0.42' : '0.64'}>
      <path d="M330 92 h40 v34 h-40 Z M544 326 h42 v32 h-42 Z M126 324 h40 v30 h-40 Z" fill={palette.accent} opacity="0.13" />
      <path d="M350 110 C378 168 382 240 370 348 M570 150 C540 214 542 290 586 344" stroke={palette.accent} strokeWidth="3" strokeDasharray="3 9" strokeLinecap="round" fill="none" opacity="0.36" />
      <circle cx="350" cy="109" r="32" fill="none" stroke={palette.accent} strokeWidth="2" opacity="0.28" />
      <CrackMarks stroke={palette.floorLine} points={['M212 128 l18 -10 l12 18', 'M428 368 l20 -8 l12 16']} />
    </g>
  );
}

function ForestRuinDetails({ palette, isPlayer }: { palette: MapPalette; isPlayer: boolean }) {
  return (
    <g opacity={isPlayer ? '0.42' : '0.62'}>
      <path d="M76 212 C156 154 238 166 314 146 S480 150 560 206" stroke={palette.accent} strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.18" strokeDasharray="4 14" />
      <path d="M106 276 C186 242 254 282 332 254 S470 226 548 284" stroke={palette.water} strokeWidth="16" strokeLinecap="round" fill="none" opacity="0.16" />
      <path d="M108 236 C142 216 166 244 192 226 M304 212 C332 190 354 224 382 202 M468 360 C508 334 534 370 568 344" stroke={palette.floorLine} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.3" />
      <CrackMarks stroke={palette.floorLine} points={['M250 172 l20 -12 l14 18', 'M486 192 l18 -10 l12 14', 'M156 374 l16 -12 l12 15']} />
    </g>
  );
}

function VolcanicForgeDetails({ palette, isPlayer }: { palette: MapPalette; isPlayer: boolean }) {
  return (
    <g opacity={isPlayer ? '0.42' : '0.62'}>
      <path d="M88 286 C166 252 238 284 312 254 S462 220 568 270" stroke={palette.water} strokeWidth="18" strokeLinecap="round" fill="none" opacity="0.3" />
      <path d="M422 96 C470 138 484 214 522 264" stroke={palette.water} strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.24" />
      <path d="M100 210 h42 M520 330 h50 M254 152 h50" stroke={palette.floorLine} strokeWidth="5" strokeLinecap="round" opacity="0.34" />
      <CrackMarks stroke={palette.floorLine} points={['M246 144 l18 -9 l10 16', 'M520 298 l20 -12 l14 18', 'M146 368 l16 -10 l12 16']} />
    </g>
  );
}

function BlackfenLayout({ connections, palette, isPlayer, enhanced }: { connections: MapConnection[]; palette: MapPalette; isPlayer: boolean; enhanced: boolean }) {
  const roomNumbers = [
    { x: 130, y: 130, label: '1' },
    { x: 306, y: 122, label: '2' },
    { x: 149, y: 268, label: '3' },
    { x: 290, y: 265, label: '4' },
    { x: 457, y: 242, label: '5' },
    { x: 487, y: 99, label: '6' },
    { x: 147, y: 386, label: '7' },
    { x: 435, y: 378, label: '8' },
    { x: 606, y: 279, label: '9' },
  ];

  return (
    <>
      <path d="M48 72 H206 V132 H292 V92 H418 V172 H548 V292 H488 V380 H328 V318 H222 V386 H92 V260 H48 Z" fill={palette.featureFill} opacity="0.58" />
      {enhanced && <BlackfenDetails palette={palette} isPlayer={isPlayer} />}
      <ConnectionRoutes connections={connections} palette={palette} isPlayer={isPlayer} enhanced={enhanced} />
      <MapRoom x={70} y={88} w={120} h={84} label="1" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={246} y={78} w={120} h={88} label="2" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={84} y={222} w={130} h={92} label="3" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={238} y={224} w={104} h={82} label="4" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={386} y={186} w={142} h={112} label="5" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={438} y={58} w={98} h={82} label="6" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={84} y={350} w={126} h={72} label="7" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={374} y={340} w={122} h={76} label="8" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={560} y={220} w={92} h={118} label="9" fill={palette.finalFill} palette={palette} enhanced={enhanced} />
      {enhanced && (
        <g>
          <WaterPatch x={88} y={140} w={78} h={16} />
          <MossPatch x={262} y={134} scale={0.75} />
          <SacredMark x={456} y={244} />
          <WaterPatch x={100} y={394} w={64} h={12} />
          <CrackMarks stroke={palette.floorLine} points={['M584 260 l20 -14 l14 20', 'M414 386 l18 -10 l12 12']} />
        </g>
      )}
      {!isPlayer && (
        <>
          <MapMarker x={174} y={106} label="T" />
          <MapMarker x={508} y={202} label="H" />
          <MapMarker x={633} y={238} label="B" />
        </>
      )}
      <RoomNumbers rooms={roomNumbers} />
    </>
  );
}

function VolcanicForgeLayout({ connections, palette, isPlayer, enhanced }: { connections: MapConnection[]; palette: MapPalette; isPlayer: boolean; enhanced: boolean }) {
  const roomNumbers = [
    { x: 92, y: 250, label: '1' },
    { x: 238, y: 126, label: '2' },
    { x: 376, y: 228, label: '3' },
    { x: 568, y: 242, label: '4' },
    { x: 420, y: 370, label: '5' },
    { x: 214, y: 370, label: '6' },
    { x: 548, y: 116, label: '7' },
    { x: 104, y: 392, label: '8' },
  ];

  return (
    <>
      <path d="M34 210 C76 132 164 160 220 82 C296 44 392 96 462 70 C548 38 642 128 650 232 C704 302 608 370 518 372 C466 458 354 426 282 428 C194 468 68 442 38 362 C8 302 8 246 34 210 Z" fill={palette.featureFill} opacity="0.42" />
      {enhanced && <VolcanicForgeDetails palette={palette} isPlayer={isPlayer} />}
      <ConnectionRoutes connections={connections} palette={palette} isPlayer={isPlayer} enhanced={enhanced} />
      <MapRoom x={50} y={218} w={84} h={64} label="1" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={196} y={92} w={86} h={68} label="2" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={300} y={174} w={152} h={108} label="3" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={532} y={202} w={76} h={78} label="4" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={374} y={338} w={92} h={70} label="5" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={166} y={332} w={96} h={76} label="6" fill={palette.finalFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={508} y={80} w={82} h={72} label="7" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={60} y={364} w={88} h={58} label="8" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      {enhanced && (
        <g>
          <RubbleChips chips={[{ x: 226, y: 154 }, { x: 500, y: 346, r: 6 }, { x: 334, y: 282, r: 4 }, { x: 560, y: 142, r: 5 }]} />
          <CrackMarks stroke={palette.floorLine} points={['M318 198 l18 -10 l12 14', 'M396 356 l18 -9 l13 14', 'M84 392 l16 -10 l12 16']} />
        </g>
      )}
      {!isPlayer && (
        <>
          <MapMarker x={306} y={186} label="H" />
          <MapMarker x={458} y={348} label="T" />
          <MapMarker x={244} y={344} label="B" />
        </>
      )}
      <RoomNumbers rooms={roomNumbers} />
    </>
  );
}

function ForestRuinLayout({ connections, palette, isPlayer, enhanced }: { connections: MapConnection[]; palette: MapPalette; isPlayer: boolean; enhanced: boolean }) {
  const roomNumbers = [
    { x: 126, y: 246, label: '1' },
    { x: 292, y: 190, label: '2' },
    { x: 476, y: 190, label: '3' },
    { x: 536, y: 347, label: '4' },
    { x: 335, y: 349, label: '5' },
    { x: 166, y: 358, label: '6' },
  ];

  return (
    <>
      <path d="M54 206 C130 136 218 148 292 128 S488 140 582 218 C618 310 570 394 452 414 C350 442 260 410 178 410 C96 394 48 318 54 206 Z" fill={palette.featureFill} opacity="0.34" />
      {enhanced && <ForestRuinDetails palette={palette} isPlayer={isPlayer} />}
      <ConnectionRoutes connections={connections} palette={palette} isPlayer={isPlayer} enhanced={enhanced} />
      <MapRoom x={70} y={202} w={112} h={88} label="1" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={232} y={146} w={120} h={88} label="2" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={420} y={148} w={112} h={84} label="3" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={476} y={306} w={120} h={82} label="4" fill={palette.finalFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={276} y={308} w={118} h={82} label="5" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={112} y={322} w={108} h={72} label="6" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      {enhanced && (
        <g>
          <MossPatch x={82} y={260} scale={0.66} />
          <MossPatch x={318} y={170} scale={0.58} />
          <MossPatch x={500} y={332} scale={0.58} />
          <RubbleChips chips={[{ x: 236, y: 176 }, { x: 520, y: 214, r: 6 }, { x: 162, y: 374, r: 4 }]} />
          <CrackMarks stroke={palette.floorLine} points={['M260 166 l16 -10 l12 15', 'M506 330 l18 -12 l14 16']} />
        </g>
      )}
      {!isPlayer && (
        <>
          <MapMarker x={330} y={164} label="H" />
          <MapMarker x={520} y={326} label="T" />
          <MapMarker x={188} y={340} label="B" />
        </>
      )}
      <RoomNumbers rooms={roomNumbers} />
    </>
  );
}

function FrozenRuinLayout({ connections, palette, isPlayer, enhanced }: { connections: MapConnection[]; palette: MapPalette; isPlayer: boolean; enhanced: boolean }) {
  const roomNumbers = [
    { x: 98, y: 250, label: '1' },
    { x: 252, y: 160, label: '2' },
    { x: 392, y: 242, label: '3' },
    { x: 566, y: 144, label: '4' },
    { x: 560, y: 322, label: '5' },
    { x: 338, y: 378, label: '6' },
    { x: 160, y: 388, label: '7' },
    { x: 468, y: 410, label: '8' },
  ];

  return (
    <>
      <path d="M36 226 C86 126 178 152 234 84 C312 44 400 124 474 86 C562 34 668 104 670 214 C708 300 632 392 540 388 C476 470 370 436 300 444 C210 468 82 442 42 354 C12 302 10 262 36 226 Z" fill={palette.featureFill} opacity="0.32" />
      {enhanced && (
        <g opacity={isPlayer ? '0.42' : '0.62'}>
          <path d="M30 306 C126 260 226 314 326 276 S504 216 688 286" stroke={palette.water} strokeWidth="22" strokeLinecap="round" fill="none" opacity="0.28" />
          <path d="M388 82 C420 158 414 230 390 302 S378 392 450 456" stroke={palette.floorLine} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.36" strokeDasharray="10 10" />
          <CrackMarks stroke={palette.floorLine} points={['M350 222 l20 -16 l16 22', 'M534 300 l18 -12 l16 18', 'M146 392 l16 -10 l10 16']} />
        </g>
      )}
      <ConnectionRoutes connections={connections} palette={palette} isPlayer={isPlayer} enhanced={enhanced} />
      <OvalRoom cx={98} cy={250} rx={58} ry={40} fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <OvalRoom cx={252} cy={160} rx={66} ry={48} fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <OvalRoom cx={392} cy={242} rx={84} ry={58} fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <OvalRoom cx={566} cy={144} rx={72} ry={52} fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <OvalRoom cx={560} cy={322} rx={70} ry={52} fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <OvalRoom cx={338} cy={378} rx={72} ry={50} fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <OvalRoom cx={160} cy={388} rx={62} ry={44} fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <OvalRoom cx={468} cy={410} rx={62} ry={42} fill={palette.finalFill} palette={palette} enhanced={enhanced} />
      {!isPlayer && (
        <>
          <MapMarker x={444} y={218} label="H" />
          <MapMarker x={494} y={386} label="T" />
          <MapMarker x={174} y={364} label="B" />
        </>
      )}
      <RoomNumbers rooms={roomNumbers} />
    </>
  );
}

function ShrineLayout({ connections, palette, isPlayer, enhanced }: { connections: MapConnection[]; palette: MapPalette; isPlayer: boolean; enhanced: boolean }) {
  const roomNumbers = [
    { x: 154, y: 216, label: '1' },
    { x: 324, y: 204, label: '2' },
    { x: 480, y: 211, label: '3' },
    { x: 490, y: 348, label: '4' },
    { x: 329, y: 344, label: '5' },
    { x: 167, y: 354, label: '6' },
  ];

  return (
    <>
      <path d="M156 72 H492 V394 H156 Z" fill={palette.featureFill} opacity="0.18" />
      {enhanced && <ShrineDetails palette={palette} isPlayer={isPlayer} />}
      <ConnectionRoutes connections={connections} palette={palette} isPlayer={isPlayer} enhanced={enhanced} />
      <MapRoom x={88} y={170} w={132} h={92} label="1" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={260} y={150} w={128} h={108} label="2" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={424} y={168} w={112} h={86} label="3" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={432} y={310} w={116} h={76} label="4" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={270} y={302} w={118} h={84} label="5" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={118} y={318} w={98} h={72} label="6" fill={palette.finalFill} palette={palette} enhanced={enhanced} />
      {enhanced && (
        <g>
          <SacredMark x={326} y={205} />
          <MossPatch x={106} y={236} scale={0.72} />
          <MossPatch x={438} y={358} scale={0.66} />
          <RubbleChips chips={[{ x: 132, y: 188 }, { x: 502, y: 234, r: 6 }, { x: 302, y: 366, r: 4 }]} />
          <CrackMarks stroke={palette.floorLine} points={['M278 178 l18 -9 l10 16', 'M516 190 l-14 16 l20 8', 'M138 358 l18 -12 l10 14']} />
        </g>
      )}
      {!isPlayer && (
        <>
          <MapMarker x={366} y={172} label="H" />
          <MapMarker x={528} y={326} label="T" />
          <MapMarker x={202} y={334} label="B" />
        </>
      )}
      <RoomNumbers rooms={roomNumbers} />
    </>
  );
}

function CavernLayout({ connections, palette, isPlayer, enhanced }: { connections: MapConnection[]; palette: MapPalette; isPlayer: boolean; enhanced: boolean }) {
  const roomNumbers = [
    { x: 96, y: 238, label: '1' },
    { x: 218, y: 174, label: '2' },
    { x: 222, y: 326, label: '3' },
    { x: 352, y: 220, label: '4' },
    { x: 498, y: 154, label: '5' },
    { x: 600, y: 300, label: '6' },
  ];

  return (
    <>
      <path d="M52 226 C142 118 196 318 286 194 S440 80 526 188 S612 354 684 278" stroke={palette.featureFill} strokeWidth="52" strokeLinecap="round" fill="none" opacity="0.64" />
      {enhanced && <CavernDetails palette={palette} isPlayer={isPlayer} />}
      <ConnectionRoutes connections={connections} palette={palette} isPlayer={isPlayer} kind="natural" enhanced={enhanced} />
      <OvalRoom cx={96} cy={238} rx={68} ry={52} label="1" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <OvalRoom cx={218} cy={174} rx={72} ry={48} label="2" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <OvalRoom cx={222} cy={326} rx={68} ry={48} label="3" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <OvalRoom cx={352} cy={220} rx={86} ry={62} label="4" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <OvalRoom cx={498} cy={154} rx={70} ry={52} label="5" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <OvalRoom cx={600} cy={300} rx={78} ry={58} label="6" fill={palette.finalFill} palette={palette} enhanced={enhanced} />
      {enhanced && (
        <g>
          <WaterPatch x={460} y={150} w={74} h={18} />
          <WaterPatch x={570} y={306} w={54} h={14} />
          <CrackMarks stroke={palette.floorLine} points={['M184 170 l16 -12 l18 12', 'M324 234 l20 -18 l14 24', 'M232 340 l18 -10 l10 16']} />
          <path d="M380 194 l10 -20 l13 20 l-12 20 Z" fill="#7a6fb0" opacity="0.24" />
        </g>
      )}
      {!isPlayer && (
        <>
          <MapMarker x={410} y={184} label="H" />
          <MapMarker x={270} y={300} label="T" />
          <MapMarker x={652} y={276} label="B" />
        </>
      )}
      <RoomNumbers rooms={roomNumbers} />
    </>
  );
}

function CryptLayout({ connections, palette, isPlayer, enhanced }: { connections: MapConnection[]; palette: MapPalette; isPlayer: boolean; enhanced: boolean }) {
  const roomNumbers = [
    { x: 360, y: 89, label: '1' },
    { x: 360, y: 215, label: '2' },
    { x: 149, y: 217, label: '3' },
    { x: 571, y: 217, label: '4' },
    { x: 206, y: 365, label: '5' },
    { x: 514, y: 365, label: '6' },
  ];

  return (
    <>
      <path d="M92 86 H628 V394 H92 Z" fill={palette.featureFill} opacity="0.2" />
      {enhanced && <CryptDetails palette={palette} isPlayer={isPlayer} />}
      <ConnectionRoutes connections={connections} palette={palette} isPlayer={isPlayer} enhanced={enhanced} />
      <MapRoom x={296} y={50} w={128} h={78} label="1" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={256} y={170} w={208} h={90} label="2" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={88} y={174} w={122} h={86} label="3" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={510} y={174} w={122} h={86} label="4" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={136} y={326} w={140} h={78} label="5" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={444} y={326} w={140} h={78} label="6" fill={palette.finalFill} palette={palette} enhanced={enhanced} />
      {enhanced && (
        <g>
          <TombSlab x={326} y={104} />
          <TombSlab x={276} y={232} w={58} />
          <TombSlab x={386} y={232} w={58} />
          <TombSlab x={164} y={378} w={52} />
          <TombSlab x={502} y={378} w={52} />
          <RubbleChips chips={[{ x: 116, y: 224 }, { x: 404, y: 202, r: 6 }, { x: 552, y: 378 }]} />
          <CrackMarks stroke={palette.floorLine} points={['M530 204 l18 -12 l12 20', 'M158 204 l14 16 l-10 16', 'M350 190 l22 -10 l16 18']} />
        </g>
      )}
      {!isPlayer && (
        <>
          <MapMarker x={190} y={192} label="H" />
          <MapMarker x={258} y={346} label="T" />
          <MapMarker x={566} y={346} label="B" />
        </>
      )}
      <RoomNumbers rooms={roomNumbers} />
    </>
  );
}

function SewerLayout({ connections, palette, isPlayer, enhanced }: { connections: MapConnection[]; palette: MapPalette; isPlayer: boolean; enhanced: boolean }) {
  const roomNumbers = [
    { x: 112, y: 238, label: '1' },
    { x: 280, y: 238, label: '2' },
    { x: 156, y: 112, label: '3' },
    { x: 416, y: 238, label: '4' },
    { x: 536, y: 371, label: '5' },
    { x: 626, y: 235, label: '6' },
  ];

  return (
    <>
      <path d="M48 238 H674 M156 238 V104 M280 238 V372 M402 238 V110 M536 238 V368" stroke={palette.featureFill} strokeWidth="62" strokeLinecap="round" fill="none" opacity="0.46" />
      {enhanced && <SewerDetails palette={palette} isPlayer={isPlayer} />}
      <ConnectionRoutes connections={connections} palette={palette} isPlayer={isPlayer} enhanced={enhanced} />
      <MapRoom x={58} y={196} w={108} h={84} label="1" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={220} y={196} w={120} h={84} label="2" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={96} y={74} w={120} h={76} label="3" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={358} y={194} w={116} h={88} label="4" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={468} y={330} w={136} h={82} label="5" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={570} y={178} w={112} h={114} label="6" fill={palette.finalFill} palette={palette} enhanced={enhanced} />
      {enhanced && (
        <g>
          <WaterPatch x={72} y={252} w={66} h={14} />
          <WaterPatch x={236} y={252} w={76} h={14} />
          <WaterPatch x={480} y={378} w={78} h={14} />
          <DrainGrate x={372} y={256} />
          <DrainGrate x={602} y={242} />
          <path d="M248 210 H312 M488 346 H566" stroke="#5e4a3d" strokeWidth="5" strokeLinecap="round" opacity="0.42" />
        </g>
      )}
      {!isPlayer && (
        <>
          <MapMarker x={324} y={214} label="H" />
          <MapMarker x={458} y={216} label="T" />
          <MapMarker x={660} y={202} label="B" />
        </>
      )}
      <RoomNumbers rooms={roomNumbers} />
    </>
  );
}

function LaboratoryLayout({ connections, palette, isPlayer, enhanced }: { connections: MapConnection[]; palette: MapPalette; isPlayer: boolean; enhanced: boolean }) {
  const roomNumbers = [
    { x: 145, y: 133, label: '1' },
    { x: 350, y: 109, label: '2' },
    { x: 569, y: 151, label: '3' },
    { x: 160, y: 332, label: '4' },
    { x: 370, y: 348, label: '5' },
    { x: 586, y: 344, label: '6' },
  ];

  return (
    <>
      <path d="M66 112 H232 V66 H436 V142 H620 V318 H506 V414 H264 V362 H90 Z" fill={palette.featureFill} opacity="0.22" />
      {enhanced && <LaboratoryDetails palette={palette} isPlayer={isPlayer} />}
      <ConnectionRoutes connections={connections} palette={palette} isPlayer={isPlayer} enhanced={enhanced} />
      <MapRoom x={74} y={92} w={142} h={82} label="1" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={274} y={60} w={152} h={98} label="2" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={506} y={96} w={126} h={110} label="3" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={92} y={284} w={136} h={96} label="4" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={306} y={302} w={128} h={92} label="5" fill={palette.roomFill} palette={palette} enhanced={enhanced} />
      <MapRoom x={520} y={286} w={132} h={116} label="6" fill={palette.finalFill} palette={palette} enhanced={enhanced} />
      {enhanced && (
        <g>
          <Workbench x={98} y={108} />
          <ArcaneCircle x={350} y={110} r={28} />
          <GearMark x={582} y={154} />
          <Workbench x={108} y={354} />
          <ArcaneCircle x={586} y={344} r={30} />
          <CrackMarks stroke={palette.floorLine} points={['M320 364 l20 -12 l14 16', 'M540 310 l16 -9 l18 12']} />
        </g>
      )}
      {!isPlayer && (
        <>
          <MapMarker x={410} y={82} label="H" />
          <MapMarker x={420} y={324} label="T" />
          <MapMarker x={636} y={314} label="B" />
        </>
      )}
      <RoomNumbers rooms={roomNumbers} />
    </>
  );
}

export function EnhancedFallbackMap({ mapData, style, palette, isPlayer, enhanced }: { mapData?: DungeonMapData; style: MapStyle; palette: MapPalette; isPlayer: boolean; enhanced: boolean }) {
  const connections = mapData?.connections ?? [];

  switch (style) {
    case 'shrine':
      return <ShrineLayout connections={connections} palette={palette} isPlayer={isPlayer} enhanced={enhanced} />;
    case 'cavern':
      return <CavernLayout connections={connections} palette={palette} isPlayer={isPlayer} enhanced={enhanced} />;
    case 'crypt':
      return <CryptLayout connections={connections} palette={palette} isPlayer={isPlayer} enhanced={enhanced} />;
    case 'forestRuin':
      return <ForestRuinLayout connections={connections} palette={palette} isPlayer={isPlayer} enhanced={enhanced} />;
    case 'frozenRuin':
      return <FrozenRuinLayout connections={connections} palette={palette} isPlayer={isPlayer} enhanced={enhanced} />;
    case 'sewer':
      return <SewerLayout connections={connections} palette={palette} isPlayer={isPlayer} enhanced={enhanced} />;
    case 'laboratory':
      return <LaboratoryLayout connections={connections} palette={palette} isPlayer={isPlayer} enhanced={enhanced} />;
    case 'volcanicForge':
      return <VolcanicForgeLayout connections={connections} palette={palette} isPlayer={isPlayer} enhanced={enhanced} />;
    case 'blackfen':
    default:
      return <BlackfenLayout connections={connections} palette={palette} isPlayer={isPlayer} enhanced={enhanced} />;
  }
}
