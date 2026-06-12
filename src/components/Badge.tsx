import { Lock } from 'lucide-react';
import type { ReactNode } from 'react';

type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'border-l-slatewood/35 bg-slatewood/[0.035] text-ink/58',
  accent: 'border-l-ember/45 bg-ember/[0.045] text-ember/90',
  success: 'border-l-moss/45 bg-moss/[0.055] text-moss/90',
  warning: 'border-l-brass/45 bg-brass/[0.055] text-brass/90',
  danger: 'border-l-ember/55 bg-ember/[0.07] text-ember/95',
};

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: BadgeTone }) {
  return <span className={`status-tag inline-flex items-center rounded-[3px] border border-transparent border-l-2 px-2 py-0.5 text-[11px] font-black leading-5 ${toneClasses[tone]}`}>{children}</span>;
}

export function LockedBadge() {
  return (
    <span className="status-tag inline-flex items-center gap-1 rounded-[3px] border border-transparent border-l-2 border-l-slatewood/30 bg-slatewood/[0.035] px-2 py-0.5 text-[11px] font-black leading-5 text-ink/45">
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
