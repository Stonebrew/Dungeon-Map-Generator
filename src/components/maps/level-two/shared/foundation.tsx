import type { ReactNode } from 'react';
import type { LevelTwoMapTheme, MapPresentation } from '../types';

export function LevelTwoFoundation({
  id,
  path,
  theme,
  children,
  presentation = 'screen',
}: {
  id: string;
  path: string;
  theme: LevelTwoMapTheme;
  children?: ReactNode;
  presentation?: MapPresentation;
}) {
  const isPrint = presentation === 'print';
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={path} />
        </clipPath>
      </defs>
      <path d={path} fill={theme.shadow} opacity={isPrint ? '0.06' : '0.1'} transform="translate(0 8)" />
      <path d={path} fill={theme.foundationFill} opacity={isPrint ? '0.035' : '0.07'} />
      <g clipPath={`url(#${id})`}>
        <g opacity={isPrint ? '0.62' : '1'}>{children}</g>
      </g>
    </g>
  );
}
