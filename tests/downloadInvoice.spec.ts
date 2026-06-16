import { test, expect } from "@playwright/test";
import { HomePage } from "../Pages/HomePage";
import { ProductPage } from "../Pages/ProductPage";
import { CartPage } from "../Pages/CartPage";
import { SignupPage } from "../Pages/SignupPage";
import { CheckoutPage } from "../Pages/CheckoutPage";
import { PaymentPage } from "../Pages/PaymentPage";
test("Download Invoice after purchase order - POM", async ({ page }) => {
    test.setTimeout(90000);

    const email = `user_${Math.random().toString(36).slice(2, 10)}@test.com`;

    const home = new HomePage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);
    const signup = new SignupPage(page);
    const checkout = new CheckoutPage(page);
    const payment = new PaymentPage(page);

    // Home
    await home.goto();
    await expect(page).toHaveURL("https://automationexercise.com/");

    await home.openProducts();

    // Product
    await product.addProduct("4");
    await product.viewCart();

    // Cart
    await cart.proceedToCheckout();

    await page.getByText("Register / Login", { exact: true }).click();
    await expect(page.getByText("New User Signup!")).toBeVisible();

    // Signup
    await signup.startSignup("Test User", email);
    await signup.fillAccountInfo();
    await signup.fillAddress();
    await signup.createAccount();

    await expect(page.locator('b:has-text("ACCOUNT CREATED!")')).toBeVisible();

    await signup.continueAfterSignup();
    await expect(page.getByText("Logged in as Test User")).toBeVisible();

    // Cart again
    await cart.openCart();
    await cart.proceedToCheckout();

    // Checkout validations
    await checkout.verifyCheckoutPage();
    await checkout.verifyAddress();
    await checkout.verifyProduct();
    await checkout.addComment("Please deliver between 9 AM to 5 PM");
    await checkout.placeOrder();

    // Payment
    await payment.fillPaymentDetails();
    await payment.payAndConfirm();

    // Invoice download
    const download = await payment.downloadInvoice();
    expect(download).toBeTruthy();

    await payment.deleteAccount();
    await expect(page.getByText("ACCOUNT DELETED!")).toBeVisible();
});