import { SiteHeader } from '../../shared/layout/SiteHeader';
import { HeroSection } from './components/HeroSection';
import { ModuleCard } from './components/ModuleCard';
import { BottomBenefits } from './components/BottomBenefits';
import { trainingModules } from './data/trainingProgramData';

export function TrainingProgramPage() {
  return (
    <div className="training-page min-h-screen overflow-x-hidden text-ink">
      <div className="border-b border-ink-100">
        <SiteHeader />
      </div>
      <main className="mx-auto max-w-[1540px] px-8 py-7">
        <HeroSection />
        <section className="mt-6 space-y-4" aria-label="Modules de formation SolarCell">
          {trainingModules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </section>
        <div className="mt-5">
          <BottomBenefits />
        </div>
      </main>
    </div>
  );
}
