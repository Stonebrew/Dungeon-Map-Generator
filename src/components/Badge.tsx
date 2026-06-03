import { Lock } from 'lucide-react';
import type { ReactNode } from 'react';

type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'border-slatewood/20 bg-slatewood/[0.08] text-ink/70',
  accent: 'border-ember/25 bg-ember/[0.08] text-ember',
  success: 'border-moss/25 bg-moss/[0.10] text-moss',
  warning: 'border-brass/25 bg-brass/[0.10] text-brass',
  danger: 'border-ember bg-ember text-white',
};

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: BadgeTone }) {
  return <span className={`catalog-tag inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-bold ${toneClasses[tone]}`}>{children}</span>;
}

export function LockedBadge() {
  return (
    <span className="catalog-tag inline-flex items-center gap-1 rounded-md border border-slatewood/20 bg-slatewood/[0.08] px-2.5 py-1 text-xs font-bold text-ink/45">
      <Lock className="h-3.5 w-3.5" aria-hidden="true" />
      Locked
    </span>
  );
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`paper-panel field-corner rounded-md border border-[#cdbfa9] p-4 shadow-tool ${className}`}>{children}</section>;
}

export function SectionHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section>
      <p className="ledger-label text-xs font-bold uppercase text-slatewood">{eyebrow}</p>
      <h2 className="survey-title mt-1 font-serif text-4xl font-bold leading-tight sm:text-5xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-base leading-7 text-ink/70">{text}</p>
    </section>
  );
}

export function Field({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  return (
    <div className={compact ? '' : 'mt-3'}>
      <p className="ledger-label text-xs font-black uppercase text-[#344e57]">{label}</p>
      <p className="mt-1 text-sm leading-6 text-ink/75">{value}</p>
    </div>
  );
}
