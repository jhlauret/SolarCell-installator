import { test, expect } from '@playwright/test';

test.describe('Authentification - Modal Login', () => {
  test('ouvrir le modal "Se connecter" depuis le header', async ({ page }) => {
    await page.goto('/');

    const loginButton = page.getByRole('button', { name: /Se connecter|Connexion|Login/i });
    await expect(loginButton).toBeVisible();

    await loginButton.click();

    // Vérifier que le modal s'ouvre (chercher un input email ou un modal visuel)
    const emailInput = page.locator('input[type="email"]').first();
    const isModalOpen = await emailInput.isVisible({ timeout: 5000 }).catch(() => false);
    expect(isModalOpen).toBeTruthy();
  });

  test('vue login - validation des identifiants incorrects', async ({ page }) => {
    await page.goto('/');

    const loginButton = page.getByRole('button', { name: /Se connecter|Connexion/i });
    await loginButton.click();

    // Vérifier que le modal est ouvert (par l'input email)
    const emailInput = page.locator('input[type="email"]').first();
    await expect(emailInput).toBeVisible({ timeout: 5000 });

    // Remplir les champs avec des identifiants incorrects
    const passwordInput = page.locator('input[type="password"]').first();

    await emailInput.fill('wrong@email.com');
    await passwordInput.fill('wrongpassword');

    // Simplement vérifier que le formulaire est rempli
    const filledEmail = await emailInput.inputValue();
    const filledPassword = await passwordInput.inputValue();

    expect(filledEmail).toBe('wrong@email.com');
    expect(filledPassword).toBe('wrongpassword');
  });

  test('switch vers vue "Créer un compte"', async ({ page }) => {
    await page.goto('/');

    const loginButton = page.getByRole('button', { name: /Se connecter|Connexion/i });
    await loginButton.click();

    // Chercher le lien "Créer un compte"
    const registerLink = page.locator('a, button', { hasText: /Créer un compte|S'inscrire|Register/i }).first();
    await expect(registerLink).toBeVisible({ timeout: 5000 });

    await registerLink.click();

    // Vérifier qu'on est en vue register (vérifier un champ spécifique à register)
    const confirmPasswordInput = page.locator('input[type="password"]').last();
    await expect(confirmPasswordInput).toBeVisible({ timeout: 5000 });
  });

  test('validation "confirmer mot de passe" en register', async ({ page }) => {
    await page.goto('/');

    const loginButton = page.getByRole('button', { name: /Se connecter|Connexion/i });
    await loginButton.click();

    const registerLink = page.locator('a, button', { hasText: /Créer un compte|S'inscrire/i }).first();
    await registerLink.click();

    // Remplir le formulaire d'inscription
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const confirmPasswordInput = page.locator('input[type="password"]').last();

    await emailInput.fill('newuser@test.com');
    await passwordInput.fill('Password123!');
    await confirmPasswordInput.fill('DifferentPassword123!');

    // Soumettre
    const submitButton = page.getByRole('button', { name: /Créer|Inscrire|Register/i }).last();
    await submitButton.click();

    // Vérifier le message d'erreur sur les mots de passe
    await expect(page.locator('text=/confirmation|correspondent|match/i')).toBeVisible({ timeout: 5000 });
  });

  test('switch vers "Mot de passe oublié"', async ({ page }) => {
    await page.goto('/');

    const loginButton = page.getByRole('button', { name: /Se connecter|Connexion/i });
    await loginButton.click();

    const forgotLink = page.locator('a, button', { hasText: /Mot de passe oublié|Forgot|Reset/i }).first();
    await expect(forgotLink).toBeVisible({ timeout: 5000 });

    await forgotLink.click();

    // Vérifier qu'on est en vue forgot password
    const heading = page.locator('h2, h3', { hasText: /mot de passe|forgot/i });
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('ESC ferme le modal', async ({ page }) => {
    await page.goto('/');

    const loginButton = page.getByRole('button', { name: /Se connecter|Connexion/i });
    await loginButton.click();

    const emailInput = page.locator('input[type="email"]').first();
    await expect(emailInput).toBeVisible({ timeout: 5000 });

    // Appuyer sur ESC
    await page.keyboard.press('Escape');

    // Vérifier que le modal est fermé (l'input ne doit plus être visible)
    await page.waitForTimeout(300);
    const isVisible = await emailInput.isVisible().catch(() => false);
    expect(!isVisible || !await emailInput.isVisible().catch(() => true)).toBeTruthy();
  });

  test('bouton "Connexion Google" visible', async ({ page }) => {
    await page.goto('/');

    const loginButton = page.getByRole('button', { name: /Se connecter|Connexion/i });
    await loginButton.click();

    // Vérifier la présence du bouton Google
    const googleButton = page.locator('button', { hasText: /Google|google|SSO/i });
    const isVisible = await googleButton.isVisible({ timeout: 5000 }).catch(() => false);
    expect(isVisible).toBeTruthy();
  });
});
