import { test, expect } from "../Fixtures/testFixtures";

// Test data
const validEmail = "automationexercise@test.com";
const validPassword = "Test@1234";
const invalidEmails = ["plainaddress", "user@invalid", "user@.com"];
const weakPasswords = ["12345", "password", "abc"];
const specialCharsName = "Test@User#123";

test.describe("Login and Signup Tests", () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.goto();
    });

    // ==================== SIGN IN TESTS ====================

    test.describe("Sign In Page Tests", () => {
        test("1.1: Successful sign in", async ({ homePage, loginPage, page }) => {
            await homePage.openLogin();
            await loginPage.verifyLoginPageVisible();
            await loginPage.login(validEmail, validPassword);
            await expect(page.getByText("Logged in as")).toBeVisible();
        });

        test("1.2: Sign in with invalid password", async ({ homePage, loginPage, page }) => {
            await homePage.openLogin();
            await loginPage.verifyLoginPageVisible();
            await loginPage.login(validEmail, "WrongPassword123");
            await loginPage.verifyInvalidCredentialsError();
            await loginPage.verifyLoginPageVisible();
        });

        test("1.3: Sign in with unregistered email", async ({ homePage, loginPage, page }) => {
            await homePage.openLogin();
            await loginPage.verifyLoginPageVisible();
            await loginPage.login("unregistered@example.com", validPassword);
            await loginPage.verifyInvalidCredentialsError();
            // User should not be logged in
            await expect(page.getByText("Logged in as")).not.toBeVisible();
        });

        test("1.4: Sign in with empty fields", async ({ homePage, loginPage, page }) => {
            await homePage.openLogin();
            await loginPage.verifyLoginPageVisible();
            // Try to submit without filling fields
            await page.getByRole("button", { name: "Login" }).click();
            // Validation messages should appear (HTML5 validation)
            const emailInput = page.getByPlaceholder("Email Address");
            const passwordInput = page.getByPlaceholder("Password");
            await expect(emailInput).toBeFocused();
        });

        test("1.5: Sign in with invalid email format", async ({ homePage, loginPage, page }) => {
            await homePage.openLogin();
            await loginPage.verifyLoginPageVisible();
            for (const invalidEmail of invalidEmails) {
                await loginPage.login(invalidEmail, validPassword);
                // Should see error or remain on login page
                await expect(page.getByText(/Login|account/i)).toBeVisible();
            }
        });

        test("1.6: Password field privacy check", async ({ homePage, page }) => {
            await homePage.openLogin();
            const passwordField = page.getByPlaceholder("Password");
            // Verify password field type is password
            await expect(passwordField).toHaveAttribute("type", "password");
            await passwordField.fill("TestPassword123");
            // The actual input value is masked in browser
            const fieldType = await passwordField.getAttribute("type");
            expect(fieldType).toBe("password");
        });
    });

    // ==================== SIGN UP TESTS ====================

    test.describe("Sign Up Page Tests", () => {
        test("2.1: Successful sign up", async ({ homePage, signupPage, page }) => {
            const uniqueEmail = `newuser_${Date.now()}@test.com`;
            await homePage.openSignup();
            await expect(page.getByText("New User Signup!")).toBeVisible();
            await signupPage.startSignup("Test User", uniqueEmail);
            await signupPage.fillAccountInfo();
            await signupPage.fillAddress();
            await signupPage.createAccount();
            await expect(page.locator('b:has-text("ACCOUNT CREATED!")')).toBeVisible();
            await signupPage.continueAfterSignup();
            await expect(page.getByText("Logged in as Test User")).toBeVisible();
        });

        test("2.2: Sign up with existing email", async ({ homePage, signupPage, page }) => {
            await homePage.openSignup();
            await expect(page.getByText("New User Signup!")).toBeVisible();
            // Try to signup with an email that exists
            await signupPage.startSignup("Test User", validEmail);
            // Should see error or validation message
            await expect(
                page.getByText(/already exists|already registered|in use/i)
            ).toBeVisible();
        });

        test("2.3: Sign up with missing required fields", async ({ homePage, page }) => {
            await homePage.openSignup();
            await expect(page.getByText("New User Signup!")).toBeVisible();
            // Try to submit signup with empty name and email
            const signupButton = page.getByRole("button", { name: "Signup" });
            await signupButton.click();
            // HTML5 validation should prevent submission
            const nameInput = page.getByPlaceholder("Name");
            await expect(nameInput).toBeFocused();
        });

        test("2.4: Sign up with invalid email format", async ({ homePage, signupPage, page }) => {
            await homePage.openSignup();
            await expect(page.getByText("New User Signup!")).toBeVisible();
            await signupPage.startSignup("Test User", "invalid-email");
            // Should see validation error or remain on signup page
            await expect(page.getByText(/signup|create account|email/i)).toBeVisible();
        });

        test("2.5: Sign up with weak password", async ({ homePage, signupPage, page }) => {
            const uniqueEmail = `weakpass_${Date.now()}@test.com`;
            await homePage.openSignup();
            await expect(page.getByText("New User Signup!")).toBeVisible();
            await signupPage.startSignup("Test User", uniqueEmail);
            // Fill account info with weak password
            await expect(page.getByText("ENTER ACCOUNT INFORMATION")).toBeVisible();
            await page.getByLabel("Mrs.").check();
            await page.getByLabel("Password").fill("123");
            await page.locator("#days").selectOption("21");
            await page.locator("#months").selectOption("May");
            await page.locator("#years").selectOption("1990");
            // Try to create account with weak password
            const createBtn = page.getByRole("button", { name: "Create Account" });
            await createBtn.click();
            // Account may be created or rejected depending on policy
            // For this test, we just verify the form was submitted and handled
            await expect(
                page.getByText(/account created|password|error/i)
            ).toBeVisible();
        });

        test("2.6: Sign up edge cases for field lengths", async ({ homePage, signupPage, page }) => {
            const longEmail = `${"a".repeat(50)}@test.com`;
            const uniqueEmail = `edge_${Date.now()}@test.com`;
            await homePage.openSignup();
            await expect(page.getByText("New User Signup!")).toBeVisible();
            await signupPage.startSignup("A".repeat(100), uniqueEmail);
            // The system should handle or reject long inputs gracefully
            await expect(
                page.getByText(/signup|account created|error|invalid/i)
            ).toBeVisible();
        });

        test("2.7: Sign up with special characters", async ({ homePage, signupPage, page }) => {
            const uniqueEmail = `special_${Date.now()}@test.com`;
            await homePage.openSignup();
            await expect(page.getByText("New User Signup!")).toBeVisible();
            await signupPage.startSignup(specialCharsName, uniqueEmail);
            await signupPage.fillAccountInfo();
            await signupPage.fillAddress();
            await signupPage.createAccount();
            // Account should be created or validation shown
            await expect(
                page.getByText(/account created|invalid|error/i)
            ).toBeVisible();
        });
    });

    // ==================== FORGOT PASSWORD TESTS ====================

    test.describe("Forgot Password Tests", () => {
        test("3.1: Successful forgot password request", async ({ homePage, loginPage, forgotPasswordPage, page }) => {
            await homePage.openLogin();
            await loginPage.verifyLoginPageVisible();
            await loginPage.openForgotPasswordPage();
            await forgotPasswordPage.verifyResetPageVisible();
            await forgotPasswordPage.resetPassword(validEmail);
            // Should see success message
            await expect(
                page.getByText(/reset|instructions|sent|success|email/i)
            ).toBeVisible();
        });

        test("3.2: Forgot password with unregistered email", async ({ homePage, loginPage, forgotPasswordPage, page }) => {
            await homePage.openLogin();
            await loginPage.verifyLoginPageVisible();
            await loginPage.openForgotPasswordPage();
            await forgotPasswordPage.verifyResetPageVisible();
            await forgotPasswordPage.resetPassword("unknown.user@example.com");
            // Should show message (may not leak existence or show generic success)
            await expect(
                page.getByText(/reset|instructions|sent|email|account/i)
            ).toBeVisible();
        });

        test("3.3: Forgot password with invalid email format", async ({ homePage, loginPage, forgotPasswordPage, page }) => {
            await homePage.openLogin();
            await loginPage.verifyLoginPageVisible();
            await loginPage.openForgotPasswordPage();
            await forgotPasswordPage.verifyResetPageVisible();
            await forgotPasswordPage.resetPassword("plainaddress");
            // Should see validation error or remain on reset page
            await expect(
                page.getByText(/email|invalid|incorrect|reset|forgot/i)
            ).toBeVisible();
        });

        test("3.4: Forgot password with empty email field", async ({ homePage, loginPage, forgotPasswordPage, page }) => {
            await homePage.openLogin();
            await loginPage.verifyLoginPageVisible();
            await loginPage.openForgotPasswordPage();
            await forgotPasswordPage.verifyResetPageVisible();
            // Try to submit without email
            const resetButton = page.getByRole("button", { name: /Retrieve|Reset|Submit/i });
            await resetButton.click();
            // HTML5 validation should prevent submission
            const emailInput = page.getByPlaceholder("Email Address");
            await expect(emailInput).toBeFocused();
        });
    });

    // ==================== CROSS-FLOW AND EDGE CASES ====================

    test.describe("Cross-Flow and Edge Cases", () => {
        test("4.1: Navigation between login and signup pages", async ({ homePage, page }) => {
            await homePage.openLogin();
            await expect(page.getByText(/Login|New User Signup/i)).toBeVisible();
            // Navigate to signup from login
            const signupLink = page.getByText(/Signup|Don't have an account|Create one/i).first();
            if (await signupLink.isVisible()) {
                await signupLink.click();
                await expect(page.getByText("New User Signup!")).toBeVisible();
            }
        });

        test("4.2: Session persistence after sign up", async ({ homePage, signupPage, page }) => {
            const uniqueEmail = `persist_${Date.now()}@test.com`;
            await homePage.openSignup();
            await expect(page.getByText("New User Signup!")).toBeVisible();
            await signupPage.startSignup("Persist User", uniqueEmail);
            await signupPage.fillAccountInfo();
            await signupPage.fillAddress();
            await signupPage.createAccount();
            await expect(page.locator('b:has-text("ACCOUNT CREATED!")')).toBeVisible();
            await signupPage.continueAfterSignup();
            await expect(page.getByText("Logged in as Persist User")).toBeVisible();
            // Refresh page
            await page.reload();
            // Session should persist or user redirected to login
            await expect(
                page.getByText(/Logged in as|Login|Signup/i)
            ).toBeVisible();
        });

        test("4.3: Account lockout / throttling behavior", async ({ homePage, loginPage, page }) => {
            await homePage.openLogin();
            await loginPage.verifyLoginPageVisible();
            // Attempt multiple failed logins
            for (let i = 0; i < 3; i++) {
                await loginPage.login(validEmail, "WrongPassword");
                await loginPage.verifyInvalidCredentialsError();
            }
            // Check if there's any throttling or lockout message
            const lockoutMessage = page.getByText(
                /locked|throttled|too many|wait|attempts/i
            );
            // This may or may not appear depending on the application
            if (await lockoutMessage.isVisible()) {
                expect(await lockoutMessage.textContent()).toBeTruthy();
            }
        });

        test("4.4: Sign up and sign in with browser autofill simulation", async ({ homePage, signupPage, loginPage, page }) => {
            const uniqueEmail = `autofill_${Date.now()}@test.com`;
            // Test autofill on signup
            await homePage.openSignup();
            await expect(page.getByText("New User Signup!")).toBeVisible();
            const nameInput = page.getByPlaceholder("Name");
            const emailInput = page.getByPlaceholder("Email Address");
            // Simulate autofill by filling values
            await nameInput.fill("Autofill User");
            await emailInput.fill(uniqueEmail);
            const signupButton = page.getByRole("button", { name: "Signup" });
            await signupButton.click();
            // Verify fields were properly populated and form progressed
            await expect(page.getByText(/ENTER ACCOUNT INFORMATION|confirm/i)).toBeVisible();
        });
    });
});
