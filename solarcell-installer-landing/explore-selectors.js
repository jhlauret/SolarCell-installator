import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/brave-browser'
  });
  const page = await browser.newPage();

  console.log('=== Landing Page (/). ===');
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');

  // Trouver les principaux éléments
  const header = await page.locator('header').first();
  console.log('✓ Header found:', await header.isVisible());

  const buttons = await page.locator('button').count();
  console.log('✓ Buttons count:', buttons);

  const loginBtn = await page.locator('button:has-text("Se connecter"), button:has-text("Connexion"), button:has-text("Login")').first();
  console.log('✓ Login button found:', await loginBtn.isVisible().catch(() => false));

  // Formation page
  console.log('\n=== Formation Page (/formation) ===');
  await page.goto('http://localhost:5173/formation');
  await page.waitForLoadState('networkidle');

  const h1 = await page.locator('h1').count();
  console.log('✓ H1 count:', h1);

  const cards = await page.locator('[class*="card"]').count();
  console.log('✓ Card elements count:', cards);

  // Onboarding page
  console.log('\n=== Onboarding Page (/onboarding/personal) ===');
  await page.goto('http://localhost:5173/onboarding/personal');
  await page.waitForLoadState('networkidle');

  const form = await page.locator('form').first();
  console.log('✓ Form found:', await form.isVisible().catch(() => false));

  const inputs = await page.locator('input').count();
  console.log('✓ Input count:', inputs);

  const sidebar = await page.locator('[class*="sidebar"]').first();
  console.log('✓ Sidebar found:', await sidebar.isVisible().catch(() => false));

  // Class names
  console.log('\n=== Class names found ===');
  const allElements = await page.locator('*').all();
  const classes = new Set();
  for (let i = 0; i < Math.min(100, allElements.length); i++) {
    const className = await allElements[i].getAttribute('class');
    if (className) classes.add(className);
  }
  Array.from(classes).slice(0, 20).forEach(c => console.log('  -', c));

  await browser.close();
})();
