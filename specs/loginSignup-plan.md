# Login and Signup Test Plan

## Overview
This test plan covers the login, signup, and forgot password functionality for the e-commerce site using Page Object Model (POM) style tests. Each scenario includes the POM methods, expected page actions, and validation points.

## Scope
- Automate login and signup flow using POM
- Validate positive, negative, and edge cases for login and signup
- Validate forgot password recovery flow
- Confirm navigation and cross-flow behavior between login and signup pages

## POM Classes Used
- `HomePage`
- `SignupPage`
- `LoginPage` (expected to support login actions)
- `AccountPage` (optional validation page for authenticated state)

## Test Data
- Valid user: `testuser@example.com` / `Test@1234`
- New user email: generated unique value
- Invalid email formats: `user@invalid`, `plainaddress`, `user@.com`
- Invalid password: `wrongpass`, empty string
- Weak password: `12345`, `password`, `abc`

## Test Cases

### 1. Sign In Page

#### Test Case 1.1: Successful sign in
- Setup: `homePage.goto()`
- Action: `homePage.openLogin()` or click `Register / Login`
- Action: `loginPage.login(validEmail, validPassword)`
- Expect: `expect(page.getByText("Logged in as")).toBeVisible()`
- Expect: `expect(page).toHaveURL(/account|dashboard|\/account/)`

#### Test Case 1.2: Sign in with invalid password
- Setup: open login page
- Action: `loginPage.login(validEmail, 'WrongPass123')`
- Expect: `expect(page.getByText("Your email or password is incorrect")).toBeVisible()`
- Expect: user remains on login page

#### Test Case 1.3: Sign in with unregistered email
- Setup: open login page
- Action: `loginPage.login('no-user@example.com', 'AnyPassword123')`
- Expect: `expect(page.getByText("User not found")).toBeVisible()` or invalid credentials message
- Expect: no login success indicator

#### Test Case 1.4: Sign in with empty fields
- Setup: open login page
- Action: `loginPage.login('', '')`
- Expect: validation messages for email and password required fields
- Expect: login submission is blocked

#### Test Case 1.5: Sign in with invalid email format
- Setup: open login page
- Action: `loginPage.login('plainaddress', validPassword)`
- Expect: validation message about invalid email format
- Expect: login not accepted

#### Test Case 1.6: Password field privacy check
- Setup: open login page
- Action: enter password in password field
- Expect: password field type is `password`
- Expect: characters are masked in the form

### 2. Sign Up Page

#### Test Case 2.1: Successful sign up
- Setup: `homePage.goto()`
- Action: `homePage.openLogin()` and `signupPage.startSignup('Test User', uniqueEmail)`
- Action: `signupPage.fillAccountInfo()`
- Action: `signupPage.fillAddress()`
- Action: `signupPage.createAccount()`
- Expect: `expect(page.locator('b:has-text("ACCOUNT CREATED!")')).toBeVisible()`
- Action: `signupPage.continueAfterSignup()`
- Expect: `expect(page.getByText('Logged in as Test User')).toBeVisible()`

#### Test Case 2.2: Sign up with existing email
- Setup: open signup page
- Action: `signupPage.startSignup('Test User', existingEmail)`
- Expect: error message about email already in use or account existing
- Expect: account registration is not completed

#### Test Case 2.3: Sign up with missing required fields
- Setup: open signup page
- Action: submit signup with empty name or email
- Expect: required field validations appear for empty fields
- Expect: registration is blocked

#### Test Case 2.4: Sign up with invalid email format
- Setup: open signup page
- Action: `signupPage.startSignup('Test User', 'invalid-email')`
- Expect: email format validation error
- Expect: signup form submission does not proceed

#### Test Case 2.5: Sign up with weak password
- Setup: open signup page
- Action: begin signup and fill account info with password `12345`
- Expect: guidance or validation for weak password
- Expect: account creation blocked if password policy exists

#### Test Case 2.6: Sign up edge cases for field lengths
- Setup: open signup page
- Action: fill signup fields with long values in name, address, and email local part
- Expect: the site handles long input gracefully or returns length-limit validation
- Expect: page does not crash or error unexpectedly

#### Test Case 2.7: Sign up with special characters
- Setup: open signup page
- Action: use valid special characters in name and password
- Expect: signup succeeds or proper validation indicates disallowed characters

### 3. Forgot Password Page

#### Test Case 3.1: Successful forgot password request
- Setup: `homePage.goto()` and open login page
- Action: `loginPage.openForgotPassword()` or click the forgot password link
- Action: `forgotPasswordPage.resetPassword(validEmail)`
- Expect: confirmation message that reset instructions were sent

#### Test Case 3.2: Forgot password with unregistered email
- Setup: open forgot password page
- Action: `forgotPasswordPage.resetPassword('unknown@example.com')`
- Expect: error or neutral message that does not expose account existence
- Expect: privacy-preserving response

#### Test Case 3.3: Forgot password with invalid email format
- Setup: open forgot password page
- Action: `forgotPasswordPage.resetPassword('invalid-email')`
- Expect: invalid email format validation message
- Expect: request is blocked

#### Test Case 3.4: Forgot password with empty email field
- Setup: open forgot password page
- Action: submit blank email
- Expect: required field validation message
- Expect: no reset request is submitted

### 4. Cross-Flow and Edge Cases

#### Test Case 4.1: Navigation between login and signup pages
- Setup: open home page
- Action: navigate to login page
- Action: follow signup link from login page
- Expect: signup page is displayed
- Action: navigate back to login page from signup page if available

#### Test Case 4.2: Session persistence after sign up
- Setup: complete successful sign up
- Action: refresh the page or reopen the site
- Expect: user remains signed in if persistent session is supported
- Expect: or the site requires sign in again based on expected behavior

#### Test Case 4.3: Account lockout / throttling behavior
- Setup: open login page
- Action: attempt sign in repeatedly with wrong password
- Expect: account lockout or throttling message after repeated failures
- Expect: further attempts are limited as expected

#### Test Case 4.4: Sign up and sign in with browser autofill
- Setup: open login or signup page
- Action: use browser autofill to populate fields
- Expect: fields are populated correctly
- Action: submit the form
- Expect: sign in or sign up can complete successfully with autofill

## Implementation Notes
- Use `fixtures/testFixtures.ts` to inject POM instances and `Hooks/testHook.ts` for shared setup.
- Add a `LoginPage` class if needed to encapsulate login actions and selectors.
- Consider adding `ForgotPasswordPage` and `AccountPage` classes for reusable validations.
- Maintain unique test data for signup tests to avoid conflicts.
- Use `expect(page).toHaveURL(...)` and text assertions for reliable outcome checks.
