import { Navigate, Route, Routes } from 'react-router-dom';
import { SolarLandingPage } from '../features/solar-landing/SolarLandingPage';
import { OnboardingPage } from '../features/onboarding/pages/OnboardingPage';
import { TrainingProgramPage } from '../features/training-program/TrainingProgramPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<SolarLandingPage />} />
      <Route path="/formation" element={<TrainingProgramPage />} />
      <Route path="/onboarding/:stepId" element={<OnboardingPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
