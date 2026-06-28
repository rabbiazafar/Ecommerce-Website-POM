// spec: specs/logoutuser-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Logout User', () => {
  test('Logout from second tab (concurrency)', async ({ browser }) => {
    // 1. Create two pages in the same context to share session/cookies
    const context = await browser.newContext();
    try {
      const pageA = await context.newPage();
      const pageB = await context.newPage();

      // 2. Log in on Tab A
      await pageA.goto('https://automationexercise.com/', { waitUntil: 'domcontentloaded' });
      await pageA.click('a:has-text("Signup / Login")');
      await pageA.fill('input[name="email"]', 'keyir9490@pertok.com');
      await pageA.fill('input[name="password"]', 'Test@1234');
      await pageA.click('button:has-text("Login")');
      await expect(pageA.getByText('Logged in as Test User', { exact: true })).toBeVisible();

      // 3. Open Tab B and verify user is still logged in
      await pageB.goto('https://automationexercise.com/', { waitUntil: 'domcontentloaded' });
      await expect(pageB.getByText('Logged in as Test User', { exact: true })).toBeVisible();

      // 4. Click 'Logout' in Tab A
      await pageA.click('a:has-text("Logout")');
      await expect(pageA.getByText('Login to your account', { exact: true })).toBeVisible();

      // 5. Reload Tab B and verify session is invalidated globally
      await pageB.reload({ waitUntil: 'domcontentloaded' });
      await expect(pageB.locator('h2').filter({ hasText: 'Full-Fledged practice website for Automation Engineers' }).first()).toBeVisible();
    } finally {
      await context.close();
    }
  });

});
