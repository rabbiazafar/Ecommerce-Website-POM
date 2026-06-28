import { Page, expect } from "@playwright/test";

export class LoginPage {
    constructor(private page: Page) {}

    async login(email: string, password: string) {
        //await this.page.getByPlaceholder("Email Address").fill(email);
        await this.page.locator('form').locator('input').nth(1).fill(email);
        await this.page.getByPlaceholder("Password").fill(password);
        await this.page.getByRole("button", { name: "Login" }).click();
    }

    async openForgotPasswordPage() {
        await this.page.getByText("Forgot password?").click();
    }

    async verifyLoginPageVisible() {
        //await expect(this.page.getByText("Login to your account")).toBeVisible();
        await expect(this.page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
    }

    async verifyErrorMessage(message: string) {
        await expect(this.page.locator(`text=${message}`)).toBeVisible();
    }

    async verifyInvalidCredentialsError() {
        await expect(
            this.page.locator('text=Your email or password is incorrect!')
        ).toBeVisible();
    }
}
