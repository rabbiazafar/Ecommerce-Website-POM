import { Page } from "@playwright/test";

export class CartPage {
    constructor(private page: Page) {}

    async proceedToCheckout() {
        await this.page.getByText("Proceed To Checkout").click();
    }

    async openCart() {
        await this.page.click("a[href='/view_cart']");
      
    }
}