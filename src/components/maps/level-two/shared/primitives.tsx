import type { LevelTwoMapTheme } from '../types';

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

export function LevelTwoRubbleChips({ chips, fill = '#77624b' }: { chips: { x: number; y: number; r?: number }[]; fill?: string }) {
  return (
    <g opacity="0.62">
      {chips.map((chip) => (
        <path key={`${chip.x}-${chip.y}`} d={`M${chip.x} ${chip.y} l${chip.r ?? 5} -2 l3 5 l-${chip.r ?? 5} 3 Z`} fill={fill} opacity="0.48" />
      ))}
    </g>
  );
}

export function LevelTwoMoss({ x, y, theme, scale = 1 }: { x: number; y: number; theme: LevelTwoMapTheme; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity="0.82">
      <path d="M0 10 C12 -5 36 -1 44 14 C30 24 10 24 0 10 Z" fill={theme.moss} opacity="0.58" />
      <circle cx="12" cy="11" r="4" fill="#6f914f" opacity="0.5" />
      <circle cx="29" cy="13" r="5" fill="#557a43" opacity="0.55" />
    </g>
  );
}

export function LevelTwoWater({ x, y, w, h, theme }: { x: number; y: number; w: number; h: number; theme: LevelTwoMapTheme }) {
  return (
    <g opacity="0.86">
      <path d={`M${x} ${y + h / 2} C${x + w * 0.22} ${y - 5} ${x + w * 0.7} ${y + h + 5} ${x + w} ${y + h / 2}`} stroke={theme.water} strokeWidth={h} strokeLinecap="round" fill="none" opacity="0.54" />
      <path d={`M${x + 8} ${y + h / 2} C${x + w * 0.34} ${y + 3} ${x + w * 0.62} ${y + h - 3} ${x + w - 8} ${y + h / 2}`} stroke="#c6ece8" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
    </g>
  );
}

export function LevelTwoDust({ x, y, w, h, theme }: { x: number; y: number; w: number; h: number; theme: LevelTwoMapTheme }) {
  return (
    <g opacity="0.26">
      <path d={`M${x} ${y + h / 2} C${x + w * 0.25} ${y - 8} ${x + w * 0.72} ${y + h + 8} ${x + w} ${y + h / 2}`} stroke={theme.dust} strokeWidth={h} strokeLinecap="round" fill="none" />
      <path d={`M${x + 10} ${y + h / 2} C${x + w * 0.35} ${y + 4} ${x + w * 0.62} ${y + h - 4} ${x + w - 10} ${y + h / 2}`} stroke="#fff6df" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.42" />
    </g>
  );
}

