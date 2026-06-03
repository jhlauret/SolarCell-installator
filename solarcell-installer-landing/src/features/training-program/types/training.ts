import type { LucideIcon } from 'lucide-react';

export type ModuleStatus = 'completed' | 'in_progress' | 'not_started';

export type TrainingModule = {
  id: string;
  courseKey: string;
  route: string;
  label: string;
  title: string;
  description: string;
  progress: number;
  status: ModuleStatus;
  duration: string;
  videos: number;
  resources: number;
  bullets: string[];
  icon: LucideIcon;
};

export type LearningBenefit = {
  title: string;
  description: string;
  icon: LucideIcon;
};
