import { test as base, type Page } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, ".env.test") });

const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL ?? "admin@test.local";
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? "Admin1234!";
const AGENT_EMAIL = process.env.TEST_AGENT_EMAIL ?? "agent@test.local";
const AGENT_PASSWORD = process.env.TEST_AGENT_PASSWORD ?? "Agent1234!";

async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click('button[type="submit"]');
  await page.waitForURL("/");
}

type AuthFixtures = {
  adminPage: Page;
  agentPage: Page;
};

export const test = base.extend<AuthFixtures>({
  adminPage: async ({ page }, use) => {
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await use(page);
  },
  agentPage: async ({ page }, use) => {
    await login(page, AGENT_EMAIL, AGENT_PASSWORD);
    await use(page);
  },
});

export { expect } from "@playwright/test";
