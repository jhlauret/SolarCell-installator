import { create } from 'zustand';
import { trainingModules } from '../data/trainingProgramData';

type TrainingProgressState = {
  progressByModule: Record<string, number>;
  openCourse: (courseKey: string) => void;
};

const initialProgress = Object.fromEntries(trainingModules.map((module) => [module.courseKey, module.progress]));

export const useTrainingProgressStore = create<TrainingProgressState>(() => ({
  progressByModule: initialProgress,
  openCourse: (courseKey) => {
    // À remplacer par l'appel réel BFF : POST /api/learning/open
    // Le store garde ici une trace locale utile pour la démo et les tests.
    console.info(`[SolarCell] Open Odoo Learning course: ${courseKey}`);
  }
}));
