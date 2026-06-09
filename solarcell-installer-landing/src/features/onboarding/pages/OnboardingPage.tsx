import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { SiteHeader } from '../../../shared/layout/SiteHeader';
import { Sidebar } from '../components/Sidebar';
import { OnboardingMain } from '../components/OnboardingMain';
import { RightInfoColumn } from '../components/RightInfoColumn';
import { useOnboardingNavigation } from '../hooks/useOnboardingNavigation';
import { stepById } from '../data/onboardingSteps';
import { useOnboardingStore } from '../store/onboardingStore';
import { useSessionStore } from '../../auth/store/useSessionStore';

export function OnboardingPage() {
  const params = useParams();
  const nav = useOnboardingNavigation();
  const isKnownStep = Boolean(stepById[params.stepId ?? 'personal']);
  const restoreFromOdoo = useOnboardingStore((s) => s.restoreFromOdoo);
  const user = useSessionStore((s) => s.user);

  useEffect(() => {
    if (user?.applicationId) {
      restoreFromOdoo(user.applicationId);
    }
  }, [user?.applicationId, restoreFromOdoo]);

  if (!isKnownStep) {
    return <Navigate to="/onboarding/personal" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-ink-200">
        <SiteHeader />
      </div>
      <div className="solar-container">
        <Sidebar steps={nav.steps} currentStep={nav.currentStep} onStepClick={nav.goToStep} />
        <OnboardingMain {...nav} />
        <RightInfoColumn currentStep={nav.currentStep} />
      </div>
    </div>
  );
}
