import { Lock } from 'lucide-react';
import type { ReactNode } from 'react';

type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-ink/10 text-ink/70',
  accent: 'bg-ember/10 text-ember',
  success: 'bg-moss/15 text-moss',
  warning: 'bg-brass/15 text-brass',
  danger: 'bg-ember text-white',
};

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: BadgeTone }) {
  return <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${toneClasses[tone]}`}>{children}</span>;
}

export function LockedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-ink/10 px-2.5 py-1 text-xs font-bold text-ink/45">
      <Lock className="h-3.5 w-3.5" aria-hidden="true" />
      Locked
    </span>
  );
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-md border border-ink/10 bg-white p-4 shadow-tool ${className}`}>{children}</section>;
}

export function SectionHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-ember">{eyebrow}</p>
      <h2 className="mt-1 font-serif text-4xl font-bold leading-tight sm:text-5xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-base leading-7 text-ink/70">{text}</p>
    </section>
  );
}

export function Field({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  return (
    <div className={compact ? '' : 'mt-3'}>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45">{label}</p>
      <p className="mt-1 text-sm leading-6 text-ink/75">{value}</p>
    </div>
  );
}
