import { create } from 'zustand';
import type { OnboardingStepId } from '../types';

type OnboardingStore = {
  completedSteps: OnboardingStepId[];
  markCompleted: (stepId: OnboardingStepId) => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  completedSteps: [],
  markCompleted: (stepId) =>
    set((state) => ({
      completedSteps: state.completedSteps.includes(stepId) ? state.completedSteps : [...state.completedSteps, stepId]
    })),
  reset: () => set({ completedSteps: [] })
}));
