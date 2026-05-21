import type { MapConnection } from '../../../../types';
import type { LevelTwoMapTheme, LevelTwoRouteVariant, MapPresentation } from '../types';

function LevelTwoSecretRoutes({ paths, stroke, presentation = 'screen' }: { paths: string[]; stroke: string; presentation?: MapPresentation }) {
  const isPrint = presentation === 'print';
  return (
    <>
      {paths.map((path) => (
        <path key={`${path}-level-two-secret`} d={path} stroke={stroke} strokeWidth={isPrint ? '6' : '4.5'} strokeDasharray={isPrint ? '12 7' : '10 8'} strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#inkRoughen)" opacity={isPrint ? '0.95' : '1'} />
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
  presentation = 'screen',
}: {
  connections: MapConnection[];
  secretStroke: string;
  isPlayer: boolean;
  theme: LevelTwoMapTheme;
  variant?: LevelTwoRouteVariant;
  presentation?: MapPresentation;
}) {
  const isPrint = presentation === 'print';
  const normalPaths = connections.filter((connection) => connection.type === 'normal' && connection.path).map((connection) => connection.path as string);
  const secretPaths = connections.filter((connection) => connection.type === 'secret' && connection.path).map((connection) => connection.path as string);
  const screenWidths =
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
                  : variant === 'desertTemple'
                    ? { shadow: 52, outer: 42, mid: 32, floor: 23, seam: 4, highlight: 1.8 }
                    : { shadow: 46, outer: 38, mid: 30, floor: 23, seam: 5, highlight: 2 };
  const widths = isPrint
    ? {
        shadow: Math.max(42, screenWidths.shadow - 8),
        outer: Math.max(34, screenWidths.outer - 4),
        mid: screenWidths.mid,
        floor: screenWidths.floor,
        seam: Math.max(3.5, screenWidths.seam - 1),
        highlight: screenWidths.highlight,
      }
    : screenWidths;

  return (
    <>
      {normalPaths.map((path) => (
        <g key={path}>
          <path d={path} stroke={theme.corridorShadow} strokeWidth={widths.shadow} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isPrint ? '0.16' : variant === 'crypt' ? '0.22' : '0.28'} />
          <path d={path} stroke={theme.corridorOuter} strokeWidth={widths.outer} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isPrint ? '1' : '0.9'} />
          <path d={path} stroke={theme.corridorMid} strokeWidth={widths.mid} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.96" />
          <path d={path} stroke={theme.corridorFloor} strokeWidth={widths.floor} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isPrint ? '1' : variant === 'crypt' ? '0.9' : '0.98'} />
          <path d={path} stroke={theme.corridorSeam} strokeWidth={widths.seam} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={variant === 'crypt' ? '18 14' : '16 12'} opacity={isPrint ? '0.48' : variant === 'crypt' ? '0.42' : '0.72'} />
          {!isPrint && <path d={path} stroke={theme.corridorHighlight} strokeWidth={widths.highlight} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={variant === 'crypt' ? '8 16' : '5 20'} opacity={variant === 'crypt' ? '0.45' : '0.68'} />}
          {variant === 'sewer' && (
            <>
              <path d={path} stroke={theme.water} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isPrint ? '0.48' : '0.72'} />
              {!isPrint && <path d={path} stroke="#789783" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="14 18" opacity="0.5" />}
            </>
          )}
          {variant === 'laboratory' && (
            <>
              <path d={path} stroke={theme.brass} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isPrint ? '0.44' : '0.62'} strokeDasharray="18 16" />
              {!isPrint && <path d={path} stroke={theme.runeGlow} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.46" strokeDasharray="3 18" />}
            </>
          )}
          {variant === 'blackfen' && (
            <>
              <path d={path} stroke={theme.water} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isPrint ? '0.24' : '0.34'} strokeDasharray="24 18" />
              {!isPrint && <path d={path} stroke={theme.moss} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.34" strokeDasharray="5 20" />}
            </>
          )}
          {variant === 'cavern' && (
            <>
              <path d={path} stroke={theme.wallHighlight} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isPrint ? '0.2' : '0.3'} strokeDasharray="2 13" />
              {!isPrint && <path d={path} stroke={theme.runeGlow} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.24" strokeDasharray="10 18" />}
            </>
          )}
          {variant === 'volcanicForge' && (
            <>
              <path d={path} stroke={theme.metal} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isPrint ? '0.52' : '0.38'} strokeDasharray="18 12" />
              {!isPrint && <path d={path} stroke={theme.runeGlow} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.24" strokeDasharray="2 18" />}
            </>
          )}
          {variant === 'frozenRuin' && (
            <>
              <path d={path} stroke={theme.runeGlow} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isPrint ? '0.24' : '0.34'} strokeDasharray="11 13" />
              {!isPrint && <path d={path} stroke={theme.wallHighlight} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" strokeDasharray="3 15" />}
            </>
          )}
          {variant === 'desertTemple' && (
            <>
              <path d={path} stroke={theme.dust} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isPrint ? '0.32' : '0.42'} strokeDasharray="22 18" />
              {!isPrint && <path d={path} stroke={theme.brass} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.34" strokeDasharray="8 18" />}
            </>
          )}
        </g>
      ))}
      {!isPlayer && <LevelTwoSecretRoutes paths={secretPaths} stroke={secretStroke} presentation={presentation} />}
    </>
  );
}

export function LevelTwoConnectionApron({ connections, theme, presentation = 'screen' }: { connections: MapConnection[]; theme: LevelTwoMapTheme; presentation?: MapPresentation }) {
  const normalPaths = connections.filter((connection) => connection.type === 'normal' && connection.path).map((connection) => connection.path as string);
  const isPrint = presentation === 'print';

  return (
    <g>
      {normalPaths.map((path) => (
        <path key={`${path}-apron-shadow`} d={path} stroke="#1b1410" strokeWidth="58" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isPrint ? '0.04' : '0.08'} />
      ))}
      {normalPaths.map((path) => (
        <path key={`${path}-apron`} d={path} stroke={theme.foundationFill} strokeWidth="48" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isPrint ? '0.06' : '0.12'} />
      ))}
      {!isPrint &&
        normalPaths.map((path) => (
          <path key={`${path}-apron-floor`} d={path} stroke={theme.corridorMid} strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.1" />
        ))}
      {!isPrint &&
        normalPaths.map((path) => (
          <path key={`${path}-apron-seams`} d={path} stroke="#4d3a2b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.18" strokeDasharray="20 18" />
        ))}
      {!isPrint &&
        normalPaths.map((path) => (
          <path key={`${path}-moss-edge`} d={path} stroke={theme.moss} strokeWidth="52" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.06" strokeDasharray="30 36" />
        ))}
    </g>
  );
}
