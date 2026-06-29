// spec: specs/logoutuser-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { AuthPage } from '../../Pages/AuthPage';

test.describe('Logout User', () => {
  test('Logout button presence only after login', async ({ page }) => {
    // instantiate POM
    const auth = new AuthPage(page); // POM for auth actions

    // open home page
    await auth.gotoHome(); // navigate to site root

    // verify logout button is not present before login
    await expect(page.locator('a:has-text("Logout")')).toHaveCount(0); // no logout link yet

    // go to login and perform login
    await auth.gotoLogin(); // click Signup / Login
    await auth.login('keyir9490@pertok.com', 'Test@1234'); // submit credentials

    // verify logged-in indicator and logout visibility
    await expect(page.getByText('Logged in as Test User', { exact: true })).toBeVisible(); // username visible
    await expect(page.locator('a:has-text("Logout")')).toBeVisible(); // logout visible
  });
});