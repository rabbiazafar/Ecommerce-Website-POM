import { Page, expect } from "@playwright/test";

export class CheckoutPage {
    constructor(private page: Page) {}

    async verifyCheckoutPage() {
        await expect(this.page.getByText("Address Details")).toBeVisible();
        await expect(this.page.getByText("Review Your Order")).toBeVisible();
    }

    async verifyAddress() {
        await expect(this.page.getByText("Your delivery address")).toBeVisible();
        await expect(this.page.getByText("Your billing address")).toBeVisible();

        await expect(this.page.locator('li').filter({ hasText: 'Mrs. Test User' }).first()).toBeVisible();
        await expect(this.page.locator('li').filter({ hasText: 'Test Company' }).first()).toBeVisible();
        await expect(this.page.locator('li').filter({ hasText: '123 Test Street' }).first()).toBeVisible();
    }

    async verifyProduct() {
        await expect(this.page.locator('a[href="/product_details/4"]')).toBeVisible();
        await expect(this.page.getByText('Women > Dress')).toBeVisible();
        await expect(this.page.getByRole('button', { name: '1' })).toBeVisible();
    }

    async addComment(comment: string) {
        await this.page.locator('textarea[name="message"]').fill(comment);
    }

    async placeOrder() {
        await this.page.getByText("Place Order").click();
    }
}