import { trainingModules } from '../data/trainingProgramData';
import { ModuleCard } from './ModuleCard';

export function ModulesSection() {
  return (
    <section className="page-frame mt-4 space-y-4" aria-label="Modules de formation SolarCell">
      {trainingModules.map((module) => (
        <ModuleCard key={module.id} module={module} />
      ))}
    </section>
  );
}
