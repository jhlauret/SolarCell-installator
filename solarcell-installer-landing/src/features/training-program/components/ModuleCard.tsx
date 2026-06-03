import { BookOpen, Check, Clock3, FileText, PlaySquare } from 'lucide-react';
import { ProgressRing } from '../ui/ProgressRing';
import { useTrainingProgressStore } from '../hooks/useTrainingProgressStore';
import type { TrainingModule } from '../types/training';

function statusLabel(status: TrainingModule['status']) {
  if (status === 'completed') return 'Terminé';
  if (status === 'in_progress') return 'En cours';
  return 'À démarrer';
}

export function ModuleCard({ module }: { module: TrainingModule }) {
  const Icon = module.icon;
  const openCourse = useTrainingProgressStore((state) => state.openCourse);

  const handleAccessCourse = () => {
    openCourse(module.courseKey);
    // À connecter à React Router pour vos pages internes ou au BFF Odoo Learning.
    window.history.pushState(null, '', module.route);
  };

  return (
    <article className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[132px_1.2fr_1.25fr_150px_132px_180px] lg:items-center">
      <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-solar-50 text-solar-600">
        <Icon className="h-24 w-24" strokeWidth={1.7} />
      </div>

      <div>
        <span className="mb-4 inline-flex rounded-lg bg-solar-100 px-4 py-2 text-sm font-extrabold text-solar-700">{module.label}</span>
        <h3 className="text-2xl font-black tracking-[-0.02em] text-ink">{module.title}</h3>
        <p className="mt-2 max-w-[520px] text-[15px] leading-6 text-slate-600">{module.description}</p>
      </div>

      <ul className="space-y-2.5">
        {module.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3 text-[15px] font-semibold text-ink">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-solar-600 text-white"><Check className="h-3.5 w-3.5" /></span>
            {bullet}
          </li>
        ))}
      </ul>

      <div className="space-y-3 border-l border-slate-200 pl-6 text-sm font-semibold text-slate-600">
        <p className="flex items-center gap-3"><Clock3 className="h-4 w-4" /> {module.duration}</p>
        <p className="flex items-center gap-3"><PlaySquare className="h-4 w-4" /> {module.videos} vidéos</p>
        <p className="flex items-center gap-3"><FileText className="h-4 w-4" /> {module.resources} ressources</p>
        <p className="flex items-center gap-3"><BookOpen className="h-4 w-4" /> Quiz final</p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <ProgressRing value={module.progress} />
        <span className="rounded-md bg-solar-50 px-4 py-2 text-sm font-extrabold text-solar-700">{statusLabel(module.status)}</span>
      </div>

      <button
        type="button"
        onClick={handleAccessCourse}
        className="rounded-lg bg-solar-600 px-6 py-4 text-base font-extrabold text-white shadow-sm transition hover:bg-solar-700 focus:outline-none focus:ring-2 focus:ring-solar-500 focus:ring-offset-2"
        aria-label={`Accéder au cours ${module.title}`}
      >
        Accéder au cours
      </button>
    </article>
  );
}
