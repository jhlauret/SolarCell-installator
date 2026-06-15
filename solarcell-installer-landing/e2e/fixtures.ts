import { test as base, Page } from '@playwright/test';

export type TestFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<TestFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Note: In real tests, we'd use test credentials or mock the auth response
    // For now, this is a placeholder for authenticated tests
    await use(page);
  },
});

export { expect } from '@playwright/test';
