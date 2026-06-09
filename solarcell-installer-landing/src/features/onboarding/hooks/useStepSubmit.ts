import { useState } from 'react';
import { useSessionStore } from '../../auth/store/useSessionStore';
import { useOnboardingStore } from '../store/onboardingStore';
import type { OnboardingStepId } from '../types';

type SubmitFn<T> = (applicationId: number, payload: T) => Promise<{ ok: boolean; installerId: number }>;

export function useStepSubmit<T>(stepId: OnboardingStepId, saveFn: SubmitFn<T>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const user = useSessionStore((s) => s.user);
  const markCompleted = useOnboardingStore((s) => s.markCompleted);

  async function submit(payload: T) {
    if (!user?.applicationId) {
      setError('Session expirée. Veuillez vous reconnecter.');
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      await saveFn(user.applicationId, payload);
      markCompleted(stepId);
      setSaved(true);
      return true;
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Erreur lors de la sauvegarde.');
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, error, saved };
}
