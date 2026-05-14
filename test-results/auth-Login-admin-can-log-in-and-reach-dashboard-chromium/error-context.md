# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Login >> admin can log in and reach dashboard
- Location: e2e/auth.spec.ts:26:7

# Error details

```
Test timeout of 30000ms exceeded while setting up "adminPage".
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#email')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e5]:
        - heading "Finance Tracker" [level=1] [ref=e6]
        - paragraph [ref=e7]: Track your income and expenses
      - button "Switch to dark mode" [ref=e8] [cursor=pointer]: ☾ Dark
    - generic [ref=e9]:
      - generic [ref=e10]:
        - paragraph [ref=e11]: Income
        - paragraph [ref=e12]: $5,000.00
      - generic [ref=e13]:
        - paragraph [ref=e14]: Balance
        - paragraph [ref=e15]: $2,630.00
      - generic [ref=e16]:
        - paragraph [ref=e17]: Expenses
        - paragraph [ref=e18]: $2,370.00
    - generic [ref=e19]:
      - heading "Add Transaction" [level=2] [ref=e20]
      - generic [ref=e21]:
        - textbox "Description" [ref=e22]
        - spinbutton [ref=e23]
        - combobox [ref=e24]:
          - option "Income"
          - option "Expense" [selected]
        - combobox [ref=e25]:
          - option "food" [selected]
          - option "housing"
          - option "utilities"
          - option "transport"
          - option "entertainment"
          - option "salary"
          - option "other"
        - button "Add" [ref=e26] [cursor=pointer]
    - generic [ref=e27]:
      - heading "Spending by Category" [level=2] [ref=e28]
      - application [ref=e31]:
        - generic [ref=e54]:
          - generic [ref=e55]:
            - generic [ref=e57]: housing
            - generic [ref=e59]: food
            - generic [ref=e61]: salary
            - generic [ref=e63]: utilities
            - generic [ref=e65]: transport
            - generic [ref=e67]: entertainment
          - generic [ref=e68]:
            - generic [ref=e70]: $0
            - generic [ref=e72]: $300
            - generic [ref=e74]: $600
            - generic [ref=e76]: $900
            - generic [ref=e78]: $1200
    - generic [ref=e79]:
      - generic [ref=e80]:
        - heading "Transactions" [level=2] [ref=e81]
        - generic [ref=e82]:
          - combobox [ref=e83] [cursor=pointer]:
            - option "All Types" [selected]
            - option "Income"
            - option "Expense"
          - combobox [ref=e84] [cursor=pointer]:
            - option "All Categories" [selected]
            - option "food"
            - option "housing"
            - option "utilities"
            - option "transport"
            - option "entertainment"
            - option "salary"
            - option "other"
      - generic [ref=e85]:
        - generic [ref=e86]:
          - generic [ref=e87]: 💼
          - generic [ref=e88]:
            - generic [ref=e89]: Salary
            - generic [ref=e90]: 2025-01-01 · salary
          - generic [ref=e91]: +$5,000.00
          - button "Delete transaction" [ref=e92] [cursor=pointer]: ✕
        - generic [ref=e93]:
          - generic [ref=e94]: 🏠
          - generic [ref=e95]:
            - generic [ref=e96]: Rent
            - generic [ref=e97]: 2025-01-02 · housing
          - generic [ref=e98]: −$1,200.00
          - button "Delete transaction" [ref=e99] [cursor=pointer]: ✕
        - generic [ref=e100]:
          - generic [ref=e101]: 🍽
          - generic [ref=e102]:
            - generic [ref=e103]: Groceries
            - generic [ref=e104]: 2025-01-03 · food
          - generic [ref=e105]: −$150.00
          - button "Delete transaction" [ref=e106] [cursor=pointer]: ✕
        - generic [ref=e107]:
          - generic [ref=e108]: 💼
          - generic [ref=e109]:
            - generic [ref=e110]: Freelance Work
            - generic [ref=e111]: 2025-01-05 · salary
          - generic [ref=e112]: −$800.00
          - button "Delete transaction" [ref=e113] [cursor=pointer]: ✕
        - generic [ref=e114]:
          - generic [ref=e115]: ⚡
          - generic [ref=e116]:
            - generic [ref=e117]: Electric Bill
            - generic [ref=e118]: 2025-01-06 · utilities
          - generic [ref=e119]: −$95.00
          - button "Delete transaction" [ref=e120] [cursor=pointer]: ✕
        - generic [ref=e121]:
          - generic [ref=e122]: 🍽
          - generic [ref=e123]:
            - generic [ref=e124]: Dinner Out
            - generic [ref=e125]: 2025-01-07 · food
          - generic [ref=e126]: −$65.00
          - button "Delete transaction" [ref=e127] [cursor=pointer]: ✕
        - generic [ref=e128]:
          - generic [ref=e129]: 🚗
          - generic [ref=e130]:
            - generic [ref=e131]: Gas
            - generic [ref=e132]: 2025-01-08 · transport
          - generic [ref=e133]: −$45.00
          - button "Delete transaction" [ref=e134] [cursor=pointer]: ✕
        - generic [ref=e135]:
          - generic [ref=e136]: 🎬
          - generic [ref=e137]:
            - generic [ref=e138]: Netflix
            - generic [ref=e139]: 2025-01-10 · entertainment
          - generic [ref=e140]: −$15.00
          - button "Delete transaction" [ref=e141] [cursor=pointer]: ✕
  - generic [ref=e142]: $0
```

# Test source

```ts
  1  | import { test as base, type Page } from "@playwright/test";
  2  | import dotenv from "dotenv";
  3  | import path from "path";
  4  | 
  5  | dotenv.config({ path: path.join(__dirname, ".env.test") });
  6  | 
  7  | const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL ?? "admin@test.local";
  8  | const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? "Admin1234!";
  9  | const AGENT_EMAIL = process.env.TEST_AGENT_EMAIL ?? "agent@test.local";
  10 | const AGENT_PASSWORD = process.env.TEST_AGENT_PASSWORD ?? "Agent1234!";
  11 | 
  12 | async function login(page: Page, email: string, password: string) {
  13 |   await page.goto("/login");
> 14 |   await page.fill("#email", email);
     |              ^ Error: page.fill: Test timeout of 30000ms exceeded.
  15 |   await page.fill("#password", password);
  16 |   await page.click('button[type="submit"]');
  17 |   await page.waitForURL("/");
  18 | }
  19 | 
  20 | type AuthFixtures = {
  21 |   adminPage: Page;
  22 |   agentPage: Page;
  23 | };
  24 | 
  25 | export const test = base.extend<AuthFixtures>({
  26 |   adminPage: async ({ page }, use) => {
  27 |     await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
  28 |     await use(page);
  29 |   },
  30 |   agentPage: async ({ page }, use) => {
  31 |     await login(page, AGENT_EMAIL, AGENT_PASSWORD);
  32 |     await use(page);
  33 |   },
  34 | });
  35 | 
  36 | export { expect } from "@playwright/test";
  37 | 
```