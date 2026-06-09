import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '../types';

/**
 * Source de vérité « connecté ou non ». Persisté dans le localStorage afin que
 * la session survive à un rechargement de page. `clear()` est appelé à la
 * déconnexion : zustand/persist purge automatiquement l'entrée localStorage.
 */
type SessionState = {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clear: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clear: () => set({ user: null }),
    }),
    { name: 'solarcell-session' },
  ),
);
