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

  it('navigates through the 7-step flow with the next button', async () => {
    const user = userEvent.setup();
    renderAt();
    await user.click(screen.getByRole('button', { name: /suivant/i }));
    expect(screen.getByRole('heading', { name: 'Informations professionnelles' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /suivant/i }));
    expect(screen.getByRole('heading', { name: 'Compétences' })).toBeInTheDocument();
  });

  it('renders the wallet completion call to action on step 7', () => {
    renderAt('/onboarding/wallet');
    expect(screen.getByRole('heading', { name: 'Wallet SolarCell' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /terminer l’inscription/i })).toBeInTheDocument();
  });
});
