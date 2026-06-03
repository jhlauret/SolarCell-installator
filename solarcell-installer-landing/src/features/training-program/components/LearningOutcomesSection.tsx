import { UserRoundCheck } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { learningOutcomes } from '../data/trainingProgramData';

export function LearningOutcomesSection() {
  return (
    <section className="page-frame pb-8 pt-4">
      <div className="grid gap-4 lg:grid-cols-[180px_1fr_250px]">
        <div className="glass-card flex min-h-[118px] items-center px-6">
          <h2 className="section-title">
            Ce que vous <span className="text-solar-600">apprenez</span>
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {learningOutcomes.map((outcome) => {
            const Icon = outcome.icon;
            return (
              <article className="glass-card flex min-h-[118px] items-center gap-4 p-5" key={outcome.title}>
                <Icon className="h-11 w-11 shrink-0 text-solar-600" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-extrabold text-ink-950">{outcome.title}</h3>
                  <p className="mt-1 text-xs font-semibold leading-5 text-ink-700">{outcome.description}</p>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="glass-card flex min-h-[118px] items-center justify-between gap-4 bg-solar-50 p-5">
          <div>
            <h3 className="text-[17px] font-extrabold text-ink-950">Besoin d’aide ?</h3>
            <p className="mt-1 text-sm font-medium leading-5 text-ink-700">
              Notre équipe est là pour vous accompagner.
            </p>
            <Button size="md" className="mt-4 h-9 px-8 text-sm">Nous contacter</Button>
          </div>
          <div className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full bg-solar-100 text-solar-700">
            <UserRoundCheck className="h-10 w-10" aria-hidden="true" />
          </div>
        </aside>
      </div>
    </section>
  );
}
