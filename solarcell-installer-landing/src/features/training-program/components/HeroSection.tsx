import { Award } from 'lucide-react';
import { MetricBadge } from '../ui/MetricBadge';
import { heroBadges } from '../data/trainingProgramData';
import { TrainingOverviewPanel } from './TrainingOverviewPanel';

export function HeroSection() {
  return (
    <section className="page-frame grid gap-10 pb-6 pt-8 lg:grid-cols-[1fr_0.98fr] lg:items-start">
      <div className="max-w-[650px] pt-1">
        <span className="small-chip mb-4">
          <Award className="h-5 w-5" />
          Parcours certifiant
        </span>
        <h1 className="max-w-[620px] text-[46px] font-black leading-[0.98] tracking-[-0.055em] text-ink-950 md:text-[60px]">
          Parcours de <br /> formation <span className="text-solar-600">SolarCell</span>
        </h1>
        <p className="mt-5 max-w-[600px] text-[18px] font-medium leading-8 text-ink-700">
          Suivez nos 3 modules clés et devenez un installateur qualifié, capable de concevoir,
          installer et mettre en service des solutions solaires performantes et sécurisées.
        </p>
        <div className="mt-6 grid rounded-2xl border border-ink-100 bg-white shadow-solar-soft sm:grid-cols-2 xl:grid-cols-4">
          {heroBadges.map((badge, index) => (
            <div key={badge.label} className={index > 0 ? 'border-t border-ink-100 sm:border-l sm:border-t-0' : ''}>
              <MetricBadge icon={badge.icon} label={badge.label} />
            </div>
          ))}
        </div>
      </div>
      <TrainingOverviewPanel />
    </section>
  );
}
