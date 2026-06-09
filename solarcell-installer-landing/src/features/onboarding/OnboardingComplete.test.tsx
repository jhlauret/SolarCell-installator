import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { OnboardingComplete } from './pages/OnboardingComplete';
import { useSessionStore } from '../auth/store/useSessionStore';
import { useOnboardingStore } from './store/onboardingStore';

vi.mock('./api/onboardingApi', async () => {
  const actual = await vi.importActual<typeof import('./api/onboardingApi')>('./api/onboardingApi');
  return {
    ...actual,
    finalizeOnboarding: vi.fn().mockResolvedValue({ ok: true, status: 'submitted' }),
  };
});

import { finalizeOnboarding } from './api/onboardingApi';

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/onboarding/termine']}>
      <OnboardingComplete />
    </MemoryRouter>,
  );
}

describe('OnboardingComplete', () => {
  beforeEach(() => {
    act(() => {
      useSessionStore.setState({ user: null });
      useOnboardingStore.setState({ completedSteps: [] });
    });
    vi.clearAllMocks();
  });

  it('affiche la confirmation et finalise le dossier quand un applicationId existe', async () => {
    act(() => {
      useSessionStore.setState({
        user: { applicationId: 42, partnerId: 2, identityId: 3, email: 'a@b.com' },
      });
      useOnboardingStore.setState({
        completedSteps: ['personal', 'professional', 'skills', 'documents', 'training', 'contract', 'wallet'],
      });
    });

    renderPage();

    expect(await screen.findByText('Inscription terminée !')).toBeInTheDocument();
    await waitFor(() => expect(finalizeOnboarding).toHaveBeenCalledWith(42));
    expect(screen.getByText('7/7 étapes complétées')).toBeInTheDocument();
  });

  it('redirige (n’affiche pas la confirmation) sans applicationId', () => {
    renderPage();
    expect(screen.queryByText('Inscription terminée !')).not.toBeInTheDocument();
    expect(finalizeOnboarding).not.toHaveBeenCalled();
  });
});
