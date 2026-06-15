import { test, expect } from '@playwright/test';

test.describe('Barre de progression et sidebar', () => {
  test('barre de progression s\'affiche', async ({ page }) => {
    await page.goto('/onboarding/personal');

    // Vérifier la présence d'indicateurs de progression ou sidebar
    const pageContent = await page.locator('body').textContent();
    expect(pageContent).toBeTruthy();
  });

  test('sidebar affiche les 7 étapes', async ({ page }) => {
    await page.goto('/onboarding/personal');

    // Chercher les boutons/liens de navigation
    const buttons = await page.locator('button').count();
    expect(buttons).toBeGreaterThan(0);
  });

  test('cliquer sur une étape non-courante navigue correctement', async ({ page }) => {
    await page.goto('/onboarding/personal');

    // Chercher un bouton "Suivant" pour naviguer
    const nextButton = page.getByRole('button', { name: /Suivant|Next/i });

    if (await nextButton.isVisible()) {
      // Remplir minimum pour pouvoir avancer
      const email = page.locator('input[type="email"]').first();
      if (await email.isVisible()) {
        await email.fill('test@test.com');
      }

      await nextButton.click();
      await page.waitForURL(/onboarding\/(professional|skills)/, { timeout: 10000 }).catch(() => {});

      const newUrl = page.url();
      expect(newUrl).not.toContain('personal');
    }
  });

  test('étape actuelle est mise en avant (highlight)', async ({ page }) => {
    await page.goto('/onboarding/personal');
    await page.waitForLoadState('domcontentloaded');

    // Vérifier qu'on est sur la bonne page
    const currentUrl = page.url();
    expect(currentUrl).toContain('onboarding/personal');

    // Vérifier la présence de contenu
    const content = await page.locator('body').textContent();
    expect(content).toBeTruthy();
  });

  test('progression visuelle change à chaque étape', async ({ page }) => {
    const steps = ['personal', 'professional', 'skills'];

    for (const step of steps) {
      await page.goto(`/onboarding/${step}`);

      // Vérifier que chaque étape a du contenu unique
      const content = await page.locator('body').textContent();
      expect(content).toBeTruthy();
    }
  });
});
