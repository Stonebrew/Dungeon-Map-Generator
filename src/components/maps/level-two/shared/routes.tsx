import type { MapConnection } from '../../../../types';
import type { LevelTwoMapTheme, LevelTwoRouteVariant } from '../types';

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
  variant?: LevelTwoRouteVariant;
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
            : variant === 'cavern'
              ? { shadow: 58, outer: 43, mid: 33, floor: 24, seam: 3.5, highlight: 1.5 }
              : variant === 'volcanicForge'
                ? { shadow: 58, outer: 46, mid: 36, floor: 27, seam: 5, highlight: 1.8 }
                : variant === 'frozenRuin'
                  ? { shadow: 54, outer: 42, mid: 32, floor: 24, seam: 4, highlight: 1.8 }
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
          {variant === 'cavern' && (
            <>
              <path d={path} stroke={theme.wallHighlight} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.3" strokeDasharray="2 13" />
              <path d={path} stroke={theme.runeGlow} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.24" strokeDasharray="10 18" />
            </>
          )}
          {variant === 'volcanicForge' && (
            <>
              <path d={path} stroke={theme.metal} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.38" strokeDasharray="18 12" />
              <path d={path} stroke={theme.runeGlow} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.24" strokeDasharray="2 18" />
            </>
          )}
          {variant === 'frozenRuin' && (
            <>
              <path d={path} stroke={theme.runeGlow} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.34" strokeDasharray="11 13" />
              <path d={path} stroke={theme.wallHighlight} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" strokeDasharray="3 15" />
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
