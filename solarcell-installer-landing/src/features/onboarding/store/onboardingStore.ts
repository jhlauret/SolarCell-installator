import { create } from 'zustand';
import type { OnboardingStepId } from '../types';
import { getOnboardingStatus } from '../api/onboardingApi';

type OnboardingStore = {
  completedSteps: OnboardingStepId[];
  installerId: number | null;
  isSyncing: boolean;
  markCompleted: (stepId: OnboardingStepId) => void;
  restoreFromOdoo: (applicationId: number) => Promise<void>;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  completedSteps: [],
  installerId: null,
  isSyncing: false,

  markCompleted: (stepId) =>
    set((state) => ({
      completedSteps: state.completedSteps.includes(stepId)
        ? state.completedSteps
        : [...state.completedSteps, stepId],
    })),

  restoreFromOdoo: async (applicationId: number) => {
    set({ isSyncing: true });
    try {
      const status = await getOnboardingStatus(applicationId);
      if (status.exists) {
        set({
          completedSteps: status.completedSteps ?? [],
          installerId: status.installerId ?? null,
        });
      }
    } catch {
      // silencieux : si Odoo est indisponible, on repart de zéro
    } finally {
      set({ isSyncing: false });
    }
  },

  reset: () => set({ completedSteps: [], installerId: null }),
}));
