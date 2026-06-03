import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../../app/App';

function renderAt(path = '/formation') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

describe('TrainingProgramPage', () => {
  it('renders the SolarCell training page title', () => {
    renderAt();
    expect(screen.getByText(/Parcours de/i)).toBeInTheDocument();
    expect(screen.getAllByText(/SolarCell/i).length).toBeGreaterThan(0);
  });

  it('renders the three required training modules', () => {
    renderAt();
    // Each module title appears in the overview panel and on its card.
    expect(screen.getAllByText('Les principes de l’autoconsommation').length).toBeGreaterThan(0);
    expect(screen.getAllByText('L’installation des panneaux solaires').length).toBeGreaterThan(0);
    expect(screen.getAllByText('L’installation du Zendure 4000 Pro').length).toBeGreaterThan(0);
  });

  it('renders learning outcomes and support card', () => {
    renderAt();
    expect(screen.getByText('Certification reconnue')).toBeInTheDocument();
    expect(screen.getByText('Besoin d’aide ?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Nous contacter/i })).toBeInTheDocument();
  });
});
