import type { ReactNode } from 'react';
import type { MapConnection } from '../../types';

export type LevelTwoMapTheme = {
  floorTiles: string[];
  floorStroke: string;
  floorHighlight: string;
  foundationFill: string;
  foundationTileStroke: string;
  wallDark: string;
  wallStroke: string;
  wallMid: string;
  wallHighlight: string;
  shadow: string;
  corridorShadow: string;
  corridorOuter: string;
  corridorMid: string;
  corridorFloor: string;
  corridorSeam: string;
  corridorHighlight: string;
  moss: string;
  water: string;
  dust: string;
  rubble: string;
  metal: string;
  sludge: string;
  brass: string;
  runeGlow: string;
  scorch: string;
  residue: string;
};

const shrineTheme: LevelTwoMapTheme = {
  floorTiles: ['#c7b185', '#d7c49d', '#bda477', '#e0d0ad'],
  floorStroke: '#6f563d',
  floorHighlight: '#f6ead1',
  foundationFill: '#8a7048',
  foundationTileStroke: '#56412f',
  wallDark: '#1d1713',
  wallStroke: '#110d0a',
  wallMid: '#2f2924',
  wallHighlight: '#8b7860',
  shadow: '#17110e',
  corridorShadow: '#1a1511',
  corridorOuter: '#3a2f25',
  corridorMid: '#927249',
  corridorFloor: '#cfbc92',
  corridorSeam: '#6e563c',
  corridorHighlight: '#f4e4bd',
  moss: '#456238',
  water: '#3f7883',
  dust: '#d8cfba',
  rubble: '#7a654d',
  metal: '#4e4740',
  sludge: '#52663c',
  brass: '#9f7a3b',
  runeGlow: '#d8b76a',
  scorch: '#493221',
  residue: '#6b794a',
};

const cryptTheme: LevelTwoMapTheme = {
  floorTiles: ['#756957', '#8a7a63', '#5f5549', '#9a8a70'],
  floorStroke: '#3a3129',
  floorHighlight: '#c3b493',
  foundationFill: '#5f5549',
  foundationTileStroke: '#3a3129',
  wallDark: '#171411',
  wallStroke: '#110d0a',
  wallMid: '#2f2924',
  wallHighlight: '#8b7860',
  shadow: '#12100e',
  corridorShadow: '#11100e',
  corridorOuter: '#40372e',
  corridorMid: '#756957',
  corridorFloor: '#9a8a70',
  corridorSeam: '#2f2822',
  corridorHighlight: '#c9b996',
  moss: '#4c5b40',
  water: '#526f76',
  dust: '#d8cfba',
  rubble: '#7a654d',
  metal: '#4b4640',
  sludge: '#4c5b40',
  brass: '#9b8654',
  runeGlow: '#c9b996',
  scorch: '#2c211b',
  residue: '#5c6551',
};

const sewerTheme: LevelTwoMapTheme = {
  floorTiles: ['#53604e', '#66705a', '#454d43', '#74715a'],
  floorStroke: '#29332c',
  floorHighlight: '#a4ad8f',
  foundationFill: '#4b5448',
  foundationTileStroke: '#27312b',
  wallDark: '#151b18',
  wallStroke: '#0d120f',
  wallMid: '#2c3832',
  wallHighlight: '#6f7b68',
  shadow: '#0f1412',
  corridorShadow: '#0d1412',
  corridorOuter: '#24352f',
  corridorMid: '#4f5d4d',
  corridorFloor: '#6c735b',
  corridorSeam: '#27352e',
  corridorHighlight: '#9eab8e',
  moss: '#47683f',
  water: '#223f3d',
  dust: '#a79f83',
  rubble: '#5c5749',
  metal: '#343a3a',
  sludge: '#5d6437',
  brass: '#7c6f4b',
  runeGlow: '#9eab8e',
  scorch: '#1f2722',
  residue: '#5d6437',
};

const laboratoryTheme: LevelTwoMapTheme = {
  floorTiles: ['#6e685f', '#80776a', '#5e5b57', '#8b7c67'],
  floorStroke: '#34302d',
  floorHighlight: '#d1bd91',
  foundationFill: '#5b5147',
  foundationTileStroke: '#38302a',
  wallDark: '#171414',
  wallStroke: '#0f0c0c',
  wallMid: '#36302d',
  wallHighlight: '#a78955',
  shadow: '#111010',
  corridorShadow: '#121010',
  corridorOuter: '#342c2a',
  corridorMid: '#6a5f55',
  corridorFloor: '#8a7a66',
  corridorSeam: '#3a302a',
  corridorHighlight: '#d7bd83',
  moss: '#4d5b43',
  water: '#476d74',
  dust: '#d0b982',
  rubble: '#6a5c4b',
  metal: '#3f4240',
  sludge: '#6d5b38',
  brass: '#b48742',
  runeGlow: '#b875ff',
  scorch: '#2b1d18',
  residue: '#6c58a5',
};

const blackfenTheme: LevelTwoMapTheme = {
  floorTiles: ['#6f7462', '#7d806b', '#5c665b', '#8a856e'],
  floorStroke: '#344038',
  floorHighlight: '#c4c7a7',
  foundationFill: '#58624f',
  foundationTileStroke: '#303a33',
  wallDark: '#151815',
  wallStroke: '#0c100d',
  wallMid: '#2d342f',
  wallHighlight: '#71806d',
  shadow: '#0e120f',
  corridorShadow: '#0e130f',
  corridorOuter: '#28332c',
  corridorMid: '#58624f',
  corridorFloor: '#7a7d64',
  corridorSeam: '#313d34',
  corridorHighlight: '#b8bd96',
  moss: '#436a3d',
  water: '#315e66',
  dust: '#a9a389',
  rubble: '#67614f',
  metal: '#3e4640',
  sludge: '#5e653f',
  brass: '#8c7040',
  runeGlow: '#c9b46a',
  scorch: '#2a211b',
  residue: '#5f6f45',
};

type RoomNumberPoint = { x: number; y: number; label: string };

export function LevelTwoFloorTile({
  x,
  y,
  theme,
  w = 28,
  h = 22,
  tone = 0,
  opacity = 0.96,
}: {
  x: number;
  y: number;
  theme: LevelTwoMapTheme;
  w?: number;
  h?: number;
  tone?: number;
  opacity?: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={theme.floorTiles[tone % theme.floorTiles.length]} stroke={theme.floorStroke} strokeWidth="1.15" opacity={opacity} />
      <path d={`M${x + 5} ${y + 5} h${Math.max(7, w * 0.35)} M${x + w - 8} ${y + h - 5} h-8`} stroke={theme.floorHighlight} strokeWidth="1" opacity="0.28" />
    </g>
  );
}

export function LevelTwoCrack({ x, y, scale = 1, stroke = '#4f3d2e' }: { x: number; y: number; scale?: number; stroke?: string }) {
  return <path d={`M${x} ${y} l${12 * scale} ${-7 * scale} l${8 * scale} ${10 * scale} l${10 * scale} ${-5 * scale}`} stroke={stroke} strokeWidth={1.8 * scale} strokeLinecap="round" fill="none" opacity="0.56" />;
}

export function LevelTwoWallBlock({ x, y, w, h, theme, vertical = false }: { x: number; y: number; w: number; h: number; theme: LevelTwoMapTheme; vertical?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill={theme.wallMid} stroke={theme.wallStroke} strokeWidth="1.2" />
      <path d={vertical ? `M${x + w * 0.5} ${y + 4} V${y + h - 4}` : `M${x + 4} ${y + h * 0.45} H${x + w - 4}`} stroke="#665647" strokeWidth="1.2" opacity="0.55" />
      <path d={vertical ? `M${x + 2} ${y + 5} V${y + h - 5}` : `M${x + 5} ${y + 2} H${x + w - 5}`} stroke={theme.wallHighlight} strokeWidth="1" opacity="0.38" />
    </g>
  );
}

export function LevelTwoWallCorner({ x, y, theme }: { x: number; y: number; theme: LevelTwoMapTheme }) {
  return (
    <g filter="url(#markerInk)">
      <rect x={x - 2} y={y - 2} width="18" height="18" rx="3" fill={theme.wallDark} />
      <path d={`M${x + 3} ${y + 5} h8 M${x + 6} ${y + 3} v10`} stroke={theme.wallHighlight} strokeWidth="1.2" opacity="0.56" />
    </g>
  );
}

export function LevelTwoRubble({ x, y, theme, scale = 1 }: { x: number; y: number; theme: LevelTwoMapTheme; scale?: number }) {
  const rocks = [
    { x: 0, y: 8, s: 8 },
    { x: 10, y: 2, s: 10 },
    { x: 22, y: 9, s: 7 },
    { x: 17, y: 17, s: 6 },
  ];

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity="0.85">
      {rocks.map((rock) => (
        <path key={`${rock.x}-${rock.y}`} d={`M${rock.x} ${rock.y} l${rock.s} -3 l6 6 l-${rock.s * 0.45} 8 l-${rock.s} -2 Z`} fill={theme.rubble} stroke="#4b3c2e" strokeWidth="1" />
      ))}
    </g>
  );
}

export function LevelTwoDebris({ x, y, fill = '#6f5a43' }: { x: number; y: number; fill?: string }) {
  return (
    <g opacity="0.72">
      <path d={`M${x} ${y} l5 -3 l4 5 l-6 4 Z M${x + 14} ${y + 8} l4 -2 l3 4 l-5 3 Z M${x + 24} ${y - 3} l6 -2 l3 5 l-6 3 Z`} fill={fill} />
    </g>
  );
}

function LevelTwoRubbleChips({ chips, fill = '#77624b' }: { chips: { x: number; y: number; r?: number }[]; fill?: string }) {
  return (
    <g opacity="0.62">
      {chips.map((chip) => (
        <path key={`${chip.x}-${chip.y}`} d={`M${chip.x} ${chip.y} l${chip.r ?? 5} -2 l3 5 l-${chip.r ?? 5} 3 Z`} fill={fill} opacity="0.48" />
      ))}
    </g>
  );
}

function LevelTwoMoss({ x, y, theme, scale = 1 }: { x: number; y: number; theme: LevelTwoMapTheme; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity="0.82">
      <path d="M0 10 C12 -5 36 -1 44 14 C30 24 10 24 0 10 Z" fill={theme.moss} opacity="0.58" />
      <circle cx="12" cy="11" r="4" fill="#6f914f" opacity="0.5" />
      <circle cx="29" cy="13" r="5" fill="#557a43" opacity="0.55" />
    </g>
  );
}

function LevelTwoWater({ x, y, w, h, theme }: { x: number; y: number; w: number; h: number; theme: LevelTwoMapTheme }) {
  return (
    <g opacity="0.86">
      <path d={`M${x} ${y + h / 2} C${x + w * 0.22} ${y - 5} ${x + w * 0.7} ${y + h + 5} ${x + w} ${y + h / 2}`} stroke={theme.water} strokeWidth={h} strokeLinecap="round" fill="none" opacity="0.54" />
      <path d={`M${x + 8} ${y + h / 2} C${x + w * 0.34} ${y + 3} ${x + w * 0.62} ${y + h - 3} ${x + w - 8} ${y + h / 2}`} stroke="#c6ece8" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
    </g>
  );
}

function LevelTwoDust({ x, y, w, h, theme }: { x: number; y: number; w: number; h: number; theme: LevelTwoMapTheme }) {
  return (
    <g opacity="0.26">
      <path d={`M${x} ${y + h / 2} C${x + w * 0.25} ${y - 8} ${x + w * 0.72} ${y + h + 8} ${x + w} ${y + h / 2}`} stroke={theme.dust} strokeWidth={h} strokeLinecap="round" fill="none" />
      <path d={`M${x + 10} ${y + h / 2} C${x + w * 0.35} ${y + 4} ${x + w * 0.62} ${y + h - 4} ${x + w - 10} ${y + h / 2}`} stroke="#fff6df" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.42" />
    </g>
  );
}

function LevelTwoSecretRoutes({ paths, stroke }: { paths: string[]; stroke: string }) {
  return (
    <>
      {paths.map((path) => (
        <path key={`${path}-level-two-secret`} d={path} stroke={stroke} strokeWidth="4.5" strokeDasharray="10 8" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#inkRoughen)" />
      ))}
    </>
  );
}

export function LevelTwoConnectionRoutes({
  connections,
  secretStroke,
  isPlayer,
  theme,
  variant = 'ruin',
}: {
  connections: MapConnection[];
  secretStroke: string;
  isPlayer: boolean;
  theme: LevelTwoMapTheme;
  variant?: 'ruin' | 'crypt' | 'sewer' | 'laboratory' | 'blackfen';
}) {
  const normalPaths = connections.filter((connection) => connection.type === 'normal' && connection.path).map((connection) => connection.path as string);
  const secretPaths = connections.filter((connection) => connection.type === 'secret' && connection.path).map((connection) => connection.path as string);
  const widths =
    variant === 'crypt'
      ? { shadow: 58, outer: 46, mid: 36, floor: 28, seam: 5, highlight: 1.6 }
      : variant === 'sewer'
        ? { shadow: 62, outer: 50, mid: 40, floor: 31, seam: 5, highlight: 1.8 }
        : variant === 'laboratory'
          ? { shadow: 54, outer: 43, mid: 34, floor: 26, seam: 4, highlight: 1.7 }
          : variant === 'blackfen'
            ? { shadow: 56, outer: 44, mid: 35, floor: 27, seam: 4.5, highlight: 1.8 }
        : { shadow: 46, outer: 38, mid: 30, floor: 23, seam: 5, highlight: 2 };

  return (
    <>
      {normalPaths.map((path) => (
        <g key={path}>
          <path d={path} stroke={theme.corridorShadow} strokeWidth={widths.shadow} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={variant === 'crypt' ? '0.22' : '0.28'} />
          <path d={path} stroke={theme.corridorOuter} strokeWidth={widths.outer} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9" />
          <path d={path} stroke={theme.corridorMid} strokeWidth={widths.mid} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.96" />
          <path d={path} stroke={theme.corridorFloor} strokeWidth={widths.floor} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={variant === 'crypt' ? '0.9' : '0.98'} />
          <path d={path} stroke={theme.corridorSeam} strokeWidth={widths.seam} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={variant === 'crypt' ? '18 14' : '16 12'} opacity={variant === 'crypt' ? '0.42' : '0.72'} />
          <path d={path} stroke={theme.corridorHighlight} strokeWidth={widths.highlight} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={variant === 'crypt' ? '8 16' : '5 20'} opacity={variant === 'crypt' ? '0.45' : '0.68'} />
          {variant === 'sewer' && (
            <>
              <path d={path} stroke={theme.water} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.72" />
              <path d={path} stroke="#789783" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="14 18" opacity="0.5" />
            </>
          )}
          {variant === 'laboratory' && (
            <>
              <path d={path} stroke={theme.brass} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.62" strokeDasharray="18 16" />
              <path d={path} stroke={theme.runeGlow} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.46" strokeDasharray="3 18" />
            </>
          )}
          {variant === 'blackfen' && (
            <>
              <path d={path} stroke={theme.water} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.34" strokeDasharray="24 18" />
              <path d={path} stroke={theme.moss} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.34" strokeDasharray="5 20" />
            </>
          )}
        </g>
      ))}
      {!isPlayer && <LevelTwoSecretRoutes paths={secretPaths} stroke={secretStroke} />}
    </>
  );
}

export function LevelTwoConnectionApron({ connections, theme }: { connections: MapConnection[]; theme: LevelTwoMapTheme }) {
  const normalPaths = connections.filter((connection) => connection.type === 'normal' && connection.path).map((connection) => connection.path as string);

  return (
    <g>
      {normalPaths.map((path) => (
        <path key={`${path}-apron-shadow`} d={path} stroke="#1b1410" strokeWidth="58" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.08" />
      ))}
      {normalPaths.map((path) => (
        <path key={`${path}-apron`} d={path} stroke={theme.foundationFill} strokeWidth="48" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.12" />
      ))}
      {normalPaths.map((path) => (
        <path key={`${path}-apron-floor`} d={path} stroke={theme.corridorMid} strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.1" />
      ))}
      {normalPaths.map((path) => (
        <path key={`${path}-apron-seams`} d={path} stroke="#4d3a2b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.18" strokeDasharray="20 18" />
      ))}
      {normalPaths.map((path) => (
        <path key={`${path}-moss-edge`} d={path} stroke={theme.moss} strokeWidth="52" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.06" strokeDasharray="30 36" />
      ))}
    </g>
  );
}

export function LevelTwoFoundation({
  id,
  path,
  theme,
  children,
}: {
  id: string;
  path: string;
  theme: LevelTwoMapTheme;
  children?: ReactNode;
}) {
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={path} />
        </clipPath>
      </defs>
      <path d={path} fill={theme.shadow} opacity="0.1" transform="translate(0 8)" />
      <path d={path} fill={theme.foundationFill} opacity="0.07" />
      <g clipPath={`url(#${id})`}>
        {children}
      </g>
    </g>
  );
}

export function LevelTwoRoomShell({
  x,
  y,
  w,
  h,
  theme,
  final = false,
  variant = 'ruin',
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  theme: LevelTwoMapTheme;
  final?: boolean;
  variant?: 'ruin' | 'crypt' | 'sewer' | 'laboratory' | 'blackfen';
}) {
  const tileW = variant === 'crypt' || variant === 'sewer' || variant === 'laboratory' || variant === 'blackfen' ? 30 : 28;
  const tileH = variant === 'crypt' ? 22 : 22;
  const cols = Math.ceil((w - 24) / tileW);
  const rows = Math.ceil((h - 24) / tileH);
  const horizontalBlocks = Math.max(2, Math.floor(w / (variant === 'crypt' || variant === 'sewer' || variant === 'laboratory' || variant === 'blackfen' ? 30 : 28)));
  const verticalBlocks = Math.max(2, Math.floor(h / (variant === 'crypt' || variant === 'sewer' || variant === 'laboratory' || variant === 'blackfen' ? 28 : 26)));
  const clipId = `level-two-${variant}-room-${x}-${y}`;

  return (
    <g>
      <rect x={x - 10} y={y + 9} width={w + 20} height={h + 16} rx="5" fill={theme.shadow} opacity="0.36" />
      {variant === 'ruin' ? (
        <path d={`M${x - 8} ${y + 2} Q${x - 6} ${y - 8} ${x + 8} ${y - 8} H${x + w - 12} Q${x + w + 10} ${y - 7} ${x + w + 8} ${y + 12} V${y + h - 10} Q${x + w + 6} ${y + h + 9} ${x + w - 12} ${y + h + 8} H${x + 10} Q${x - 10} ${y + h + 6} ${x - 8} ${y + h - 12} Z`} fill={theme.wallDark} />
      ) : (
        <rect x={x - 8} y={y - 8} width={w + 16} height={h + 16} rx="4" fill={theme.wallDark} />
      )}
      <rect x={x + 7} y={y + 7} width={w - 14} height={h - 14} rx="3" fill={final ? theme.floorTiles[1] : theme.floorTiles[0]} />
      <g clipPath={`url(#${clipId})`}>
        <defs>
          <clipPath id={clipId}>
            <rect x={x + 12} y={y + 12} width={w - 24} height={h - 24} rx={variant === 'crypt' ? '2' : '3'} />
          </clipPath>
        </defs>
        {Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: cols }).map((__, col) => <LevelTwoFloorTile key={`${row}-${col}`} x={x + 12 + col * tileW - (row % 2 ? 12 : 0)} y={y + 12 + row * tileH} w={tileW + 1} h={tileH + 1} tone={row + col + (final ? 2 : 0)} theme={theme} />),
        )}
      </g>
      <rect x={x + 9} y={y + 9} width={w - 18} height={h - 18} rx={variant === 'crypt' ? '2' : '3'} fill="none" stroke={theme.floorHighlight} strokeWidth={variant === 'crypt' ? '2.4' : '3'} opacity={variant === 'crypt' ? '0.38' : '0.46'} />
      <rect x={x + 15} y={y + 15} width={w - 30} height={h - 30} rx="1" fill="none" stroke={variant === 'crypt' ? '#2d251f' : variant === 'sewer' ? '#1f302a' : variant === 'laboratory' ? '#3a302a' : variant === 'blackfen' ? '#26372f' : '#4b3828'} strokeWidth="3" opacity={variant === 'crypt' ? '0.42' : '0.32'} />
      {Array.from({ length: horizontalBlocks }).map((_, index) => {
        const blockW = w / horizontalBlocks;
        return (
          <g key={`h-${index}`}>
            <LevelTwoWallBlock x={x + index * blockW} y={y - 8} w={blockW + 1} h={14} theme={theme} />
            <LevelTwoWallBlock x={x + index * blockW} y={y + h - 6} w={blockW + 1} h={14} theme={theme} />
          </g>
        );
      })}
      {Array.from({ length: verticalBlocks }).map((_, index) => {
        const blockH = h / verticalBlocks;
        return (
          <g key={`v-${index}`}>
            <LevelTwoWallBlock x={x - 8} y={y + index * blockH} w={14} h={blockH + 1} theme={theme} vertical />
            <LevelTwoWallBlock x={x + w - 6} y={y + index * blockH} w={14} h={blockH + 1} theme={theme} vertical />
          </g>
        );
      })}
      <LevelTwoWallCorner x={x - 8} y={y - 8} theme={theme} />
      <LevelTwoWallCorner x={x + w - 8} y={y - 8} theme={theme} />
      <LevelTwoWallCorner x={x - 8} y={y + h - 8} theme={theme} />
      <LevelTwoWallCorner x={x + w - 8} y={y + h - 8} theme={theme} />
      {variant === 'ruin' && (
        <>
          <LevelTwoBrokenEdge x={x + w - 34} y={y + 2} variant={(x + y) % 3} />
          <LevelTwoBrokenEdge x={x + 8} y={y + h - 5} variant={(x + y + 1) % 3} />
        </>
      )}
    </g>
  );
}

function LevelTwoBrokenEdge({ x, y, variant = 0 }: { x: number; y: number; variant?: number }) {
  const paths = [
    `M${x} ${y} l12 -8 l10 8 l12 -6`,
    `M${x} ${y} l10 9 l14 -7 l9 8`,
    `M${x} ${y} l8 -10 l16 5 l10 -8`,
  ];
  return <path d={paths[variant % paths.length]} stroke="#211a15" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.84" />;
}

function LevelTwoRoomNumber({ x, y, label }: RoomNumberPoint) {
  return (
    <g>
      <rect x={x - 20} y={y - 20} width="40" height="40" rx="10" fill="#fff8ef" opacity="0.82" />
      <text x={x} y={y + 9} textAnchor="middle" fontSize="34" fontWeight="900" fill="#211a16" paintOrder="stroke" stroke="#fff8ef" strokeWidth="4">
        {label}
      </text>
    </g>
  );
}

function LevelTwoRoomNumbers({ rooms }: { rooms: RoomNumberPoint[] }) {
  return (
    <>
      {rooms.map((room) => (
        <LevelTwoRoomNumber key={room.label} {...room} />
      ))}
    </>
  );
}

function LevelTwoMarker({ x, y, label }: { x: number; y: number; label: string }) {
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

function LevelTwoStairs({ x, y, w = 58, h = 34 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g opacity="0.82">
      <rect x={x} y={y} width={w} height={h} rx="3" fill="#9f875f" opacity="0.34" />
      {Array.from({ length: 5 }).map((_, index) => (
        <path key={index} d={`M${x + 7} ${y + 6 + index * 5} H${x + w - 7}`} stroke="#4f3d2e" strokeWidth="1.6" opacity="0.65" />
      ))}
    </g>
  );
}

function LevelTwoPillar({ x, y }: { x: number; y: number }) {
  return (
    <g filter="url(#markerInk)">
      <circle cx={x} cy={y} r="13" fill="#c6b28a" stroke="#31271f" strokeWidth="4" />
      <circle cx={x} cy={y} r="5" fill="#efe1bd" opacity="0.72" />
    </g>
  );
}

function LevelTwoAltarMark({ x, y }: { x: number; y: number }) {
  return (
    <g opacity="0.9">
      <rect x={x - 22} y={y - 12} width="44" height="24" rx="4" fill="#8a6740" stroke="#3a2b20" strokeWidth="2.5" />
      <path d={`M${x} ${y - 18} V${y + 18} M${x - 15} ${y} H${x + 15}`} stroke="#e8d18e" strokeWidth="2.2" opacity="0.7" />
      <circle cx={x} cy={y} r="20" fill="none" stroke="#a77d3c" strokeWidth="1.6" opacity="0.58" />
    </g>
  );
}

function LevelTwoBrokenWallSegment({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.86">
      <rect x="-18" y="-5" width="16" height="10" rx="2" fill="#29231e" />
      <rect x="2" y="-7" width="20" height="13" rx="2" fill="#332b24" />
      <path d="M-12 -1 h7 M7 -2 h10" stroke="#86705a" strokeWidth="1.2" opacity="0.55" />
    </g>
  );
}

function LevelTwoSarcophagus({ x, y, w = 56, h = 24 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g filter="url(#markerInk)" opacity="0.9">
      <rect x={x} y={y} width={w} height={h} rx="5" fill="#8b8270" stroke="#2a2520" strokeWidth="2.2" />
      <rect x={x + 7} y={y + 5} width={w - 14} height={h - 10} rx="3" fill="#b3a589" opacity="0.42" />
      <path d={`M${x + w / 2} ${y + 5} V${y + h - 5} M${x + 12} ${y + h / 2} H${x + w - 12}`} stroke="#463a30" strokeWidth="1.7" opacity="0.58" />
    </g>
  );
}

function LevelTwoCarvedLine({ x, y, w, vertical = false }: { x: number; y: number; w: number; vertical?: boolean }) {
  return (
    <g opacity="0.55">
      <path d={vertical ? `M${x} ${y} V${y + w}` : `M${x} ${y} H${x + w}`} stroke="#514538" strokeWidth="5" strokeLinecap="round" />
      <path d={vertical ? `M${x} ${y + 5} V${y + w - 5}` : `M${x + 5} ${y} H${x + w - 5}`} stroke="#c3b493" strokeWidth="1.3" strokeLinecap="round" opacity="0.55" strokeDasharray="8 8" />
    </g>
  );
}

function LevelTwoDrainGrate({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.86" filter="url(#markerInk)">
      <rect x="-18" y="-10" width="36" height="20" rx="3" fill="#1d2422" stroke="#0c1110" strokeWidth="2" />
      {[-10, -4, 2, 8].map((offset) => (
        <path key={offset} d={`M${offset} -7 V7`} stroke="#66706a" strokeWidth="1.5" opacity="0.75" />
      ))}
      <path d="M-14 -4 H14 M-14 4 H14" stroke="#0d1110" strokeWidth="1.2" opacity="0.55" />
    </g>
  );
}

function LevelTwoPipeSegment({ x, y, w = 70, rotate = 0, theme }: { x: number; y: number; w?: number; rotate?: number; theme: LevelTwoMapTheme }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.78">
      <path d={`M0 0 H${w}`} stroke={theme.metal} strokeWidth="10" strokeLinecap="round" />
      <path d={`M5 -3 H${w - 5}`} stroke="#7a817d" strokeWidth="2" strokeLinecap="round" opacity="0.48" />
      {[16, w - 18].map((offset) => (
        <rect key={offset} x={offset - 3} y="-7" width="6" height="14" rx="2" fill="#202625" stroke="#101514" strokeWidth="1" />
      ))}
    </g>
  );
}

function LevelTwoSludgeStain({ x, y, w, h, theme }: { x: number; y: number; w: number; h: number; theme: LevelTwoMapTheme }) {
  return (
    <g opacity="0.58">
      <path d={`M${x} ${y + h / 2} C${x + w * 0.22} ${y - h * 0.35} ${x + w * 0.72} ${y + h * 1.35} ${x + w} ${y + h / 2} C${x + w * 0.72} ${y + h * 0.9} ${x + w * 0.24} ${y + h * 0.86} ${x} ${y + h / 2} Z`} fill={theme.sludge} opacity="0.45" />
      <path d={`M${x + 9} ${y + h / 2} C${x + w * 0.38} ${y + 2} ${x + w * 0.62} ${y + h - 2} ${x + w - 9} ${y + h / 2}`} stroke="#8b8f54" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.36" />
    </g>
  );
}

function LevelTwoRunoffMarks({ x, y, w, vertical = false, theme }: { x: number; y: number; w: number; vertical?: boolean; theme: LevelTwoMapTheme }) {
  return (
    <g opacity="0.46">
      {[0, 11, 22].map((offset) => (
        <path key={offset} d={vertical ? `M${x + offset} ${y} C${x + offset - 4} ${y + w * 0.36} ${x + offset + 5} ${y + w * 0.66} ${x + offset} ${y + w}` : `M${x} ${y + offset} C${x + w * 0.36} ${y + offset - 4} ${x + w * 0.66} ${y + offset + 5} ${x + w} ${y + offset}`} stroke={theme.water} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      ))}
    </g>
  );
}

function LevelTwoArcaneCircle({ x, y, r = 26, theme }: { x: number; y: number; r?: number; theme: LevelTwoMapTheme }) {
  return (
    <g opacity="0.82">
      <circle cx={x} cy={y} r={r} fill="none" stroke={theme.runeGlow} strokeWidth="2.2" opacity="0.55" />
      <circle cx={x} cy={y} r={r * 0.58} fill="none" stroke="#ead9ff" strokeWidth="1.4" opacity="0.35" />
      <path d={`M${x - r * 0.72} ${y + r * 0.42} L${x} ${y - r * 0.68} L${x + r * 0.72} ${y + r * 0.42} Z`} stroke={theme.runeGlow} strokeWidth="1.4" fill="none" opacity="0.46" />
      <path d={`M${x - r} ${y} H${x + r} M${x} ${y - r} V${y + r}`} stroke="#f1ddff" strokeWidth="1" opacity="0.22" />
    </g>
  );
}

function LevelTwoWorkbench({ x, y, w = 58, rotate = 0, theme }: { x: number; y: number; w?: number; rotate?: number; theme: LevelTwoMapTheme }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.84" filter="url(#markerInk)">
      <rect x="0" y="0" width={w} height="18" rx="3" fill="#5a3928" stroke="#241912" strokeWidth="2" />
      <path d={`M8 6 H${w - 8} M12 18 V28 M${w - 12} 18 V28`} stroke="#2c1d15" strokeWidth="2" opacity="0.62" />
      <path d={`M${w * 0.35} 3 h10 M${w * 0.62} 13 h8`} stroke={theme.brass} strokeWidth="1.5" opacity="0.62" />
    </g>
  );
}

function LevelTwoGearMark({ x, y, r = 15, theme }: { x: number; y: number; r?: number; theme: LevelTwoMapTheme }) {
  return (
    <g opacity="0.72">
      <circle cx={x} cy={y} r={r} fill="none" stroke={theme.metal} strokeWidth="2.6" />
      <circle cx={x} cy={y} r={r * 0.36} fill={theme.metal} opacity="0.38" />
      {[0, 45, 90, 135].map((angle) => (
        <path key={angle} d={`M${x} ${y - r - 7} V${y - r}`} stroke={theme.metal} strokeWidth="2.4" strokeLinecap="round" transform={`rotate(${angle} ${x} ${y})`} />
      ))}
    </g>
  );
}

function LevelTwoScorchStain({ x, y, w, h, theme }: { x: number; y: number; w: number; h: number; theme: LevelTwoMapTheme }) {
  return (
    <g opacity="0.56">
      <path d={`M${x} ${y + h / 2} C${x + w * 0.18} ${y - h * 0.5} ${x + w * 0.78} ${y - h * 0.2} ${x + w} ${y + h / 2} C${x + w * 0.72} ${y + h * 1.2} ${x + w * 0.24} ${y + h * 1.1} ${x} ${y + h / 2} Z`} fill={theme.scorch} opacity="0.48" />
      <path d={`M${x + 10} ${y + h / 2} C${x + w * 0.38} ${y + 2} ${x + w * 0.64} ${y + h - 2} ${x + w - 8} ${y + h / 2}`} stroke={theme.residue} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.36" />
    </g>
  );
}

function LevelTwoConduit({ x, y, w = 80, rotate = 0, theme }: { x: number; y: number; w?: number; rotate?: number; theme: LevelTwoMapTheme }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.78">
      <path d={`M0 0 H${w}`} stroke={theme.metal} strokeWidth="8" strokeLinecap="round" />
      <path d={`M4 -2 H${w - 4}`} stroke={theme.brass} strokeWidth="2" strokeLinecap="round" opacity="0.64" />
      <path d={`M12 2 H${w - 12}`} stroke={theme.runeGlow} strokeWidth="1.4" strokeLinecap="round" opacity="0.44" strokeDasharray="3 9" />
    </g>
  );
}

function LevelTwoBrokenApparatus({ x, y, theme, rotate = 0 }: { x: number; y: number; theme: LevelTwoMapTheme; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.82">
      <rect x="-18" y="-8" width="24" height="16" rx="3" fill={theme.metal} stroke="#171412" strokeWidth="1.8" />
      <circle cx="14" cy="-2" r="8" fill="none" stroke={theme.brass} strokeWidth="2" />
      <path d="M-12 0 h11 M9 8 l12 8 M9 -8 l14 -9" stroke="#191513" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 -2 l8 -4" stroke={theme.runeGlow} strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
    </g>
  );
}

function LevelTwoDampPatch({ x, y, w, h, theme }: { x: number; y: number; w: number; h: number; theme: LevelTwoMapTheme }) {
  return (
    <g opacity="0.62">
      <path d={`M${x} ${y + h / 2} C${x + w * 0.2} ${y - h * 0.36} ${x + w * 0.72} ${y - h * 0.18} ${x + w} ${y + h / 2} C${x + w * 0.68} ${y + h * 1.18} ${x + w * 0.28} ${y + h * 1.05} ${x} ${y + h / 2} Z`} fill={theme.water} opacity="0.38" />
      <path d={`M${x + 8} ${y + h / 2} C${x + w * 0.32} ${y + 3} ${x + w * 0.66} ${y + h - 3} ${x + w - 8} ${y + h / 2}`} stroke="#b8d8cf" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.3" />
    </g>
  );
}

function LevelTwoThresholdStones({ x, y, w = 64, rotate = 0, theme }: { x: number; y: number; w?: number; rotate?: number; theme: LevelTwoMapTheme }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.78">
      {Array.from({ length: 4 }).map((_, index) => (
        <rect key={index} x={index * (w / 4)} y="-5" width={w / 4 - 2} height="10" rx="2" fill={theme.wallMid} stroke={theme.wallStroke} strokeWidth="1" />
      ))}
      <path d={`M4 -1 H${w - 6}`} stroke={theme.wallHighlight} strokeWidth="1.1" opacity="0.48" />
    </g>
  );
}

function LevelTwoOldShrineMark({ x, y, theme }: { x: number; y: number; theme: LevelTwoMapTheme }) {
  return (
    <g opacity="0.72">
      <circle cx={x} cy={y} r="19" fill="none" stroke={theme.brass} strokeWidth="2" opacity="0.48" />
      <path d={`M${x} ${y - 15} V${y + 15} M${x - 12} ${y - 1} H${x + 12}`} stroke={theme.brass} strokeWidth="2" opacity="0.52" />
      <path d={`M${x - 20} ${y + 14} C${x - 5} ${y + 4} ${x + 8} ${y + 28} ${x + 22} ${y + 12}`} stroke={theme.water} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.28" />
    </g>
  );
}

function LevelTwoBarrierMark({ x, y, w = 48, rotate = 0, theme }: { x: number; y: number; w?: number; rotate?: number; theme: LevelTwoMapTheme }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity="0.75">
      <rect x="-4" y="-14" width="8" height="28" rx="2" fill={theme.metal} stroke="#171b18" strokeWidth="1.4" />
      <rect x={w - 4} y="-14" width="8" height="28" rx="2" fill={theme.metal} stroke="#171b18" strokeWidth="1.4" />
      <path d={`M0 -5 H${w} M0 6 H${w}`} stroke={theme.brass} strokeWidth="4" strokeLinecap="round" />
      <path d={`M6 -5 l12 11 M26 -5 l12 11`} stroke="#4a3826" strokeWidth="1.2" opacity="0.55" />
    </g>
  );
}

export function LevelTwoShrineRenderer({ connections, secretStroke, isPlayer }: { connections: MapConnection[]; secretStroke: string; isPlayer: boolean }) {
  const roomNumbers = [
    { x: 154, y: 216, label: '1' },
    { x: 324, y: 204, label: '2' },
    { x: 480, y: 211, label: '3' },
    { x: 490, y: 348, label: '4' },
    { x: 329, y: 344, label: '5' },
    { x: 167, y: 354, label: '6' },
  ];
  const footprintPath =
    'M70 158 C112 108 206 116 268 128 C342 92 448 116 558 158 C606 206 584 268 554 306 C604 360 562 428 488 444 C396 464 330 426 274 422 C202 452 112 426 72 374 C36 326 50 224 70 158 Z';

  return (
    <>
      <LevelTwoFoundation id="level-two-ruin-footprint" path={footprintPath} theme={shrineTheme}>
        <path d="M92 172 C156 142 218 150 278 148 M392 140 C470 148 528 174 558 220 M90 378 C150 410 220 400 270 382 M410 420 C478 420 536 398 552 350" stroke="#425f35" strokeWidth="18" strokeLinecap="round" fill="none" opacity="0.1" />
        <path d="M106 286 C176 258 238 292 304 270 S438 250 524 286" stroke={shrineTheme.water} strokeWidth="16" strokeLinecap="round" fill="none" opacity="0.1" />
        <path d="M126 154 C210 124 330 132 420 138 C486 144 536 168 566 218 M82 326 C142 404 238 414 314 390 C390 430 500 414 552 342" stroke="#241c16" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.14" strokeDasharray="42 20 16 24" />
        <path d="M142 160 C222 140 332 146 420 152 M108 342 C178 390 250 392 316 366 M412 404 C474 404 524 380 540 338" stroke="#d6bf8d" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.14" strokeDasharray="34 28" />
      </LevelTwoFoundation>
      <LevelTwoRubbleChips chips={[{ x: 94, y: 150, r: 7 }, { x: 236, y: 128 }, { x: 540, y: 176, r: 6 }, { x: 566, y: 392 }, { x: 92, y: 414, r: 5 }, { x: 346, y: 430, r: 7 }]} />
      <LevelTwoConnectionApron connections={connections} theme={shrineTheme} />
      <path d="M120 148 C184 126 218 152 268 142 C350 120 432 136 526 166 C552 218 528 272 540 318 C548 366 514 408 440 414 C366 424 322 392 264 402 C204 412 144 398 106 360 C82 304 98 224 120 148 Z" fill="#80633e" opacity="0.1" />
      <LevelTwoConnectionRoutes connections={connections} secretStroke={secretStroke} isPlayer={isPlayer} theme={shrineTheme} />
      <LevelTwoRoomShell x={88} y={170} w={132} h={92} theme={shrineTheme} />
      <LevelTwoRoomShell x={260} y={150} w={128} h={108} theme={shrineTheme} />
      <LevelTwoRoomShell x={424} y={168} w={112} h={86} theme={shrineTheme} />
      <LevelTwoRoomShell x={432} y={310} w={116} h={76} theme={shrineTheme} />
      <LevelTwoRoomShell x={270} y={302} w={118} h={84} theme={shrineTheme} />
      <LevelTwoRoomShell x={118} y={318} w={98} h={72} theme={shrineTheme} final />
      <g>
        <LevelTwoAltarMark x={326} y={205} />
        <LevelTwoPillar x={292} y={184} />
        <LevelTwoPillar x={358} y={184} />
        <LevelTwoStairs x={442} y={222} w={62} h={28} />
        <LevelTwoMoss x={102} y={226} scale={0.78} theme={shrineTheme} />
        <LevelTwoMoss x={504} y={356} scale={0.62} theme={shrineTheme} />
        <LevelTwoRubble x={132} y={184} scale={0.82} theme={shrineTheme} />
        <LevelTwoRubble x={292} y={354} scale={0.7} theme={shrineTheme} />
        <LevelTwoBrokenWallSegment x={214} y={318} rotate={-14} />
        <LevelTwoBrokenWallSegment x={424} y={166} rotate={8} />
        <LevelTwoWater x={446} y={366} w={72} h={12} theme={shrineTheme} />
        <LevelTwoMoss x={224} y={246} scale={0.52} theme={shrineTheme} />
        <LevelTwoMoss x={386} y={254} scale={0.48} theme={shrineTheme} />
        <LevelTwoRubble x={222} y={294} scale={0.55} theme={shrineTheme} />
        <LevelTwoRubble x={392} y={288} scale={0.5} theme={shrineTheme} />
        <LevelTwoDebris x={162} y={356} />
        <LevelTwoDebris x={512} y={196} />
        <LevelTwoDebris x={240} y={236} />
        <LevelTwoDebris x={402} y={240} />
        <LevelTwoCrack x={282} y={178} scale={0.9} />
        <LevelTwoCrack x={454} y={336} scale={0.78} />
        <LevelTwoCrack x={142} y={374} scale={0.72} />
      </g>
      {!isPlayer && (
        <>
          <LevelTwoMarker x={366} y={172} label="H" />
          <LevelTwoMarker x={528} y={326} label="T" />
          <LevelTwoMarker x={202} y={334} label="B" />
        </>
      )}
      <LevelTwoRoomNumbers rooms={roomNumbers} />
    </>
  );
}

export function LevelTwoCryptRenderer({ connections, secretStroke, isPlayer }: { connections: MapConnection[]; secretStroke: string; isPlayer: boolean }) {
  const roomNumbers = [
    { x: 360, y: 89, label: '1' },
    { x: 360, y: 215, label: '2' },
    { x: 149, y: 217, label: '3' },
    { x: 571, y: 217, label: '4' },
    { x: 206, y: 365, label: '5' },
    { x: 514, y: 365, label: '6' },
  ];
  const footprintPath = 'M252 38 H468 V148 H646 V286 H594 V424 H420 V398 H300 V424 H126 V286 H74 V148 H252 Z';

  return (
    <>
      <LevelTwoFoundation id="level-two-crypt-footprint" path={footprintPath} theme={cryptTheme}>
        <path d="M360 44 V416 M82 216 H638 M196 216 V408 M524 216 V408" stroke="#2c2520" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.18" />
        <path d="M360 58 V398 M104 216 H616 M206 224 V392 M514 224 V392" stroke="#b9aa8d" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.2" strokeDasharray="18 14" />
        <path d="M120 132 H600 M120 300 H600" stroke="#211b17" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.08" strokeDasharray="48 24" />
      </LevelTwoFoundation>
      <LevelTwoDust x={114} y={128} w={500} h={24} theme={cryptTheme} />
      <LevelTwoDust x={120} y={302} w={486} h={20} theme={cryptTheme} />
      <LevelTwoConnectionRoutes connections={connections} secretStroke={secretStroke} isPlayer={isPlayer} theme={cryptTheme} variant="crypt" />
      <LevelTwoRoomShell x={296} y={50} w={128} h={78} theme={cryptTheme} variant="crypt" />
      <LevelTwoRoomShell x={256} y={170} w={208} h={90} theme={cryptTheme} variant="crypt" />
      <LevelTwoRoomShell x={88} y={174} w={122} h={86} theme={cryptTheme} variant="crypt" />
      <LevelTwoRoomShell x={510} y={174} w={122} h={86} theme={cryptTheme} variant="crypt" />
      <LevelTwoRoomShell x={136} y={326} w={140} h={78} theme={cryptTheme} variant="crypt" />
      <LevelTwoRoomShell x={444} y={326} w={140} h={78} theme={cryptTheme} final variant="crypt" />
      <g>
        <LevelTwoSarcophagus x={332} y={103} w={56} h={20} />
        <LevelTwoSarcophagus x={288} y={230} w={52} h={18} />
        <LevelTwoSarcophagus x={380} y={230} w={52} h={18} />
        <LevelTwoSarcophagus x={168} y={378} w={58} h={18} />
        <LevelTwoSarcophagus x={486} y={378} w={58} h={18} />
        <LevelTwoCarvedLine x={310} y={205} w={100} />
        <LevelTwoCarvedLine x={360} y={70} w={46} vertical />
        <LevelTwoCarvedLine x={206} y={336} w={44} vertical />
        <LevelTwoCarvedLine x={514} y={336} w={44} vertical />
        <LevelTwoDust x={280} y={250} w={160} h={14} theme={cryptTheme} />
        <LevelTwoRubble x={116} y={222} scale={0.64} theme={cryptTheme} />
        <LevelTwoRubble x={542} y={204} scale={0.66} theme={cryptTheme} />
        <LevelTwoDebris x={190} y={348} />
        <LevelTwoDebris x={556} y={382} />
        <LevelTwoCrack x={330} y={188} scale={0.82} stroke="#4f463c" />
        <LevelTwoCrack x={528} y={222} scale={0.72} stroke="#4f463c" />
        <LevelTwoCrack x={154} y={224} scale={0.68} stroke="#4f463c" />
      </g>
      {!isPlayer && (
        <>
          <LevelTwoMarker x={190} y={192} label="H" />
          <LevelTwoMarker x={258} y={346} label="T" />
          <LevelTwoMarker x={566} y={346} label="B" />
        </>
      )}
      <LevelTwoRoomNumbers rooms={roomNumbers} />
    </>
  );
}

export function LevelTwoSewerRenderer({ connections, secretStroke, isPlayer }: { connections: MapConnection[]; secretStroke: string; isPlayer: boolean }) {
  const roomNumbers = [
    { x: 112, y: 238, label: '1' },
    { x: 280, y: 238, label: '2' },
    { x: 156, y: 112, label: '3' },
    { x: 416, y: 238, label: '4' },
    { x: 536, y: 371, label: '5' },
    { x: 626, y: 235, label: '6' },
  ];
  const footprintPath = 'M34 184 H226 V62 H230 V184 H484 V168 H696 V304 H636 V424 H456 V310 H344 V292 H204 V300 H42 Z';

  return (
    <>
      <LevelTwoFoundation id="level-two-sewer-footprint" path={footprintPath} theme={sewerTheme}>
        <path d="M52 240 H674 M156 84 V286 M280 204 V386 M416 170 V286 M536 254 V410" stroke={sewerTheme.water} strokeWidth="18" strokeLinecap="round" fill="none" opacity="0.12" />
        <path d="M56 220 H672 M156 88 V274 M280 214 V374 M416 180 V280 M536 264 V398" stroke="#92a077" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.22" strokeDasharray="18 16" />
        <path d="M44 186 H230 M230 202 H482 M482 184 H682 M458 312 H634 M42 290 H344" stroke="#151d1a" strokeWidth="6" strokeLinecap="round" opacity="0.12" strokeDasharray="52 26" />
      </LevelTwoFoundation>
      <LevelTwoConnectionApron connections={connections} theme={sewerTheme} />
      <LevelTwoSludgeStain x={78} y={248} w={70} h={24} theme={sewerTheme} />
      <LevelTwoSludgeStain x={236} y={250} w={84} h={22} theme={sewerTheme} />
      <LevelTwoSludgeStain x={468} y={374} w={88} h={24} theme={sewerTheme} />
      <LevelTwoConnectionRoutes connections={connections} secretStroke={secretStroke} isPlayer={isPlayer} theme={sewerTheme} variant="sewer" />
      <LevelTwoRoomShell x={58} y={196} w={108} h={84} theme={sewerTheme} variant="sewer" />
      <LevelTwoRoomShell x={220} y={196} w={120} h={84} theme={sewerTheme} variant="sewer" />
      <LevelTwoRoomShell x={96} y={74} w={120} h={76} theme={sewerTheme} variant="sewer" />
      <LevelTwoRoomShell x={358} y={194} w={116} h={88} theme={sewerTheme} variant="sewer" />
      <LevelTwoRoomShell x={468} y={330} w={136} h={82} theme={sewerTheme} variant="sewer" />
      <LevelTwoRoomShell x={570} y={178} w={112} h={114} theme={sewerTheme} final variant="sewer" />
      <g>
        <LevelTwoPipeSegment x={78} y={214} w={62} theme={sewerTheme} />
        <LevelTwoPipeSegment x={242} y={210} w={74} theme={sewerTheme} />
        <LevelTwoPipeSegment x={598} y={270} w={58} rotate={90} theme={sewerTheme} />
        <LevelTwoDrainGrate x={386} y={258} />
        <LevelTwoDrainGrate x={624} y={244} rotate={90} />
        <LevelTwoDrainGrate x={536} y={378} />
        <LevelTwoRunoffMarks x={78} y={252} w={66} theme={sewerTheme} />
        <LevelTwoRunoffMarks x={494} y={346} w={52} vertical theme={sewerTheme} />
        <LevelTwoMoss x={130} y={132} scale={0.52} theme={sewerTheme} />
        <LevelTwoMoss x={478} y={258} scale={0.46} theme={sewerTheme} />
        <LevelTwoRubble x={354} y={218} scale={0.52} theme={sewerTheme} />
        <LevelTwoDebris x={246} y={264} fill="#43493f" />
        <LevelTwoDebris x={584} y={206} fill="#43493f" />
        <LevelTwoCrack x={112} y={224} scale={0.68} stroke="#26332d" />
        <LevelTwoCrack x={506} y={356} scale={0.72} stroke="#26332d" />
      </g>
      {!isPlayer && (
        <>
          <LevelTwoMarker x={324} y={214} label="H" />
          <LevelTwoMarker x={458} y={216} label="T" />
          <LevelTwoMarker x={660} y={202} label="B" />
        </>
      )}
      <LevelTwoRoomNumbers rooms={roomNumbers} />
    </>
  );
}

export function LevelTwoLaboratoryRenderer({ connections, secretStroke, isPlayer }: { connections: MapConnection[]; secretStroke: string; isPlayer: boolean }) {
  const roomNumbers = [
    { x: 145, y: 133, label: '1' },
    { x: 350, y: 109, label: '2' },
    { x: 569, y: 151, label: '3' },
    { x: 160, y: 332, label: '4' },
    { x: 370, y: 348, label: '5' },
    { x: 586, y: 344, label: '6' },
  ];
  const footprintPath = 'M58 84 H244 V48 H450 V82 H646 V222 H604 V428 H292 V394 H76 V260 H58 Z';

  return (
    <>
      <LevelTwoFoundation id="level-two-laboratory-footprint" path={footprintPath} theme={laboratoryTheme}>
        <path d="M110 112 H430 M350 72 V394 M510 120 H628 M98 356 H626" stroke={laboratoryTheme.brass} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.12" strokeDasharray="28 18" />
        <path d="M240 94 C310 58 404 66 484 106 M244 376 C334 414 442 404 536 368" stroke={laboratoryTheme.runeGlow} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.16" strokeDasharray="5 18" />
        <path d="M72 246 H238 M430 252 H642 M246 180 V390" stroke="#171414" strokeWidth="7" strokeLinecap="round" opacity="0.1" strokeDasharray="42 24" />
      </LevelTwoFoundation>
      <LevelTwoConnectionApron connections={connections} theme={laboratoryTheme} />
      <LevelTwoConnectionRoutes connections={connections} secretStroke={secretStroke} isPlayer={isPlayer} theme={laboratoryTheme} variant="laboratory" />
      <LevelTwoRoomShell x={74} y={92} w={142} h={82} theme={laboratoryTheme} variant="laboratory" />
      <LevelTwoRoomShell x={274} y={60} w={152} h={98} theme={laboratoryTheme} variant="laboratory" />
      <LevelTwoRoomShell x={506} y={96} w={126} h={110} theme={laboratoryTheme} variant="laboratory" />
      <LevelTwoRoomShell x={92} y={284} w={136} h={96} theme={laboratoryTheme} variant="laboratory" />
      <LevelTwoRoomShell x={306} y={302} w={128} h={92} theme={laboratoryTheme} variant="laboratory" />
      <LevelTwoRoomShell x={520} y={286} w={132} h={116} theme={laboratoryTheme} final variant="laboratory" />
      <g>
        <LevelTwoWorkbench x={98} y={108} theme={laboratoryTheme} />
        <LevelTwoWorkbench x={106} y={354} w={64} theme={laboratoryTheme} />
        <LevelTwoArcaneCircle x={350} y={110} r={29} theme={laboratoryTheme} />
        <LevelTwoArcaneCircle x={586} y={344} r={31} theme={laboratoryTheme} />
        <LevelTwoGearMark x={582} y={154} theme={laboratoryTheme} />
        <LevelTwoGearMark x={372} y={348} r={13} theme={laboratoryTheme} />
        <LevelTwoConduit x={300} y={82} w={96} theme={laboratoryTheme} />
        <LevelTwoConduit x={536} y={318} w={76} rotate={90} theme={laboratoryTheme} />
        <LevelTwoScorchStain x={324} y={132} w={62} h={22} theme={laboratoryTheme} />
        <LevelTwoScorchStain x={544} y={354} w={68} h={26} theme={laboratoryTheme} />
        <LevelTwoBrokenApparatus x={410} y={330} theme={laboratoryTheme} rotate={-10} />
        <LevelTwoDebris x={122} y={142} fill="#4d4337" />
        <LevelTwoDebris x={328} y={370} fill="#4d4337" />
        <LevelTwoRubble x={526} y={188} scale={0.48} theme={laboratoryTheme} />
        <LevelTwoCrack x={320} y={364} scale={0.72} stroke="#3a302a" />
        <LevelTwoCrack x={540} y={310} scale={0.7} stroke="#3a302a" />
      </g>
      {!isPlayer && (
        <>
          <LevelTwoMarker x={410} y={82} label="H" />
          <LevelTwoMarker x={420} y={324} label="T" />
          <LevelTwoMarker x={636} y={314} label="B" />
        </>
      )}
      <LevelTwoRoomNumbers rooms={roomNumbers} />
    </>
  );
}

export function LevelTwoBlackfenRenderer({ connections, secretStroke, isPlayer }: { connections: MapConnection[]; secretStroke: string; isPlayer: boolean }) {
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
  const footprintPath = 'M50 74 H212 V136 H292 V82 H424 V172 H548 V214 H672 V352 H520 V426 H360 V414 H226 V438 H70 V328 H48 Z';

  return (
    <>
      <LevelTwoFoundation id="level-two-blackfen-footprint" path={footprintPath} theme={blackfenTheme}>
        <path d="M70 308 C154 282 242 310 314 288 S464 248 554 278" stroke={blackfenTheme.water} strokeWidth="26" strokeLinecap="round" fill="none" opacity="0.13" />
        <path d="M92 158 C132 146 168 156 204 142 M392 102 C440 82 490 92 526 76 M86 408 C138 428 184 420 224 396" stroke={blackfenTheme.moss} strokeWidth="10" strokeDasharray="2 14" strokeLinecap="round" fill="none" opacity="0.18" />
        <path d="M52 76 H204 M244 80 H424 M438 58 H536 M82 350 H214 M374 340 H496 M558 220 H652" stroke="#111612" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.1" strokeDasharray="38 20" />
      </LevelTwoFoundation>
      <LevelTwoConnectionApron connections={connections} theme={blackfenTheme} />
      <LevelTwoDampPatch x={86} y={136} w={82} h={22} theme={blackfenTheme} />
      <LevelTwoDampPatch x={98} y={394} w={70} h={18} theme={blackfenTheme} />
      <LevelTwoDampPatch x={408} y={268} w={82} h={24} theme={blackfenTheme} />
      <LevelTwoConnectionRoutes connections={connections} secretStroke={secretStroke} isPlayer={isPlayer} theme={blackfenTheme} variant="blackfen" />
      <LevelTwoRoomShell x={70} y={88} w={120} h={84} theme={blackfenTheme} variant="blackfen" />
      <LevelTwoRoomShell x={246} y={78} w={120} h={88} theme={blackfenTheme} variant="blackfen" />
      <LevelTwoRoomShell x={84} y={222} w={130} h={92} theme={blackfenTheme} variant="blackfen" />
      <LevelTwoRoomShell x={238} y={224} w={104} h={82} theme={blackfenTheme} variant="blackfen" />
      <LevelTwoRoomShell x={386} y={186} w={142} h={112} theme={blackfenTheme} variant="blackfen" />
      <LevelTwoRoomShell x={438} y={58} w={98} h={82} theme={blackfenTheme} variant="blackfen" />
      <LevelTwoRoomShell x={84} y={350} w={126} h={72} theme={blackfenTheme} variant="blackfen" />
      <LevelTwoRoomShell x={374} y={340} w={122} h={76} theme={blackfenTheme} variant="blackfen" />
      <LevelTwoRoomShell x={560} y={220} w={92} h={118} theme={blackfenTheme} final variant="blackfen" />
      <g>
        <LevelTwoWater x={88} y={140} w={78} h={16} theme={blackfenTheme} />
        <LevelTwoWater x={100} y={394} w={64} h={12} theme={blackfenTheme} />
        <LevelTwoMoss x={262} y={134} scale={0.75} theme={blackfenTheme} />
        <LevelTwoMoss x={396} y={278} scale={0.52} theme={blackfenTheme} />
        <LevelTwoOldShrineMark x={456} y={244} theme={blackfenTheme} />
        <LevelTwoBarrierMark x={92} y={118} w={56} theme={blackfenTheme} />
        <LevelTwoThresholdStones x={238} y={265} w={46} theme={blackfenTheme} />
        <LevelTwoThresholdStones x={374} y={386} w={54} theme={blackfenTheme} />
        <LevelTwoRubble x={396} y={386} scale={0.54} theme={blackfenTheme} />
        <LevelTwoRubble x={584} y={260} scale={0.5} theme={blackfenTheme} />
        <LevelTwoDebris x={112} y={392} fill="#4e5948" />
        <LevelTwoDebris x={474} y={96} fill="#4e5948" />
        <LevelTwoCrack x={584} y={260} scale={0.72} stroke="#26352e" />
        <LevelTwoCrack x={414} y={386} scale={0.68} stroke="#26352e" />
      </g>
      {!isPlayer && (
        <>
          <LevelTwoMarker x={174} y={106} label="T" />
          <LevelTwoMarker x={508} y={202} label="H" />
          <LevelTwoMarker x={633} y={238} label="B" />
        </>
      )}
      <LevelTwoRoomNumbers rooms={roomNumbers} />
    </>
  );
}
