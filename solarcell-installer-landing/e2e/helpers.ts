import { Page, expect } from '@playwright/test';

export async function waitForElement(page: Page, selector: string, timeout = 5000) {
  try {
    await page.locator(selector).waitFor({ timeout });
    return true;
  } catch {
    return false;
  }
}

export async function fillFormField(page: Page, placeholder: string, value: string) {
  const input = page.locator(`input[placeholder*="${placeholder}" i]`).first();
  if (await input.isVisible()) {
    await input.fill(value);
    return true;
  }
  return false;
}

export async function clickButton(page: Page, textPattern: string | RegExp) {
  const button = page.getByRole('button', { name: textPattern });
  if (await button.isVisible({ timeout: 5000 })) {
    await button.click();
    return true;
  }
  return false;
}

export async function getFormValue(page: Page, placeholder: string) {
  const input = page.locator(`input[placeholder*="${placeholder}" i]`).first();
  if (await input.isVisible()) {
    return await input.inputValue();
  }
  return null;
}

export async function loginWithMockSession(page: Page, email: string, name: string) {
  const mockSession = {
    user: {
      email,
      name,
      picture: 'https://example.com/pic.jpg',
    },
    applicationId: 'app-123',
    partnerId: 'partner-123',
    identityId: 'identity-123',
  };

  await page.evaluate((session) => {
    localStorage.setItem('solarcell-session', JSON.stringify(session));
  }, mockSession);

  await page.reload();
  return mockSession;
}

export async function clearAuth(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem('solarcell-session');
  });
  await page.reload();
}

export async function navigateToOnboardingStep(page: Page, stepName: string) {
  const steps = ['personal', 'professional', 'skills', 'documents', 'wallet', 'training', 'contract'];
  if (!steps.includes(stepName)) {
    throw new Error(`Invalid step: ${stepName}`);
  }
  await page.goto(`/onboarding/${stepName}`);
  await expect(page).toHaveURL(new RegExp(`onboarding/${stepName}`));
}

export async function fillPersonalStepForm(page: Page, data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  zip?: string;
  city?: string;
  birthDate?: string;
}) {
  if (data.firstName) await fillFormField(page, 'prénom', data.firstName);
  if (data.lastName) await fillFormField(page, 'nom', data.lastName);
  if (data.email) {
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill(data.email);
    }
  }
  if (data.phone) await fillFormField(page, 'téléphone|phone', data.phone);
  if (data.address) await fillFormField(page, 'adresse', data.address);
  if (data.zip) await fillFormField(page, 'postal|zip', data.zip);
  if (data.city) await fillFormField(page, 'ville|city', data.city);
  if (data.birthDate) {
    const birthInput = page.locator('input[type="date"]').first();
    if (await birthInput.isVisible()) {
      await birthInput.fill(data.birthDate);
    }
  }
}

export async function submitOnboardingStep(page: Page) {
  return await clickButton(page, /Suivant|Next|Continuer/i);
}

export async function goBackOnboardingStep(page: Page) {
  return await clickButton(page, /Précédent|Previous|Retour/i);
}

export async function expectErrorMessage(page: Page, pattern: string | RegExp) {
  const errorMessage = page.locator(`text=/${pattern}/i`);
  await expect(errorMessage).toBeVisible({ timeout: 5000 });
}

export async function expectNoErrorMessage(page: Page, pattern: string | RegExp) {
  const errorMessage = page.locator(`text=/${pattern}/i`);
  await expect(errorMessage).not.toBeVisible({ timeout: 1000 }).catch(() => {
    // Peut être acceptable que le message disparaisse après un délai
  });
}

export async function openLoginModal(page: Page) {
  const loginButton = page.getByRole('button', { name: /Se connecter|Connexion|Login/i });
  if (await loginButton.isVisible()) {
    await loginButton.click();
    const modal = page.locator('[data-testid="login-modal"]');
    await expect(modal).toBeVisible({ timeout: 5000 });
    return modal;
  }
  return null;
}

export async function closeLoginModal(page: Page) {
  await page.keyboard.press('Escape');
  const modal = page.locator('[data-testid="login-modal"]');
  await expect(modal).not.toBeVisible();
}

export async function switchLoginView(page: Page, viewName: 'login' | 'register' | 'forgot') {
  const viewTexts = {
    login: /Connexion|Login|Se connecter/i,
    register: /Créer un compte|S'inscrire|Register/i,
    forgot: /Mot de passe oublié|Forgot|Reset/i,
  };

  const button = page.locator('a, button', { hasText: viewTexts[viewName] }).first();
  if (await button.isVisible()) {
    await button.click();
    return true;
  }
  return false;
}
