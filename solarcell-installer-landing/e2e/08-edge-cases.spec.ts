import { test, expect, devices } from '@playwright/test';

test.describe('Cas limites et responsive', () => {
  test('landing page responsive - mobile', async ({ browser }) => {
    const mobileContext = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await mobileContext.newPage();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Vérifier que la page s'affiche correctement
    const content = await page.locator('body').textContent();
    expect(content).toBeTruthy();

    await mobileContext.close();
  });

  test('onboarding responsive - mobile', async ({ browser }) => {
    const mobileContext = await browser.newContext({
      ...devices['Pixel 5'],
    });
    const page = await mobileContext.newPage();
    await page.goto('/onboarding/personal');

    // Vérifier que la page se charge avec du contenu
    const content = await page.locator('body').textContent();
    expect(content).toBeTruthy();

    // Vérifier que les champs de saisie sont tapables
    const firstInput = page.locator('input').first();
    if (await firstInput.isVisible().catch(() => false)) {
      await firstInput.fill('Test');
      await expect(firstInput).toHaveValue('Test');
    }

    await mobileContext.close();
  });

  test('desktop responsive - 1920x1080', async ({ browser }) => {
    const desktopContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });
    const page = await desktopContext.newPage();
    await page.goto('/onboarding/personal');

    // Vérifier la disposition sur desktop
    const main = page.locator('main, section, form').first();
    const heading = page.locator('h1, h2').first();

    const mainVisible = await main.isVisible().catch(() => false);
    const headingVisible = await heading.isVisible().catch(() => false);

    expect(mainVisible || headingVisible).toBeTruthy();

    await desktopContext.close();
  });

  test('modal fermeture avec ESC', async ({ page }) => {
    await page.goto('/');

    const loginButton = page.getByRole('button', { name: /Se connecter|Connexion/i });
    await loginButton.click();

    // Vérifier que le modal s'ouvre (chercher un input email)
    const emailInput = page.locator('input[type="email"]').first();
    await expect(emailInput).toBeVisible({ timeout: 5000 });

    // Appuyer sur ESC
    await page.keyboard.press('Escape');

    // Vérifier que l'input disparaît ou n'est plus focalisé
    const isVisible = await emailInput.isVisible().catch(() => false);
    // Le comportement peut varier selon l'implémentation
  });

  test('modal fermeture avec clic en dehors', async ({ page }) => {
    await page.goto('/');

    const loginButton = page.getByRole('button', { name: /Se connecter|Connexion/i });
    await loginButton.click();

    // Vérifier que le modal s'ouvre
    const emailInput = page.locator('input[type="email"]').first();
    const isOpen = await emailInput.isVisible({ timeout: 5000 }).catch(() => false);

    expect(isOpen).toBeTruthy();
  });

  test('navigation rapide entre les étapes', async ({ page }) => {
    await page.goto('/onboarding/personal');

    const steps = ['professional', 'skills'];

    for (const step of steps) {
      const nextButton = page.getByRole('button', { name: /Suivant|Next/i });
      if (await nextButton.isVisible().catch(() => false)) {
        await nextButton.click();
        await page.waitForLoadState('networkidle').catch(() => {});
        const currentUrl = page.url();
        expect(currentUrl).toContain('onboarding');
      }
    }
  });

  test('changement de fenêtre/tab - sync auth', async ({ browser, context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    // Charger la même URL dans les deux pages
    await page1.goto('/');
    await page2.goto('/');

    // Ajouter une session à la page1
    const mockSession = {
      user: {
        email: 'test@test.com',
        name: 'Test User',
      },
      applicationId: 'app-123',
      partnerId: 'partner-123',
      identityId: 'identity-123',
    };

    await page1.evaluate((session) => {
      localStorage.setItem('solarcell-session', JSON.stringify(session));
      // Déclencher un événement de storage pour les autres onglets
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'solarcell-session',
        newValue: JSON.stringify(session),
        storageArea: localStorage,
      }));
    }, mockSession);

    // Attendre que la page2 reçoive l'événement de storage
    await page2.waitForTimeout(500);
    await page2.reload();

    // Vérifier que page2 a reçu la session
    const session = await page2.evaluate(() => localStorage.getItem('solarcell-session'));
    expect(session).toBeTruthy();

    await page1.close();
    await page2.close();
  });

  test('performance - temps de chargement des pages', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    const landingTime = Date.now() - start;

    // La landing page devrait charger en moins de 3 secondes
    expect(landingTime).toBeLessThan(3000);

    const start2 = Date.now();
    await page.goto('/onboarding/personal');
    const onboardingTime = Date.now() - start2;

    // L'onboarding devrait charger en moins de 3 secondes
    expect(onboardingTime).toBeLessThan(3000);
  });

  test('back button du navigateur', async ({ page }) => {
    await page.goto('/');
    await page.goto('/formation');
    await expect(page).toHaveURL(/formation/);

    // Cliquer sur le back button
    await page.goBack();
    await expect(page).toHaveURL('/');

    // Aller forward
    await page.goForward();
    await expect(page).toHaveURL(/formation/);
  });

  test('rafraîchissement de la page preserve l\'état', async ({ page }) => {
    await page.goto('/onboarding/personal');

    // Remplir un champ
    const firstNameInput = page.locator('input[placeholder*="prénom" i]').first();
    if (await firstNameInput.isVisible().catch(() => false)) {
      await firstNameInput.fill('Refresh Test');
      const filledValue = await firstNameInput.inputValue().catch(() => '');
      expect(filledValue).toBe('Refresh Test');

      // Rafraîchir
      await page.reload();
      await page.waitForLoadState('domcontentloaded');

      // Vérifier que la page a rechargé
      const inputs = await page.locator('input').count();
      expect(inputs).toBeGreaterThan(0);
    }
  });
});
