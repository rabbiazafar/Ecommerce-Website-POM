// spec: specs/logoutuser-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Logout User', () => {
  test('Logout button presence only after login', async ({ page }) => {
    // 1. Open home page with a more tolerant load strategy
    await page.goto('https://automationexercise.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    // 2. Verify 'Logout' button is not present before login
    await expect(page.locator('a:has-text("Logout")')).toHaveCount(0);
    // 3. Perform a successful login with valid credentials
    await page.click('a:has-text("Signup / Login")');
    await page.fill('input[name="email"]', 'keyir9490@pertok.com');
    await page.fill('input[name="password"]', 'Test@1234');
    await page.click('button:has-text("Login")');
    // 4. Verify 'Logged in as username' appears and 'Logout' is visible
    await expect(page.getByText('Logged in as Test User', { exact: true })).toBeVisible();
    await expect(page.locator('a:has-text("Logout")')).toBeVisible();
  });
});