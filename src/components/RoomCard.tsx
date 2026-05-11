import { ChevronDown, ChevronRight, Lock } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Room } from '../types';
import { Badge, Field } from './Badge';

function threatTone(threat: string) {
  if (threat === 'Severe') return 'danger';
  if (threat === 'High') return 'warning';
  if (threat === 'Moderate') return 'success';
  return 'neutral';
}

function previewText(text: string) {
  return text.length > 118 ? `${text.slice(0, 115).trim()}...` : text;
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45">{title}</h4>
      <div className="mt-1">{children}</div>
    </section>
  );
}

export function RoomCard({
  room,
  canRefresh,
  expanded,
  onToggle,
}: {
  room: Room;
  canRefresh: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article id={`room-${room.number}`} className={`scroll-mt-36 rounded-md border bg-white p-4 shadow-tool ${expanded ? 'border-ember/50' : 'border-ink/10'}`}>
      <button type="button" onClick={onToggle} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ember">Room {room.number}</p>
            <h3 className="font-serif text-2xl font-bold leading-tight">{room.name}</h3>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge tone={threatTone(room.threat)}>{room.threat}</Badge>
            {expanded ? <ChevronDown className="h-5 w-5 text-ink/45" aria-hidden="true" /> : <ChevronRight className="h-5 w-5 text-ink/45" aria-hidden="true" />}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {room.tags.slice(0, expanded ? room.tags.length : 3).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        {!expanded && <p className="mt-3 text-sm leading-6 text-ink/70">{previewText(room.readAloud)}</p>}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4 border-t border-ink/10 pt-4">
          <DetailSection title="Read Aloud">
            <p className="border-l-4 border-brass/50 pl-3 text-sm leading-6 text-ink/75">{room.readAloud}</p>
          </DetailSection>

          <DetailSection title="GM Notes">
            <p className="text-sm leading-6 text-ink/75">{room.gmNotes}</p>
          </DetailSection>

          <DetailSection title="Inhabitants">
            {room.inhabitants.length > 0 ? (
              <div className="space-y-3">
                {room.inhabitants.map((inhabitant) => (
                  <div key={inhabitant.name} className="rounded-md border border-ink/10 bg-parchment/55 p-3">
                    <h5 className="font-bold">{inhabitant.name}</h5>
                    <div className="mt-2 grid gap-2 text-sm text-ink/75 sm:grid-cols-2">
                      <Field compact label="Role" value={inhabitant.role} />
                      <Field compact label="Threat" value={inhabitant.threat} />
                      <Field compact label="Durability" value={inhabitant.durability} />
                      <Field compact label="Damage" value={inhabitant.damage} />
                      <Field compact label="Tactics" value={inhabitant.tactics} />
                      <Field compact label="Morale" value={inhabitant.morale} />
                      <Field compact label="Wants" value={inhabitant.wants} />
                      <Field compact label="Leverage" value={inhabitant.leverage} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-ink/60">No fixed inhabitants.</p>
            )}
          </DetailSection>

          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <DetailSection title="Treasure">
              <p className="text-sm leading-6 text-ink/75">{room.treasure}</p>
            </DetailSection>
            <DetailSection title="Secrets">
              <p className="text-sm leading-6 text-ink/75">{room.secrets}</p>
            </DetailSection>
            <DetailSection title="Exits">
              <p className="text-sm leading-6 text-ink/75">{room.exits}</p>
            </DetailSection>
          </div>

          <button
            type="button"
            className={`flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-bold ${
              canRefresh ? 'border-ember bg-ember text-white' : 'border-ink/10 bg-ink/5 text-ink/45'
            }`}
          >
            {!canRefresh && <Lock className="h-4 w-4" aria-hidden="true" />}
            Partial Refresh
          </button>
        </div>
      )}
    </article>
  );
}
