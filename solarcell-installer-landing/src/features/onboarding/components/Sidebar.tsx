import { Check, Headphones } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { clsx } from '../../../shared/ui/clsx';
import type { OnboardingStep, OnboardingStepId } from '../types';

const completedByCurrentIndex = (step: OnboardingStep, currentStep: OnboardingStep) => step.index < currentStep.index;

type SidebarProps = {
  steps: OnboardingStep[];
  currentStep: OnboardingStep;
  onStepClick: (stepId: OnboardingStepId) => void;
};

export function Sidebar({ steps, currentStep, onStepClick }: SidebarProps) {
  const progress = Math.round((currentStep.index / steps.length) * 100);

  return (
    <aside className="border-r border-ink-200 bg-white/82 px-[38px] pb-8 pt-[28px]">
      <div>
        <h2 className="text-[18px] font-black tracking-[-0.02em]">Votre inscription</h2>
        <p className="mt-2 text-[14px] text-ink-700">Étape {currentStep.index} sur 7</p>
        <ProgressBar value={progress} className="mt-[14px] w-[235px]" />
      </div>

      <ol className="mt-[40px] space-y-0">
        {steps.map((step, index) => {
          const isCurrent = step.id === currentStep.id;
          const isComplete = completedByCurrentIndex(step, currentStep);
          return (
            <li key={step.id} className="relative">
              {index !== steps.length - 1 && (
                <span
                  className={clsx(
                    'absolute left-[15px] top-[31px] h-[45px] w-[2px]',
                    isComplete ? 'bg-solar-500' : 'bg-ink-200'
                  )}
                />
              )}
              <button
                className={clsx(
                  'group relative flex min-h-[60px] w-full items-center gap-[16px] rounded-[9px] px-[14px] text-left text-[14px] transition',
                  isCurrent ? 'bg-greenSoft font-extrabold text-ink-900' : 'font-medium text-ink-700 hover:bg-solar-50'
                )}
                onClick={() => onStepClick(step.id)}
              >
                <span
                  className={clsx(
                    'relative z-10 grid h-[31px] w-[31px] shrink-0 place-items-center rounded-full border text-[13px] font-extrabold',
                    isComplete || isCurrent ? 'border-solar-500 bg-solar-500 text-white' : 'border-ink-300 bg-white text-ink-800'
                  )}
                >
                  {isComplete ? <Check size={16} strokeWidth={3} /> : step.index}
                </span>
                <span className="whitespace-pre-line leading-[1.45]">{step.sidebarLabel}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-[64px] rounded-[9px] border border-ink-200 bg-white p-[20px] shadow-card">
        <div className="flex items-start gap-4">
          <Headphones className="mt-1 text-solar-600" size={30} />
          <div>
            <p className="text-[16px] font-black">Besoin d’aide ?</p>
            <p className="mt-3 text-[14px] leading-[1.62] text-ink-700">Notre équipe est là pour vous accompagner.</p>
          </div>
        </div>
        <Button size="sm" className="mt-[24px] w-[142px]" type="button">
          Nous contacter
        </Button>
      </div>
    </aside>
  );
}
