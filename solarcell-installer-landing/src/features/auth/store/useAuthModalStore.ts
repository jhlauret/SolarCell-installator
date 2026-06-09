import { create } from 'zustand';

/**
 * État du modal de connexion installateur. Volontairement minimal : le bouton
 * « Se connecter » du SiteHeader appelle `open()`, le modal appelle `close()`.
 */
type AuthModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
