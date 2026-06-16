import { test as base } from "@playwright/test";

import { HomePage } from "../Pages/HomePage";
import { ProductPage } from "../Pages/ProductPage";
import { CartPage } from "../Pages/CartPage";
import { SignupPage } from "../Pages/SignupPage";
import { CheckoutPage } from "../Pages/CheckoutPage";
import { PaymentPage } from "../Pages/PaymentPage";
import { LoginPage } from "../Pages/LoginPage";
import { ForgotPasswordPage } from "../Pages/ForgotPasswordPage";

type MyFixtures = {
    homePage: HomePage;
    productPage: ProductPage;
    cartPage: CartPage;
    signupPage: SignupPage;
    checkoutPage: CheckoutPage;
    paymentPage: PaymentPage;
    loginPage: LoginPage;
    forgotPasswordPage: ForgotPasswordPage;
};

export const test = base.extend<MyFixtures>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },

    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },

    signupPage: async ({ page }, use) => {
        await use(new SignupPage(page));
    },

    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },

    paymentPage: async ({ page }, use) => {
        await use(new PaymentPage(page));
    },

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    forgotPasswordPage: async ({ page }, use) => {
        await use(new ForgotPasswordPage(page));
    },
});

export { expect } from "@playwright/test";