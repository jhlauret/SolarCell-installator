import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SolarLandingPage } from './SolarLandingPage';

describe('SolarLandingPage', () => {
  it('renders the primary hero proposition', () => {
    render(
      <MemoryRouter>
        <SolarLandingPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /installez\. contribuez\. gagnez des solarcells\./i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /rejoindre le programme/i })).toBeInTheDocument();
  });

  it('renders the four benefit cards and the impact panel', () => {
    render(
      <MemoryRouter>
        <SolarLandingPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('benefit-strip')).toBeInTheDocument();
    expect(screen.getByText('Gagnez des SolarCells')).toBeInTheDocument();
    expect(screen.getByText('Missions proches de vous')).toBeInTheDocument();
    expect(screen.getByText('Formations incluses')).toBeInTheDocument();
    expect(screen.getByText('Évoluez avec nous')).toBeInTheDocument();
    expect(screen.getByTestId('impact-panel')).toBeInTheDocument();
  });
});
