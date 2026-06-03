import { create } from 'zustand';
import { trainingModules } from '../data/trainingProgramData';

interface TrainingProgressState {
  selectedModuleId: string;
  progressByModule: Record<string, number>;
  selectModule: (moduleId: string) => void;
  updateProgress: (moduleId: string, progress: number) => void;
}

export const useTrainingProgressStore = create<TrainingProgressState>((set) => ({
  selectedModuleId: trainingModules[1]?.id ?? trainingModules[0].id,
  progressByModule: Object.fromEntries(trainingModules.map((module) => [module.id, module.progress])),
  selectModule: (moduleId) => set({ selectedModuleId: moduleId }),
  updateProgress: (moduleId, progress) =>
    set((state) => ({
      progressByModule: {
        ...state.progressByModule,
        [moduleId]: Math.max(0, Math.min(progress, 100))
      }
    }))
}));
