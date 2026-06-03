import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';

export type OnboardingStepId = 'personal' | 'professional' | 'skills' | 'documents' | 'training' | 'contract' | 'wallet';

export type OnboardingStep = {
  id: OnboardingStepId;
  index: number;
  sidebarLabel: string;
  title: string;
  description: string;
  icon: ComponentType<LucideProps>;
};

export type InfoPanel = {
  title: string;
  body: string;
  cta?: string;
  icon: ComponentType<LucideProps>;
  variant?: 'default' | 'warning';
};
