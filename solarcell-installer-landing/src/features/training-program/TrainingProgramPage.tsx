import { SiteHeader } from '../../shared/layout/SiteHeader';
import { HeroSection } from './components/HeroSection';
import { LearningOutcomesSection } from './components/LearningOutcomesSection';
import { ModulesSection } from './components/ModulesSection';

export function TrainingProgramPage() {
  return (
    <div className="training-page min-h-screen overflow-x-hidden text-ink-950">
      <div className="border-b border-ink-100">
        <SiteHeader />
      </div>
      <main>
        <HeroSection />
        <ModulesSection />
        <LearningOutcomesSection />
      </main>
    </div>
  );
}
