import { Page } from "@playwright/test";

export class PaymentPage {
    constructor(private page: Page) {}

    async fillPaymentDetails() {
        await this.page.locator('input[name="name_on_card"]').fill("Test User");
        await this.page.locator('input[name="card_number"]').fill("4111111111111111");
        await this.page.locator('input[name="cvc"]').fill("610");
        await this.page.locator('input[name="expiry_month"]').fill("12");
        await this.page.locator('input[name="expiry_year"]').fill("2030");
    }

    async payAndConfirm() {
        await this.page.getByRole("button", { name: "Pay and Confirm Order" }).click();
    }

    async downloadInvoice() {
        const [download] = await Promise.all([
            this.page.waitForEvent("download"),
            this.page.locator('a:has-text("Download Invoice")').click(),
        ]);

        return download;
    }

    async deleteAccount() {
        await this.page.getByRole("link", { name: "Delete Account" }).click();
    }
}