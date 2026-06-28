# Logout User Test Plan

## Application Overview

Logout user test plan covering happy path, negative login cases, and edge cases for session/logout behavior on https://automationexercise.com.

## Test Scenarios

### 1. Logout User

**Seed:** `tests/seed.spec.ts`

#### 1.1. Successful logout after valid login (happy path)

**File:** `tests/logout/successful-logout.spec.ts`

**Steps:**
  1. Assumptions: start with a fresh browser session; test account exists (test.user@example.com / Password123!).
    - expect: Fresh browser session; test account credentials available.
  2. Launch browser
    - expect: Browser opens successfully.
  3. Navigate to https://automationexercise.com
    - expect: Home page loads without errors and is visible.
  4. Click on 'Signup / Login'
    - expect: 'Login to your account' section is visible.
  5. Enter correct email and password and click 'Login'
    - expect: Login completes successfully; user sees 'Logged in as username'.
  6. Click 'Logout'
    - expect: User is redirected to the login page.
  7. Attempt to access a protected page (e.g., account/profile) after logout
    - expect: Access is redirected to the login page; session is invalidated.

#### 1.2. Logout button presence only after login

**File:** `tests/logout/button-presence.spec.ts`

**Steps:**
  1. Assumptions: fresh browser session
    - expect: No user is logged in.
  2. Open home page
    - expect: Home page visible.
  3. Verify 'Logout' button is not present before login
    - expect: No visible 'Logout' link/button in header or account menus.
  4. Perform a successful login with valid credentials
    - expect: 'Logged in as username' appears; 'Logout' button is visible.


#### 1.6. Logout after session expiry (session invalidation)

**File:** `tests/logout/session-expiry.spec.ts`

**Steps:**
  1. Assumptions: tester can simulate session expiry (clear cookies / set short session TTL)
    - expect: Method available to simulate session expiration.
  2. Login with valid credentials
    - expect: User is logged in and can access protected pages.
  3. Simulate session expiry (clear auth cookie or wait TTL) and then click 'Logout' or navigate to protected page
    - expect: User is redirected to login page; clicking logout does not produce server errors; protected pages require re-login.

#### 1.7. Logout from second tab (concurrency)

**File:** `tests/logout/multi-tab.spec.ts`

**Steps:**
  1. Assumptions: use two browser tabs/windows in same browser profile
    - expect: Two tabs share same session storage/cookies.
  2. Log in on Tab A
    - expect: Tab A shows 'Logged in as username' and 'Logout' visible.
  3. Open Tab B and navigate to a protected page (still logged in)
    - expect: Tab B shows user as logged in.
  4. Click 'Logout' in Tab A
    - expect: Tab A redirects to login.
  5. On Tab B, attempt any protected action or refresh
    - expect: Tab B is redirected to login or shows logged-out state; session is invalidated globally.

#### 1.8. Cookies disabled (browser privacy edge case)

**File:** `tests/logout/cookies-disabled.spec.ts`

**Steps:**
  1. Assumptions: tester can disable cookies in browser for the site
    - expect: Cookies are disabled for the session.
  2. Attempt to login with valid credentials with cookies disabled
    - expect: Login may fail or not persist; session may not be maintained; no functional 'Logout' flow available.
  3. Verify application behavior is graceful (clear message or fallback)
    - expect: App either prevents login with informative message or handles stateless session gracefully; no uncaught errors.

#### 1.9. Rapid repeated logout clicks (robustness)

**File:** `tests/logout/rapid-logout.spec.ts`

**Steps:**
  1. Login with valid credentials
    - expect: User logged in normally.
  2. Click 'Logout' repeatedly and quickly (multiple times)
    - expect: No JS errors; user lands on login page once; subsequent clicks are harmless or produce no-op; server handles idempotent logout.

#### 1.10. UI and messaging after logout

**File:** `tests/logout/ui-messaging.spec.ts`

**Steps:**
  1. Login and then click 'Logout'
    - expect: Login page displays expected elements (Login form, 'Login to your account'); if application shows a 'Successfully logged out' message, it is correct and readable.
  2. Verify header/menu reflects logged-out state
    - expect: Navigation/header shows 'Signup / Login' and no 'Logged in as' or 'Logout' entries.
