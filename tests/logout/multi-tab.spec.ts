// spec: specs/logoutuser-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { AuthPage } from '../../Pages/AuthPage';

test.describe('Logout User', () => {
  test('Logout from second tab (concurrency)', async ({ browser }) => {
    // create a shared browser context so pages share cookies/session
    const context = await browser.newContext(); // new browser context
    try {
      // open two pages (tabs) in same context
      const pageA = await context.newPage(); // first tab
      const pageB = await context.newPage(); // second tab

      // create POM instances for both pages
      const authA = new AuthPage(pageA); // auth actions on tab A
      const authB = new AuthPage(pageB); // auth actions on tab B

      // login on Tab A
      await authA.gotoHome(); // navigate to home from tab A
      await authA.gotoLogin(); // open login page on tab A
      await authA.login('keyir9490@pertok.com', 'Test@1234'); // authenticate on tab A

      // verify Tab B sees the logged-in state
      await authB.gotoHome(); // navigate to home on tab B
      await expect(pageB.getByText('Logged in as Test User', { exact: true })).toBeVisible(); // ensure logged-in indicator

      // logout from Tab A
      await authA.logout(); // click logout on tab A and wait for login page

      // reload Tab B and verify the session is invalidated
      await pageB.reload(); // refresh tab B
      await pageB.waitForLoadState('domcontentloaded'); // wait for DOM to be ready
      // assert that the signup/login entry point is shown (covers either login page or header state)
      await expect(pageB.getByRole('link', { name: 'Signup / Login' })).toBeVisible(); // tab B should show signup/login
    } finally {
      // close context if still open; ignore errors if it's already disposed
      try {
        await context.close(); // attempt to close the browser context
      } catch (e) {
        // ignore errors from closing an already-disposed context
        console.warn('context.close() threw:', e);
      }
    }
  });

});
