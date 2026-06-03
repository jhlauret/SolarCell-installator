import { create } from 'zustand';

type LandingState = {
  activeSection: string;
  language: 'FR' | 'EN';
  setActiveSection: (section: string) => void;
  setLanguage: (language: 'FR' | 'EN') => void;
};

export const useLandingStore = create<LandingState>((set) => ({
  activeSection: 'Accueil',
  language: 'FR',
  setActiveSection: (section) => set({ activeSection: section }),
  setLanguage: (language) => set({ language }),
}));
