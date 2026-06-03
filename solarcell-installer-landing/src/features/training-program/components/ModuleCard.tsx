import { CheckCircle2, Clock3, FileText, PlaySquare, ClipboardCheck, type LucideIcon } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { CircularProgress } from '../ui/CircularProgress';
import { clsx } from '../../../shared/ui/clsx';
import { moduleStatusLabels } from '../data/trainingProgramData';
import { useTrainingProgressStore } from '../hooks/useTrainingProgressStore';
import type { TrainingModule } from '../types/training';

interface ModuleCardProps {
  module: TrainingModule;
}

export function ModuleCard({ module }: ModuleCardProps) {
  const progressByModule = useTrainingProgressStore((state) => state.progressByModule);
  const selectModule = useTrainingProgressStore((state) => state.selectModule);
  const progress = progressByModule[module.id] ?? module.progress;
  const Icon = module.icon;

  return (
    <article className="glass-card grid min-h-[138px] grid-cols-1 gap-5 p-4 transition-transform hover:-translate-y-0.5 md:grid-cols-[124px_1.18fr_1.02fr_170px_190px] md:items-center md:p-5">
      <div className="green-icon-tile h-[112px] w-[112px]">
        <Icon className="h-[72px] w-[72px] stroke-[1.65]" aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <span className="mb-4 inline-flex rounded-lg bg-solar-50 px-4 py-2 text-sm font-extrabold text-solar-700">
          {module.label}
        </span>
        <h3 className="text-[23px] font-extrabold leading-tight tracking-[-0.03em] text-ink-950">{module.title}</h3>
        <p className="mt-2 text-[15px] font-medium leading-6 text-ink-700">{module.description}</p>
      </div>

      <ul className="space-y-2.5 text-[14px] font-bold text-ink-800">
        {module.bullets.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0 fill-solar-600 text-white" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <dl className="space-y-2.5 border-y border-ink-100 py-4 text-[14px] font-bold text-ink-700 md:border-x md:border-y-0 md:px-5 md:py-0">
        <MetaItem icon={Clock3} value={module.meta.duration} />
        <MetaItem icon={PlaySquare} value={module.meta.videos} />
        <MetaItem icon={FileText} value={module.meta.resources} />
        <MetaItem icon={ClipboardCheck} value={module.meta.quiz} />
      </dl>

      <div className="flex items-center justify-between gap-4 md:flex-col md:justify-center">
        <CircularProgress value={progress} className="shrink-0" />
        <div className="flex items-center gap-4 md:flex-col md:gap-3">
          <span
            className={clsx(
              'rounded-lg px-4 py-2 text-sm font-extrabold',
              module.status === 'not_started' ? 'bg-ink-100 text-ink-700' : 'bg-solar-50 text-solar-700'
            )}
          >
            {moduleStatusLabels[module.status]}
          </span>
          <Button size="md" variant="ghost" className="h-auto px-2 py-1 text-solar-700" onClick={() => selectModule(module.id)}>
            {module.actionLabel}
          </Button>
        </div>
      </div>
    </article>
  );
}

interface MetaItemProps {
  icon: LucideIcon;
  value: string;
}

function MetaItem({ icon: Icon, value }: MetaItemProps) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-[18px] w-[18px] text-ink-500" aria-hidden="true" />
      <span>{value}</span>
    </div>
  );
}
