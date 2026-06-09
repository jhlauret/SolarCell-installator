import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../../../app/App';

function renderAt(path = '/onboarding/personal') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

describe('SolarCell onboarding', () => {
  it('renders the personal information step by default', () => {
    renderAt();
    expect(screen.getByRole('heading', { name: 'Informations personnelles' })).toBeInTheDocument();
    expect(screen.getByText('Étape 1 sur 7')).toBeInTheDocument();
  });

  it('renders the save-and-continue button on the personal step', () => {
    renderAt();
    expect(screen.getByRole('button', { name: /sauvegarder et continuer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /précédent/i })).toBeDisabled();
  });

  it('renders the wallet activation button on step 7', () => {
    renderAt('/onboarding/wallet');
    expect(screen.getByRole('heading', { name: 'Wallet SolarCell' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /activer mon wallet/i })).toBeInTheDocument();
  });
});
