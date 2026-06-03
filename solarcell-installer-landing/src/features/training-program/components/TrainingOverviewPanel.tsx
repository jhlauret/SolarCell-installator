import { CheckCircle2 } from 'lucide-react';
import { summaryStats, trainingModules } from '../data/trainingProgramData';

export function TrainingOverviewPanel() {
  return (
    <aside className="glass-card min-h-[286px] p-6 lg:p-8" aria-label="Résumé du parcours de formation">
      <h2 className="text-[22px] font-extrabold tracking-[-0.03em] text-ink-950">Votre parcours en un coup d’œil</h2>
      <div className="mt-7 grid gap-8 md:grid-cols-[1fr_1.18fr]">
        <ol className="space-y-6">
          {trainingModules.map((module) => (
            <li key={module.id} className="relative flex items-start gap-5">
              {module.order < trainingModules.length && (
                <span className="absolute left-[19px] top-10 h-12 border-l border-dashed border-solar-300" aria-hidden="true" />
              )}
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-solar-400 bg-solar-50 text-lg font-extrabold text-solar-700">
                {module.order}
              </span>
              <div className="flex flex-1 items-center justify-between gap-3">
                <p className="max-w-[220px] text-[15px] font-extrabold leading-5 text-ink-950">{module.title}</p>
                <span className="rounded-lg bg-solar-50 px-4 py-2 text-sm font-extrabold text-solar-700">{module.label}</span>
              </div>
            </li>
          ))}
        </ol>
        <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-solar-soft">
          <div className="mb-4 flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-ink-700">Avancement global</span>
            <span className="text-sm font-extrabold text-ink-950">33%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-ink-100">
            <div className="h-full w-1/3 rounded-full bg-solar-600" />
          </div>
          <div className="mt-5 grid grid-cols-2 rounded-xl border border-ink-100">
            {summaryStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  className={`flex min-h-[76px] items-center gap-3 p-4 ${index % 2 === 1 ? 'border-l border-ink-100' : ''} ${index > 1 ? 'border-t border-ink-100' : ''}`}
                  key={stat.label}
                >
                  <Icon className="h-6 w-6 text-solar-600" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-bold text-ink-500">{stat.label}</p>
                    <p className="text-[17px] font-extrabold text-ink-950">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-solar-50 py-3 text-sm font-bold text-solar-700">
            <CheckCircle2 className="h-5 w-5" />
            Certificat délivré après la validation des 3 modules
          </div>
        </div>
      </div>
    </aside>
  );
}
