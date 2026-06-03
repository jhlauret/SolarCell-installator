import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import type { OnboardingStep } from '../types';
import { PersonalStep } from './steps/PersonalStep';
import { ProfessionalStep } from './steps/ProfessionalStep';
import { SkillsStep } from './steps/SkillsStep';
import { DocumentsStep } from './steps/DocumentsStep';
import { TrainingStep } from './steps/TrainingStep';
import { ContractStep } from './steps/ContractStep';
import { WalletStep } from './steps/WalletStep';

type OnboardingMainProps = {
  currentStep: OnboardingStep;
  previousStep?: OnboardingStep;
  nextStep?: OnboardingStep;
  goNext: () => void;
  goPrevious: () => void;
};

export function OnboardingMain({ currentStep, previousStep, nextStep, goNext, goPrevious }: OnboardingMainProps) {
  return (
    <main className="px-[40px] py-[28px]">
      <section className="max-w-[770px]">
        <h1 className="text-[36px] font-black leading-[1.1] tracking-[-0.045em] text-ink-900">{currentStep.title}</h1>
        <p className="mt-[14px] max-w-[760px] whitespace-pre-line text-[15px] leading-[1.55] text-ink-700">{currentStep.description}</p>
        <div className="mt-[24px]">
          <StepRenderer stepId={currentStep.id} />
        </div>
        <div className="mt-[28px] flex items-center justify-between">
          <Button size="sm" variant="outline" onClick={goPrevious} disabled={!previousStep} leftIcon={<ArrowLeft size={20} />}>
            Précédent
          </Button>
          <Button size="sm" onClick={goNext} rightIcon={nextStep ? <ArrowRight size={19} /> : <Check size={20} />}>
            {nextStep ? 'Suivant' : "Terminer l’inscription"}
          </Button>
        </div>
      </section>
    </main>
  );
}

function StepRenderer({ stepId }: { stepId: OnboardingStep['id'] }) {
  switch (stepId) {
    case 'personal':
      return <PersonalStep />;
    case 'professional':
      return <ProfessionalStep />;
    case 'skills':
      return <SkillsStep />;
    case 'documents':
      return <DocumentsStep />;
    case 'training':
      return <TrainingStep />;
    case 'contract':
      return <ContractStep />;
    case 'wallet':
      return <WalletStep />;
    default:
      return null;
  }
}
