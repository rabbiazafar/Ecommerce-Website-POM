// spec: specs/logoutuser-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { AuthPage } from '../../Pages/AuthPage';

test.describe('Logout User', () => {
  test('Successful logout after valid login (happy path)', async ({ page }) => {
    // create AuthPage POM instance for this test
    const auth = new AuthPage(page); // instantiate POM with the playwright page

    // navigate to the home page
    await auth.gotoHome(); // go to https://automationexercise.com/

    // open the login page
    await auth.gotoLogin(); // click 'Signup / Login' and wait for login heading

    // perform login with valid credentials
    await auth.login('keyir9490@pertok.com', 'Test@1234'); // fill form and submit

    // perform logout via POM
    await auth.logout(); // click logout and wait for login page

    // assert we're back on the login page
    await expect(page).toHaveURL('https://automationexercise.com/login'); // final URL check
  });
});