import { Page } from "@playwright/test";

export class HomePage {
    constructor(private page: Page) {}

    async goto() {
        await this.page.goto("https://automationexercise.com/");
    }

    async openProducts() {
        await this.page.click("a[href='/products']");
    }

    async openLogin() {
        await this.page.getByText("Signup / Login").click();
    }

    async openSignup() {
        await this.page.getByText("Signup / Login").click();
    }
}