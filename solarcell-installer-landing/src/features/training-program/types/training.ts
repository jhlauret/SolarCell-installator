import type { LucideIcon } from 'lucide-react';

export type ModuleStatus = 'completed' | 'in_progress' | 'not_started';

export interface TrainingStat {
  label: string;
  value: string;
  icon: LucideIcon;
}

export interface TrainingModuleMeta {
  duration: string;
  videos: string;
  resources: string;
  quiz: string;
}

export interface TrainingModule {
  id: string;
  order: number;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  bullets: string[];
  meta: TrainingModuleMeta;
  progress: number;
  status: ModuleStatus;
  actionLabel: string;
}

export interface LearningOutcome {
  title: string;
  description: string;
  icon: LucideIcon;
}
