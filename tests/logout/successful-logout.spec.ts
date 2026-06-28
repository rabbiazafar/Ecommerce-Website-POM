// spec: specs/logoutuser-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Logout User', () => {
  test('Successful logout after valid login (happy path)', async ({ page }) => {
    // 1. Launch browser & navigate to home
    await page.goto('https://automationexercise.com/');~
    // 2. Click on 'Signup / Login'
    await page.click('a:has-text("Signup / Login")');
    // 3. Verify 'Login to your account' is visible
    await expect(page.locator('text=Login to your account')).toBeVisible();
    // 4. Enter correct email and password and click 'Login'
    await page.fill('input[name="email"]', 'keyir9490@pertok.com');
    await page.fill('input[name="password"]', 'Test@1234');
    await page.click('button:has-text("Login")');
    // 5. Verify 'Logged in as username' is visible
    await expect(page.getByText('Logged in as Test User', { exact: true })).toBeVisible();
  
    // 6. Click 'Logout'
    await page.click('a:has-text("Logout")');
    // 7. Verify that user is navigated to login page
    await expect(page).toHaveURL('https://automationexercise.com/login');
  });
}); 