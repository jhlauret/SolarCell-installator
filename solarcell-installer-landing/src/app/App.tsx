import { Navigate, Route, Routes } from 'react-router-dom';
import { SolarLandingPage } from '../features/solar-landing/SolarLandingPage';
import { OnboardingPage } from '../features/onboarding/pages/OnboardingPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<SolarLandingPage />} />
      <Route path="/onboarding/:stepId" element={<OnboardingPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
