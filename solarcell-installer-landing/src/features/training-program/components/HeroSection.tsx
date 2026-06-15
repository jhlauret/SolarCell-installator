import { BadgeCheck } from 'lucide-react';
import { heroBenefits } from '../data/trainingProgramData';

export function HeroSection() {
  return (
    <section className="grid gap-12 lg:grid-cols-[1fr_1.12fr] lg:items-start">
      <div className="pt-4">
        <div className="mb-4 inline-flex items-center gap-2 rounded-xl border border-solar-200 bg-white px-4 py-2 text-sm font-bold text-solar-700 shadow-sm">
          <BadgeCheck className="h-5 w-5" /> Parcours certifiant
        </div>
        <h1 className="max-w-[620px] text-[36px] font-black leading-[1.05] tracking-[-0.04em] text-ink sm:text-[44px] sm:leading-[0.98] md:text-[64px]">
          Parcours de <br /> formation <span className="text-solar-600">SolarCell</span>
        </h1>
        <p className="mt-5 max-w-[570px] text-lg leading-8 text-slate-600">
          Suivez nos 3 modules clés et devenez un installateur qualifié, capable de concevoir, installer et mettre en service des solutions solaires performantes et sécurisées.
        </p>
        <div className="mt-7 grid max-w-[650px] grid-cols-2 rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-4">
          {heroBenefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="flex items-center gap-3 border-slate-200 px-5 py-4 md:border-r last:border-r-0">
                <Icon className="h-7 w-7 shrink-0 text-solar-600" strokeWidth={1.9} />
                <div>
                  <p className="text-sm font-extrabold text-ink">{benefit.title}</p>
                  <p className="text-sm text-slate-500">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <CourseOverviewCard />
    </section>
  );
}

function CourseOverviewCard() {
  const steps = [
    ['1', 'Les principes de\nl’autoconsommation', 'Module 1'],
    ['2', 'L’installation des\npanneaux solaires', 'Module 2'],
    ['3', 'L’installation du\nZendure 4000 Pro', 'Module 3']
  ];

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:p-8">
      <h2 className="mb-7 text-2xl font-extrabold text-ink">Votre parcours en un coup d’œil</h2>
      <div className="grid gap-8 xl:grid-cols-[1.05fr_1fr]">
        <div className="space-y-7">
          {steps.map(([number, label, tag], index) => (
            <div key={number} className="relative flex items-center gap-5">
              {index < 2 && <div className="absolute left-[20px] top-11 h-12 border-l border-dashed border-solar-300" />}
              <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-solar-400 bg-solar-50 text-lg font-extrabold text-solar-700">
                {number}
              </span>
              <p className="whitespace-pre-line text-base font-extrabold leading-5 text-ink">{label}</p>
              <span className="ml-auto rounded-lg bg-solar-100 px-4 py-2 text-sm font-extrabold text-solar-700">{tag}</span>
            </div>
          ))}
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="p-5">
            <div className="mb-2 flex items-center justify-between text-sm font-bold text-ink">
              <span>Avancement global</span><span>33%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200"><div className="h-2 w-1/3 rounded-full bg-solar-600" /></div>
          </div>
          <div className="grid grid-cols-2 border-t border-slate-200">
            {[
              ['Durée totale', '14 h 30'],
              ['Vidéos', '38'],
              ['Ressources', '26'],
              ['Quiz & exercices', '18']
            ].map(([label, value]) => (
              <div key={label} className="border-b border-r border-slate-200 p-5 last:border-r-0">
                <p className="text-xs font-bold text-slate-500">{label}</p>
                <p className="mt-1 text-lg font-extrabold text-ink">{value}</p>
              </div>
            ))}
          </div>
          <div className="m-5 rounded-lg bg-solar-50 px-4 py-3 text-sm font-bold text-solar-800">✓ Certificat délivré après la validation des 3 modules</div>
        </div>
      </div>
    </aside>
  );
}
