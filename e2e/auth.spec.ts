import { test, expect } from "./fixtures";

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

test.describe("Login", () => {
  test("shows error for wrong password", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "admin@test.local");
    await page.fill("#password", "wrongpassword");
    await page.click('button[type="submit"]');

    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page).toHaveURL("/login");
  });

  test("admin can log in and reach dashboard", async ({ adminPage }) => {
    await expect(adminPage).toHaveURL("/");
    await expect(adminPage.getByText("Test Admin")).toBeVisible();
  });

  test("agent can log in and reach dashboard", async ({ agentPage }) => {
    await expect(agentPage).toHaveURL("/");
    await expect(agentPage.getByText("Test Agent")).toBeVisible();
  });
});

test.describe("Role-based access", () => {
  test("admin can access /users and sees users table", async ({ adminPage }) => {
    await adminPage.goto("/users");
    await expect(adminPage).toHaveURL("/users");
    await expect(adminPage.getByRole("heading", { name: "Users" })).toBeVisible();
    await expect(adminPage.getByText("admin@test.local")).toBeVisible();
  });

  test("admin navbar shows Users link", async ({ adminPage }) => {
    await expect(adminPage.getByRole("link", { name: "Users" })).toBeVisible();
  });

  test("agent is redirected from /users to /", async ({ agentPage }) => {
    await agentPage.goto("/users");
    await expect(agentPage).toHaveURL("/");
  });

  test("agent navbar does not show Users link", async ({ agentPage }) => {
    await expect(agentPage.getByRole("link", { name: "Users" })).not.toBeVisible();
  });
});

test.describe("Sign out", () => {
  test("admin can sign out and is redirected to /login", async ({ adminPage }) => {
    await adminPage.getByRole("button", { name: "Sign out" }).click();
    await expect(adminPage).toHaveURL("/login");
  });
});
