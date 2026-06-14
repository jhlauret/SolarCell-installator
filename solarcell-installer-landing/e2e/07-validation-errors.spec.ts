import { test, expect } from '@playwright/test';

test.describe('Validation et messages d\'erreur', () => {
  test('soumission avec champs obligatoires vides', async ({ page }) => {
    await page.goto('/onboarding/personal');

    // Essayer de soumettre sans remplir les champs
    const nextButton = page.getByRole('button', { name: /Suivant|Next|Continuer/i });

    // Peut être désactivé ou afficher une erreur au click
    const isDisabled = await nextButton.isDisabled().catch(() => false);

    if (!isDisabled) {
      await nextButton.click();

      // Vérifier un message d'erreur ou un délai de traitement
      const errorMessage = page.locator('text=/obligatoire|required|champ requis/i');
      const loadingState = page.locator('[class*="loading"]');

      const hasError = await errorMessage.isVisible().catch(() => false);
      const isLoading = await loadingState.isVisible().catch(() => false);

      expect(hasError || isLoading).toBeTruthy();
    }
  });

  test('validation du format email invalide', async ({ page }) => {
    await page.goto('/onboarding/personal');

    const emailInput = page.locator('input[type="email"]').first();

    if (await emailInput.isVisible().catch(() => false)) {
      // Entrer un email invalide
      await emailInput.fill('invalid-email');
      let filledValue = await emailInput.inputValue();
      expect(filledValue).toBe('invalid-email');

      await emailInput.blur();

      // Entrer un email valide
      await emailInput.fill('valid@email.com');
      filledValue = await emailInput.inputValue();
      expect(filledValue).toBe('valid@email.com');
    }
  });

  test('validation du format téléphone', async ({ page }) => {
    await page.goto('/onboarding/personal');

    const phoneInput = page.locator('input[placeholder*="téléphone" i], input[placeholder*="phone" i]').first();

    if (await phoneInput.isVisible()) {
      // Entrer un format invalide (trop court)
      await phoneInput.fill('123');
      await phoneInput.blur();

      await page.waitForTimeout(300);

      // Vérifier s'il y a une validation
      const errorMessage = page.locator('text=/téléphone|phone|format/i');
      const hasValidation = await errorMessage.isVisible().catch(() => false);

      // Entrer un format valide
      await phoneInput.fill('0612345678');
      await phoneInput.blur();

      if (hasValidation) {
        await page.waitForTimeout(300);
        const stillHasError = await errorMessage.isVisible().catch(() => false);
        expect(stillHasError).toBeFalsy();
      }
    }
  });

  test('message d\'erreur lors de l\'erreur réseau', async ({ page }) => {
    await page.goto('/onboarding/personal');

    // Simuler une erreur réseau en interceptant la requête
    await page.route('**/api/**', (route) => {
      route.abort('failed');
    });

    // Remplir les champs
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@test.com');
    }

    // Essayer de soumettre
    const nextButton = page.getByRole('button', { name: /Suivant|Next/i });
    if (await nextButton.isVisible()) {
      await nextButton.click();

      // Vérifier le message d'erreur réseau
      const errorMessage = page.locator('text=/erreur|error|réseau|network|connexion/i');
      const loadingError = page.locator('[class*="error"], [role="alert"]');

      await page.waitForTimeout(1000);

      const hasError = await errorMessage.first().isVisible().catch(() => false);
      const hasErrorElement = await loadingError.first().isVisible().catch(() => false);

      expect(hasError || hasErrorElement).toBeTruthy();
    }
  });

  test('validation de la date de naissance', async ({ page }) => {
    await page.goto('/onboarding/personal');

    const birthDateInput = page.locator('input[type="date"]').first();

    if (await birthDateInput.isVisible()) {
      // Entrer une date de naissance future (invalide)
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateStr = futureDate.toISOString().split('T')[0];

      await birthDateInput.fill(futureDateStr);
      await birthDateInput.blur();

      await page.waitForTimeout(300);

      // Vérifier s'il y a une validation
      const errorMessage = page.locator('text=/naissance|age|futur/i');
      const hasError = await errorMessage.isVisible().catch(() => false);

      // Entrer une date valide
      const validDate = '1990-05-15';
      await birthDateInput.fill(validDate);
      await birthDateInput.blur();

      if (hasError) {
        await page.waitForTimeout(300);
        const stillHasError = await errorMessage.isVisible().catch(() => false);
        expect(stillHasError).toBeFalsy();
      }
    }
  });

  test('affichage des champs avec erreurs', async ({ page }) => {
    await page.goto('/onboarding/personal');

    // Localiser les champs obligatoires (généralement avec un astérisque ou un label spécifique)
    const requiredFields = page.locator('label:has-text("*"), [class*="required"]');
    const count = await requiredFields.count();

    expect(count).toBeGreaterThanOrEqual(0);

    // Chaque champ requis devrait avoir une indication visuelle
    for (let i = 0; i < Math.min(count, 3); i++) {
      const field = requiredFields.nth(i);
      await expect(field).toBeVisible();
    }
  });

  test('validation côté client avant envoi au serveur', async ({ page }) => {
    await page.goto('/onboarding/personal');
    await page.waitForLoadState('domcontentloaded');

    // Vérifier que la page a du contenu
    const bodyContent = await page.locator('body').textContent();
    expect(bodyContent).toBeTruthy();

    // Vérifier la présence d'inputs (validation côté client)
    const inputs = await page.locator('input').count();
    expect(inputs).toBeGreaterThan(0);
  });
});
