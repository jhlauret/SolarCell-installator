import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InstallerLoginModal } from './components/InstallerLoginModal';
import { useAuthModalStore } from './store/useAuthModalStore';
import { useSessionStore } from './store/useSessionStore';

vi.mock('./api/authApi', async () => {
  const actual = await vi.importActual<typeof import('./api/authApi')>('./api/authApi');
  return {
    ...actual,
    loginWithEmail: vi.fn().mockResolvedValue({
      applicationId: 1,
      partnerId: 2,
      identityId: 3,
      user: { email: 'a@b.com', name: 'Jean Test' },
    }),
    googleLoginUrl: () => 'http://localhost:8787/api/auth/google',
  };
});

import { loginWithEmail } from './api/authApi';

describe('InstallerLoginModal', () => {
  beforeEach(() => {
    act(() => {
      useAuthModalStore.setState({ isOpen: false });
      useSessionStore.setState({ user: null });
    });
    vi.clearAllMocks();
  });

  it('reste masqué tant que le store est fermé', () => {
    render(<InstallerLoginModal />);
    expect(screen.queryByText('Connexion installateur')).not.toBeInTheDocument();
  });

  it('connecte, stocke l’utilisateur et ferme le modal', async () => {
    render(<InstallerLoginModal />);
    act(() => useAuthModalStore.getState().open());

    expect(await screen.findByText('Connexion installateur')).toBeInTheDocument();
    expect(screen.getByText('Continuer avec Google ID')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: 'secret123' } });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => expect(loginWithEmail).toHaveBeenCalledWith({ email: 'a@b.com', password: 'secret123' }));
    // Le modal se ferme et l'utilisateur est enregistré dans le store.
    await waitFor(() => expect(screen.queryByText('Connexion installateur')).not.toBeInTheDocument());
    expect(useSessionStore.getState().user).toMatchObject({ email: 'a@b.com', name: 'Jean Test', applicationId: 1 });
  });

  it('se ferme avec la touche Échap', async () => {
    render(<InstallerLoginModal />);
    act(() => useAuthModalStore.getState().open());
    expect(await screen.findByText('Connexion installateur')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByText('Connexion installateur')).not.toBeInTheDocument());
  });
});
