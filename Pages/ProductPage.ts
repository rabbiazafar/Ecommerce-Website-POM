import { Page } from "@playwright/test";

export class ProductPage {
    constructor(private page: Page) {}

    async addProduct(productId: string) {
        await this.page.locator('//a[@data-product-id="4"]').nth(0).click();
        //await this.page.locator('div:nth-child(4) > .product-image-wrapper > .single-products > .product-overlay').click();
    }

    async viewCart() {
        await this.page.getByText("View Cart").click();
         // await this.page.getByRole('link', { name: 'View Cart' }).click();
    }
}