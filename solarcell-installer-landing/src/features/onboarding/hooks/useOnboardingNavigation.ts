import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { onboardingSteps, stepById } from '../data/onboardingSteps';
import type { OnboardingStep, OnboardingStepId } from '../types';
import { useOnboardingStore } from '../store/onboardingStore';

export function useOnboardingNavigation() {
  const params = useParams();
  const navigate = useNavigate();
  const markCompleted = useOnboardingStore((state) => state.markCompleted);

  const currentStep = useMemo<OnboardingStep>(() => {
    const step = stepById[params.stepId ?? 'personal'];
    return step ?? onboardingSteps[0];
  }, [params.stepId]);

  const currentIndex = onboardingSteps.findIndex((step) => step.id === currentStep.id);
  const previousStep = currentIndex > 0 ? onboardingSteps[currentIndex - 1] : undefined;
  const nextStep = currentIndex < onboardingSteps.length - 1 ? onboardingSteps[currentIndex + 1] : undefined;

  function goToStep(stepId: OnboardingStepId) {
    navigate(`/onboarding/${stepId}`);
  }

  function goNext() {
    markCompleted(currentStep.id);
    if (nextStep) {
      navigate(`/onboarding/${nextStep.id}`);
    } else {
      // Last step completed: return to the landing page.
      navigate('/');
    }
  }

  function goPrevious() {
    if (previousStep) {
      navigate(`/onboarding/${previousStep.id}`);
    }
  }

  return {
    currentStep,
    currentIndex,
    steps: onboardingSteps,
    previousStep,
    nextStep,
    goToStep,
    goNext,
    goPrevious
  };
}
