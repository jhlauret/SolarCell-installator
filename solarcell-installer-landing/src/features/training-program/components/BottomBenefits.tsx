import { UserRoundCheck } from 'lucide-react';
import { learningBenefits } from '../data/trainingProgramData';

export function BottomBenefits() {
  return (
    <section className="grid gap-4 lg:grid-cols-[180px_repeat(4,1fr)_280px]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-2xl font-black leading-tight text-ink">Ce que vous <span className="text-solar-600">apprenez</span></p>
      </div>
      {learningBenefits.map((benefit) => {
        const Icon = benefit.icon;
        return (
          <div key={benefit.title} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
            <Icon className="h-11 w-11 shrink-0 text-solar-600" strokeWidth={1.7} />
            <div>
              <h3 className="text-sm font-black text-ink">{benefit.title}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-600">{benefit.description}</p>
            </div>
          </div>
        );
      })}
      <div className="flex items-center justify-between rounded-2xl border border-solar-100 bg-solar-50 p-5">
        <div>
          <h3 className="text-lg font-black text-ink">Besoin d’aide ?</h3>
          <p className="mt-1 text-sm leading-5 text-slate-600">Notre équipe est là pour vous accompagner.</p>
          <button type="button" className="mt-4 rounded-md bg-solar-600 px-8 py-2 text-sm font-extrabold text-white hover:bg-solar-700">Nous contacter</button>
        </div>
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-solar-100 text-solar-600">
          <UserRoundCheck className="h-10 w-10" />
        </div>
      </div>
    </section>
  );
}
