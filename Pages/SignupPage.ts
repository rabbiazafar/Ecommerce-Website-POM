import { Page, expect } from "@playwright/test";

export class SignupPage {
    constructor(private page: Page) {}

    async startSignup(name: string, email: string) {
        await this.page.getByPlaceholder("Name").fill(name);
        await this.page.locator("input[data-qa='signup-email']").fill(email);
        await this.page.getByRole("button", { name: "Signup" }).click();
    }

    async fillAccountInfo() {
        await expect(this.page.getByText("ENTER ACCOUNT INFORMATION")).toBeVisible();

        await this.page.getByLabel("Mrs.").check();
        await this.page.getByLabel("Password").fill("Test@1234");

        await this.page.locator("#days").selectOption("21");
        await this.page.locator("#months").selectOption("May");
        await this.page.locator("#years").selectOption("1990");

        await this.page.locator("#newsletter").check();
        await this.page.locator("#optin").check();
    }

    async fillAddress() {
        await this.page.getByLabel("First name").fill("Test");
        await this.page.getByLabel("Last name").fill("User");
        await this.page.locator("#company").fill("Test Company");
        await this.page.getByLabel("Address").first().fill("123 Test Street");

        await this.page.getByLabel("Country").selectOption("United States");
        await this.page.getByLabel("State").fill("California");
        await this.page.locator("#city").fill("Los Angeles");
        await this.page.locator("#zipcode").fill("90001");
        await this.page.getByLabel("Mobile Number").fill("+1234567890");
    }

    async createAccount() {
        await this.page.getByRole("button", { name: "Create Account" }).click();
    }

    async continueAfterSignup() {
        await this.page.getByRole("link", { name: "Continue" }).click();
    }
}