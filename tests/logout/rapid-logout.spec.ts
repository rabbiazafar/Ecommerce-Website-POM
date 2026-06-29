// spec: specs/logoutuser-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { AuthPage } from '../../Pages/AuthPage';

test.describe('Logout User', () => {
  test('Rapid repeated logout clicks (robustness)', async ({ page }) => {
    // instantiate POM for auth actions
    const auth = new AuthPage(page); // AuthPage wraps login/logout flows

    // navigate to home with tolerant load strategy
    await auth.gotoHome(); // go to https://automationexercise.com/

    // open login page
    await auth.gotoLogin(); // click 'Signup / Login' and wait for login form

    // perform login
    await auth.login('keyir9490@pertok.com', 'Test@1234'); // submit known credentials

    // locator for logout
    const logoutButton = page.getByRole('link', { name: 'Logout' }); // find logout link
    await expect(logoutButton).toBeVisible(); // ensure logout is visible after login

    // click logout repeatedly but stop when already logged out
    for (let i = 0; i < 5; i++) {
      if (await logoutButton.isVisible()) {
        await logoutButton.click(); // perform click
      } else {
        break; // stop if logout no longer exists
      }
    }

    // final verification: login page is visible
    await expect(page.getByText('Login to your account')).toBeVisible(); // login heading present
    await expect(page.getByRole('link', { name: 'Signup / Login' })).toBeVisible(); // signup link shown
  });
});