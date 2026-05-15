/**
 * Auth E2E tests — full coverage of authentication flows, validation,
 * role-based access control, navbar state, sign-out, and session persistence.
 *
 * Fixtures:
 *   adminPage — a Page that has already completed login as admin@test.local
 *   agentPage — a Page that has already completed login as agent@test.local
 *   page      — a fresh, unauthenticated Page (standard Playwright fixture)
 *
 * Test users (seeded by global-setup → seed-test.ts):
 *   admin@test.local / Admin1234!  (role: admin, name: "Test Admin")
 *   agent@test.local / Agent1234!  (role: agent, name: "Test Agent")
 */

import { test, expect } from "./fixtures";

// ---------------------------------------------------------------------------
// Unauthenticated access
// ---------------------------------------------------------------------------

test.describe("Unauthenticated access", () => {
  test("redirects / to /login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/login");
  });

  test("redirects /users to /login", async ({ page }) => {
    await page.goto("/users");
    await expect(page).toHaveURL("/login");
  });
});

// ---------------------------------------------------------------------------
// Login — client-side validation (inline errors, no alert role)
// ---------------------------------------------------------------------------

test.describe("Login — client-side validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("shows inline error for empty email and empty password on submit", async ({ page }) => {
    // Submit the form with both fields blank
    await page.getByRole("button", { name: "Sign in" }).click();

    // Inline errors are <span> elements, NOT an alert role — assert text is visible
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();

    // No alert-role element should appear (that is reserved for server errors)
    await expect(page.getByRole("alert")).not.toBeVisible();

    // User stays on the login page
    await expect(page).toHaveURL("/login");
  });

  test("shows inline error for invalid email format", async ({ page }) => {
    await page.fill("#email", "notanemail");
    await page.fill("#password", "SomePassword1!");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Zod: .email() fires after .min(1) passes → "Enter a valid email"
    await expect(page.getByText("Enter a valid email")).toBeVisible();

    // No server alert should appear — this is purely client-side
    await expect(page.getByRole("alert")).not.toBeVisible();
    await expect(page).toHaveURL("/login");
  });

  test("shows inline error for empty password when email is valid", async ({ page }) => {
    await page.fill("#email", "admin@test.local");
    // Leave password blank
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Password is required")).toBeVisible();

    // No email error should appear (email is valid)
    await expect(page.getByText("Email is required")).not.toBeVisible();
    await expect(page.getByText("Enter a valid email")).not.toBeVisible();

    await expect(page.getByRole("alert")).not.toBeVisible();
    await expect(page).toHaveURL("/login");
  });
});

// ---------------------------------------------------------------------------
// Login — server-side errors (shown in <Alert role="alert">)
// ---------------------------------------------------------------------------

test.describe("Login — server-side errors", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("shows alert for wrong password, stays on /login", async ({ page }) => {
    await page.fill("#email", "admin@test.local");
    await page.fill("#password", "wrongpassword");
    await page.click('button[type="submit"]');

    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page).toHaveURL("/login");
  });

  test("shows alert for non-existent email, stays on /login", async ({ page }) => {
    // This email is not seeded in the test database
    await page.fill("#email", "nobody@test.local");
    await page.fill("#password", "SomePassword1!");
    await page.click('button[type="submit"]');

    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page).toHaveURL("/login");
  });
});

// ---------------------------------------------------------------------------
// Login — successful flows
// ---------------------------------------------------------------------------

test.describe("Login — successful authentication", () => {
  test("admin can log in and land on dashboard", async ({ adminPage }) => {
    await expect(adminPage).toHaveURL("/");
    await expect(adminPage.getByText("Test Admin")).toBeVisible();
  });

  test("agent can log in and land on dashboard", async ({ agentPage }) => {
    await expect(agentPage).toHaveURL("/");
    await expect(agentPage.getByText("Test Agent")).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Already-authenticated redirect
// ---------------------------------------------------------------------------

test.describe("Already-authenticated redirect", () => {
  test("authenticated admin navigating to /login is redirected to /", async ({ adminPage }) => {
    // adminPage is already logged in and sitting at /
    await adminPage.goto("/login");

    // LoginPage's useEffect detects an active session and replaces the route
    await expect(adminPage).toHaveURL("/");
  });

  test("authenticated agent navigating to /login is redirected to /", async ({ agentPage }) => {
    await agentPage.goto("/login");
    await expect(agentPage).toHaveURL("/");
  });
});

// ---------------------------------------------------------------------------
// Session persistence
// ---------------------------------------------------------------------------

test.describe("Session persistence", () => {
  test("admin session survives a full page reload", async ({ adminPage }) => {
    // Confirm we start authenticated at /
    await expect(adminPage).toHaveURL("/");

    await adminPage.reload();

    // ProtectedRoute should allow the page to render — no redirect to /login
    await expect(adminPage).toHaveURL("/");
    await expect(adminPage.getByText("Test Admin")).toBeVisible();
  });

  test("agent session survives a full page reload", async ({ agentPage }) => {
    await expect(agentPage).toHaveURL("/");

    await agentPage.reload();

    await expect(agentPage).toHaveURL("/");
    await expect(agentPage.getByText("Test Agent")).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Role-based access control
// ---------------------------------------------------------------------------

test.describe("Role-based access", () => {
  test("admin can access /users and sees the users table", async ({ adminPage }) => {
    await adminPage.goto("/users");
    await expect(adminPage).toHaveURL("/users");
    await expect(adminPage.getByRole("heading", { name: "Users" })).toBeVisible();
    await expect(adminPage.getByText("admin@test.local")).toBeVisible();
  });

  test("agent is redirected from /users to /", async ({ agentPage }) => {
    await agentPage.goto("/users");
    // AdminRoute redirects agents to / without going to /login
    await expect(agentPage).toHaveURL("/");
  });
});

// ---------------------------------------------------------------------------
// Navbar — correct content per role
// ---------------------------------------------------------------------------

test.describe("Navbar", () => {
  test("admin navbar shows Users link", async ({ adminPage }) => {
    await expect(adminPage.getByRole("link", { name: "Users" })).toBeVisible();
  });

  test("agent navbar does not show Users link", async ({ agentPage }) => {
    await expect(agentPage.getByRole("link", { name: "Users" })).not.toBeVisible();
  });

  test("admin navbar shows correct user name", async ({ adminPage }) => {
    // The <span> next to the avatar renders user.name
    await expect(adminPage.getByText("Test Admin")).toBeVisible();
  });

  test("agent navbar shows correct user name", async ({ agentPage }) => {
    await expect(agentPage.getByText("Test Agent")).toBeVisible();
  });

  test("admin navbar avatar shows correct initial", async ({ adminPage }) => {
    // Avatar fallback renders the first character of the user's name
    await expect(adminPage.getByText("T")).toBeVisible();
  });

  test("agent navbar avatar shows correct initial", async ({ agentPage }) => {
    await expect(agentPage.getByText("T")).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Sign out
// ---------------------------------------------------------------------------

test.describe("Sign out", () => {
  test("admin can sign out and is redirected to /login", async ({ adminPage }) => {
    await adminPage.getByRole("button", { name: "Sign out" }).click();
    await expect(adminPage).toHaveURL("/login");
  });

  test("agent can sign out and is redirected to /login", async ({ agentPage }) => {
    await agentPage.getByRole("button", { name: "Sign out" }).click();
    await expect(agentPage).toHaveURL("/login");
  });

  test("after admin signs out, navigating to / redirects to /login", async ({ adminPage }) => {
    await adminPage.getByRole("button", { name: "Sign out" }).click();
    await expect(adminPage).toHaveURL("/login");

    // Session is gone — ProtectedRoute should now redirect back to login
    await adminPage.goto("/");
    await expect(adminPage).toHaveURL("/login");
  });

  test("after agent signs out, navigating to /login stays on /login (no session redirect)", async ({ agentPage }) => {
    await agentPage.getByRole("button", { name: "Sign out" }).click();
    await expect(agentPage).toHaveURL("/login");

    // With no active session, /login must NOT redirect anywhere
    await agentPage.goto("/login");
    await expect(agentPage).toHaveURL("/login");
    await expect(agentPage.getByRole("button", { name: "Sign in" })).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Submit button state
// ---------------------------------------------------------------------------

test.describe("Submit button state", () => {
  test("button reverts to 'Sign in' text after a failed server-side login", async ({ page }) => {
    await page.goto("/login");

    await page.fill("#email", "admin@test.local");
    await page.fill("#password", "wrongpassword");
    await page.click('button[type="submit"]');

    // After the server responds with an error the spinner should be gone and
    // the button label restored so the user can retry
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });
});
