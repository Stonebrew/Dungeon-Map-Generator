import type { LevelTwoMapTheme, MapPresentation } from '../types';
import { LevelTwoFloorTile, LevelTwoWallBlock, LevelTwoWallCorner } from './primitives';

export function LevelTwoRoomShell({
  x,
  y,
  w,
  h,
  theme,
  final = false,
  variant = 'ruin',
  presentation = 'screen',
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  theme: LevelTwoMapTheme;
  final?: boolean;
  variant?: 'ruin' | 'crypt' | 'sewer' | 'laboratory' | 'blackfen';
  presentation?: MapPresentation;
}) {
  const isPrint = presentation === 'print';
  const tileW = variant === 'crypt' || variant === 'sewer' || variant === 'laboratory' || variant === 'blackfen' ? 30 : 28;
  const tileH = variant === 'crypt' ? 22 : 22;
  const cols = Math.ceil((w - 24) / tileW);
  const rows = Math.ceil((h - 24) / tileH);
  const horizontalBlocks = Math.max(2, Math.floor(w / (variant === 'crypt' || variant === 'sewer' || variant === 'laboratory' || variant === 'blackfen' ? 30 : 28)));
  const verticalBlocks = Math.max(2, Math.floor(h / (variant === 'crypt' || variant === 'sewer' || variant === 'laboratory' || variant === 'blackfen' ? 28 : 26)));
  const clipId = `level-two-${variant}-room-${x}-${y}`;

  return (
    <g>
      <rect x={x - 10} y={y + 9} width={w + 20} height={h + 16} rx="5" fill={theme.shadow} opacity={isPrint ? '0.24' : '0.36'} />
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
        {!isPrint && Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: cols }).map((__, col) => <LevelTwoFloorTile key={`${row}-${col}`} x={x + 12 + col * tileW - (row % 2 ? 12 : 0)} y={y + 12 + row * tileH} w={tileW + 1} h={tileH + 1} tone={row + col + (final ? 2 : 0)} theme={theme} />),
        )}
      </g>
      <rect x={x + 9} y={y + 9} width={w - 18} height={h - 18} rx={variant === 'crypt' ? '2' : '3'} fill="none" stroke={theme.floorHighlight} strokeWidth={variant === 'crypt' ? '2.4' : '3'} opacity={isPrint ? '0.28' : variant === 'crypt' ? '0.38' : '0.46'} />
      <rect x={x + 15} y={y + 15} width={w - 30} height={h - 30} rx="1" fill="none" stroke={variant === 'crypt' ? '#2d251f' : variant === 'sewer' ? '#1f302a' : variant === 'laboratory' ? '#3a302a' : variant === 'blackfen' ? '#26372f' : '#4b3828'} strokeWidth="3" opacity={isPrint ? '0.26' : variant === 'crypt' ? '0.42' : '0.32'} />
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
