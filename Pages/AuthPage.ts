import { Page, expect } from '@playwright/test';

// Page Object Model for authentication-related actions (login/logout/navigation)
export class AuthPage {
  // store the Playwright Page instance
  constructor(private page: Page) {}

  // navigate to the site home page
  async gotoHome() {
    await this.page.goto('https://automationexercise.com/');
  }

  // open the login/signup page
  async gotoLogin() {
    await this.page.click('a:has-text("Signup / Login")');
    // be tolerant: wait for either the login heading or the login form to appear
    try {
      await expect(this.page.locator('text=Login to your account')).toBeVisible({ timeout: 5000 });
    } catch (e) {
      await expect(this.page.locator('form')).toBeVisible({ timeout: 5000 });
    }
  }

  // perform login with provided credentials
  async login(email: string, password: string) {
    // the login form uses non-standard input attributes in some pages; use robust selectors
    const form = this.page.locator('form');
    // fill email using the second input in the form (matches existing LoginPage implementation)
    await form.locator('input').nth(1).fill(email);
    // fill password using placeholder-based locator
    await this.page.getByPlaceholder('Password').fill(password);
    // click the Login button
    await this.page.getByRole('button', { name: 'Login' }).click();
    // wait for a reliable post-login indicator: prefer the logout link, fall back to 'Logged in as' text
    try {
      await expect(this.page.locator('a:has-text("Logout")')).toBeVisible({ timeout: 10000 });
    } catch (e) {
      // if logout link isn't visible, try the 'Logged in as' message
      await expect(this.page.locator('text=Logged in as')).toBeVisible({ timeout: 5000 });
    }
  }

  // perform logout and assert navigation back to login page
  async logout() {
    await this.page.click('a:has-text("Logout")');
    await expect(this.page.locator('text=Login to your account')).toBeVisible();
  }

  // helper: check if logout button is visible
  async isLogoutVisible() {
    return this.page.locator('a:has-text("Logout")').isVisible();
  }

  // helper: check if login page is visible
  async isLoginPageVisible() {
    return this.page.locator('text=Login to your account').isVisible();
  }
}
