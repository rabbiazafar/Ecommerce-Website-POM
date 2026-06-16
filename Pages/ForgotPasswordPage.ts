import { Page, expect } from "@playwright/test";

export class ForgotPasswordPage {
    constructor(private page: Page) {}

    async resetPassword(email: string) {
        await this.page.getByPlaceholder("Email Address").fill(email);
        await this.page.getByRole("button", { name: "Retrieve Password" }).click();
    }

    async verifyResetPageVisible() {
        await expect(
            this.page.getByText(/Forgot Password|Enter your email/i)
        ).toBeVisible();
    }

    async verifySuccessMessage() {
        await expect(
            this.page.getByText(/reset|instructions|sent/i)
        ).toBeVisible();
    }

    async verifyErrorMessage(message: string) {
        await expect(this.page.locator(`text=${message}`)).toBeVisible();
    }

    async verifyInvalidEmailError() {
        await expect(
            this.page.getByText(/email|invalid|incorrect/i)
        ).toBeVisible();
    }
}
