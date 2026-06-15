import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import type { OnboardingStep } from '../types';
import { PersonalStep } from './steps/PersonalStep';
import { ProfessionalStep } from './steps/ProfessionalStep';
import { SkillsStep } from './steps/SkillsStep';
import { DocumentsStep } from './steps/DocumentsStep';
import { TrainingStep } from './steps/TrainingStep';
import { ContractStep } from './steps/ContractStep';
import { WalletStep } from './steps/WalletStep';
import { useSessionStore } from '../../auth/store/useSessionStore';
import { useOnboardingPrefill } from '../hooks/useOnboardingPrefill';
import type { OnboardingPrefillData } from '../api/onboardingApi';

type OnboardingMainProps = {
  currentStep: OnboardingStep;
  previousStep?: OnboardingStep;
  nextStep?: OnboardingStep;
  goNext: () => void;
  goPrevious: () => void;
};

export function OnboardingMain({ currentStep, previousStep, nextStep, goNext, goPrevious }: OnboardingMainProps) {
  const user = useSessionStore((s) => s.user);
  const { prefill } = useOnboardingPrefill(user?.applicationId ?? undefined);

  return (
    <main className="px-5 py-6 sm:px-8 lg:px-[40px] lg:py-[28px]">
      <section className="max-w-[770px]">
        <h1 className="text-[26px] font-black leading-[1.1] tracking-[-0.045em] text-ink-900 sm:text-[30px] lg:text-[36px]">{currentStep.title}</h1>
        <p className="mt-[14px] max-w-[760px] whitespace-pre-line text-[15px] leading-[1.55] text-ink-700">{currentStep.description}</p>
        <div className="mt-[24px]">
          <StepRenderer stepId={currentStep.id} goNext={goNext} prefill={prefill} />
        </div>
        <div className="mt-[28px] flex items-center justify-between">
          <Button size="sm" variant="outline" onClick={goPrevious} disabled={!previousStep} leftIcon={<ArrowLeft size={20} />}>
            Précédent
          </Button>
        </div>
      </section>
    </main>
  );
}

function StepRenderer({ stepId, goNext, prefill }: { stepId: OnboardingStep['id']; goNext: () => void; prefill: OnboardingPrefillData | null }) {
  switch (stepId) {
    case 'personal':
      return <PersonalStep goNext={goNext} initialData={prefill?.personal} />;
    case 'professional':
      return <ProfessionalStep goNext={goNext} initialData={prefill?.professional} />;
    case 'skills':
      return <SkillsStep goNext={goNext} initialData={prefill?.skills} />;
    case 'documents':
      return <DocumentsStep goNext={goNext} />;
    case 'training':
      return <TrainingStep goNext={goNext} />;
    case 'contract':
      return <ContractStep goNext={goNext} />;
    case 'wallet':
      return <WalletStep goNext={goNext} initialData={prefill?.wallet} />;
    default:
      return null;
  }
}
