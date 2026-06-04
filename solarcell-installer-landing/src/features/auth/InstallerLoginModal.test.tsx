import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InstallerLoginModal } from './components/InstallerLoginModal';
import { useAuthModalStore } from './store/useAuthModalStore';

vi.mock('./api/authApi', () => ({
  loginWithEmail: vi.fn().mockResolvedValue({ applicationId: 1, partnerId: 2, identityId: 3 }),
  googleLoginUrl: () => 'http://localhost:8787/api/auth/google',
}));

import { loginWithEmail } from './api/authApi';

describe('InstallerLoginModal', () => {
  beforeEach(() => {
    act(() => useAuthModalStore.setState({ isOpen: false }));
    vi.clearAllMocks();
  });

  it('reste masqué tant que le store est fermé', () => {
    render(<InstallerLoginModal />);
    expect(screen.queryByText('Connexion installateur')).not.toBeInTheDocument();
  });

  it("s'affiche à l'ouverture et envoie les identifiants au BFF", async () => {
    render(<InstallerLoginModal />);
    act(() => useAuthModalStore.getState().open());

    expect(await screen.findByText('Connexion installateur')).toBeInTheDocument();
    expect(screen.getByText('Continuer avec Google ID')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: 'secret123' } });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => expect(loginWithEmail).toHaveBeenCalledWith({ email: 'a@b.com', password: 'secret123' }));
    expect(await screen.findByText(/Connecté/)).toBeInTheDocument();
  });

  it('se ferme avec la touche Échap', async () => {
    render(<InstallerLoginModal />);
    act(() => useAuthModalStore.getState().open());
    expect(await screen.findByText('Connexion installateur')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByText('Connexion installateur')).not.toBeInTheDocument());
  });
});
