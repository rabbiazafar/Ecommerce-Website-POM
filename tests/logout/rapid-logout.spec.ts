// spec: specs/logoutuser-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Logout User', () => {
  test('Rapid repeated logout clicks (robustness)', async ({ page }) => {
    // 1. Login with valid credentials
    await page.goto('https://automationexercise.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.getByRole('link', { name: 'Signup / Login' }).click();
    await page.fill('input[name="email"]', 'keyir9490@pertok.com');
    await page.fill('input[name="password"]', 'Test@1234');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Logged in as Test User', { exact: false })).toBeVisible();
    const logoutButton = page.getByRole('link', { name: 'Logout' });
    await expect(logoutButton).toBeVisible();

    // 2. Click 'Logout' multiple times, but stop once logged out
    for (let i = 0; i < 5; i++) {
      if (await logoutButton.isVisible()) {
        await logoutButton.click();
      } else {
        break;
      }
    }

    // 3. Verify user lands on login page
    await expect(page.getByText('Login to your account')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Signup / Login' })).toBeVisible();
  });
});