# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Unauthenticated access >> redirects / to /login
- Location: e2e/auth.spec.ts:4:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:5174/login"
Received: "http://localhost:5174/"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × unexpected value "http://localhost:5174/"

```

```yaml
- banner:
  - heading "Finance Tracker" [level=1]
  - paragraph: Track your income and expenses
  - button "Switch to dark mode": ☾ Dark
- paragraph: Income
- paragraph: $5,000.00
- paragraph: Balance
- paragraph: $2,630.00
- paragraph: Expenses
- paragraph: $2,370.00
- heading "Add Transaction" [level=2]
- textbox "Description"
- spinbutton
- combobox:
  - option "Income"
  - option "Expense" [selected]
- combobox:
  - option "food" [selected]
  - option "housing"
  - option "utilities"
  - option "transport"
  - option "entertainment"
  - option "salary"
  - option "other"
- button "Add"
- heading "Spending by Category" [level=2]
- application: housing food salary utilities transport entertainment $0 $300 $600 $900 $1200
- heading "Transactions" [level=2]
- combobox:
  - option "All Types" [selected]
  - option "Income"
  - option "Expense"
- combobox:
  - option "All Categories" [selected]
  - option "food"
  - option "housing"
  - option "utilities"
  - option "transport"
  - option "entertainment"
  - option "salary"
  - option "other"
- text: 💼 Salary 2025-01-01 · salary +$5,000.00
- button "Delete transaction": ✕
- text: 🏠 Rent 2025-01-02 · housing −$1,200.00
- button "Delete transaction": ✕
- text: 🍽 Groceries 2025-01-03 · food −$150.00
- button "Delete transaction": ✕
- text: 💼 Freelance Work 2025-01-05 · salary −$800.00
- button "Delete transaction": ✕
- text: ⚡ Electric Bill 2025-01-06 · utilities −$95.00
- button "Delete transaction": ✕
- text: 🍽 Dinner Out 2025-01-07 · food −$65.00
- button "Delete transaction": ✕
- text: 🚗 Gas 2025-01-08 · transport −$45.00
- button "Delete transaction": ✕
- text: 🎬 Netflix 2025-01-10 · entertainment −$15.00
- button "Delete transaction": ✕
```

# Test source

```ts
  1  | import { test, expect } from "./fixtures";
  2  | 
  3  | test.describe("Unauthenticated access", () => {
  4  |   test("redirects / to /login", async ({ page }) => {
  5  |     await page.goto("/");
> 6  |     await expect(page).toHaveURL("/login");
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  7  |   });
  8  | 
  9  |   test("redirects /users to /login", async ({ page }) => {
  10 |     await page.goto("/users");
  11 |     await expect(page).toHaveURL("/login");
  12 |   });
  13 | });
  14 | 
  15 | test.describe("Login", () => {
  16 |   test("shows error for wrong password", async ({ page }) => {
  17 |     await page.goto("/login");
  18 |     await page.fill("#email", "admin@test.local");
  19 |     await page.fill("#password", "wrongpassword");
  20 |     await page.click('button[type="submit"]');
  21 | 
  22 |     await expect(page.getByRole("alert")).toBeVisible();
  23 |     await expect(page).toHaveURL("/login");
  24 |   });
  25 | 
  26 |   test("admin can log in and reach dashboard", async ({ adminPage }) => {
  27 |     await expect(adminPage).toHaveURL("/");
  28 |     await expect(adminPage.getByText("Test Admin")).toBeVisible();
  29 |   });
  30 | 
  31 |   test("agent can log in and reach dashboard", async ({ agentPage }) => {
  32 |     await expect(agentPage).toHaveURL("/");
  33 |     await expect(agentPage.getByText("Test Agent")).toBeVisible();
  34 |   });
  35 | });
  36 | 
  37 | test.describe("Role-based access", () => {
  38 |   test("admin can access /users and sees users table", async ({ adminPage }) => {
  39 |     await adminPage.goto("/users");
  40 |     await expect(adminPage).toHaveURL("/users");
  41 |     await expect(adminPage.getByRole("heading", { name: "Users" })).toBeVisible();
  42 |     await expect(adminPage.getByText("admin@test.local")).toBeVisible();
  43 |   });
  44 | 
  45 |   test("admin navbar shows Users link", async ({ adminPage }) => {
  46 |     await expect(adminPage.getByRole("link", { name: "Users" })).toBeVisible();
  47 |   });
  48 | 
  49 |   test("agent is redirected from /users to /", async ({ agentPage }) => {
  50 |     await agentPage.goto("/users");
  51 |     await expect(agentPage).toHaveURL("/");
  52 |   });
  53 | 
  54 |   test("agent navbar does not show Users link", async ({ agentPage }) => {
  55 |     await expect(agentPage.getByRole("link", { name: "Users" })).not.toBeVisible();
  56 |   });
  57 | });
  58 | 
  59 | test.describe("Sign out", () => {
  60 |   test("admin can sign out and is redirected to /login", async ({ adminPage }) => {
  61 |     await adminPage.getByRole("button", { name: "Sign out" }).click();
  62 |     await expect(adminPage).toHaveURL("/login");
  63 |   });
  64 | });
  65 | 
```