import { Navigate, Route, Routes } from 'react-router-dom';
import { SolarLandingPage } from '../features/solar-landing/SolarLandingPage';
import { OnboardingPage } from '../features/onboarding/pages/OnboardingPage';
import { OnboardingComplete } from '../features/onboarding/pages/OnboardingComplete';
import { TrainingProgramPage } from '../features/training-program/TrainingProgramPage';
import { InstallerLoginModal } from '../features/auth/components/InstallerLoginModal';

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SolarLandingPage />} />
        <Route path="/formation" element={<TrainingProgramPage />} />
        <Route path="/onboarding/termine" element={<OnboardingComplete />} />
        <Route path="/onboarding/:stepId" element={<OnboardingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <InstallerLoginModal />
    </>
  );
}
