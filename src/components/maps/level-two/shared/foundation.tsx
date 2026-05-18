import type { ReactNode } from 'react';
import type { LevelTwoMapTheme } from '../types';

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
