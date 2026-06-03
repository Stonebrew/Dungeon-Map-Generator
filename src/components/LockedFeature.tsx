import { Crown, Lock } from 'lucide-react';
import { getFeatureDescription, getFeatureLabel, getRequiredTier, getTierLabel, type FeatureKey } from '../lib/entitlements';
import { Badge, Panel } from './Badge';

export function LockedFeature({
  feature,
  onUpgrade,
}: {
  feature: FeatureKey;
  onUpgrade: () => void;
}) {
  const label = getFeatureLabel(feature);
  const requiredTier = getRequiredTier(feature);
  const description = getFeatureDescription(feature);

  return (
    <Panel className="border-brass/35">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <Badge tone="warning">Premium locked</Badge>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brass/15 text-brass">
              <Lock className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="survey-title font-serif text-3xl font-bold">{label}</h2>
              <p className="mt-1 text-sm font-bold text-ink/60">Available in {getTierLabel(requiredTier)} and above.</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-ink/70">{description}</p>
        </div>
        <button type="button" onClick={onUpgrade} className="inline-flex items-center justify-center gap-2 rounded-md bg-brass px-4 py-2 text-sm font-bold text-white">
          <Crown className="h-4 w-4" aria-hidden="true" />
          View Upgrade Options
        </button>
      </div>
    </Panel>
  );
}
