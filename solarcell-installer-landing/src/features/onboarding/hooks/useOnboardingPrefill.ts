import { useEffect, useState } from 'react';
import { getOnboardingData, type OnboardingPrefillData } from '../api/onboardingApi';

export function useOnboardingPrefill(applicationId?: number) {
  const [prefill, setPrefill] = useState<OnboardingPrefillData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!applicationId) return;
    setLoading(true);
    getOnboardingData(applicationId)
      .then(setPrefill)
      .catch(() => setPrefill(null))
      .finally(() => setLoading(false));
  }, [applicationId]);

  return { prefill, loading };
}
