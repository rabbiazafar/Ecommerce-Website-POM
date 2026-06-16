import { test } from "../Fixtures/testFixtures";

export const setupTest = test.beforeEach(async ({ page }) => {
    await page.goto("https://automationexercise.com/");
});

export const teardownTest = test.afterEach(async ({ page }) => {
    // optional cleanup
    // console.log("Test finished:", await page.title());
});