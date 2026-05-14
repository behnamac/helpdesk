import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "e2e/.env.test") });

const TEST_DB_URL = process.env.TEST_DATABASE_URL!;
const AUTH_SECRET = process.env.BETTER_AUTH_SECRET!;

// Use separate ports so tests never conflict with a running dev server
const SERVER_PORT = 3001;
const CLIENT_PORT = 5174;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;
const CLIENT_URL = `http://localhost:${CLIENT_PORT}`;

export default defineConfig({
  testDir: "./e2e",
  // Run serially — tests share the test DB and must not race on state
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }]],
  globalSetup: "./e2e/global-setup.ts",
  globalTeardown: "./e2e/global-teardown.ts",

  use: {
    baseURL: CLIENT_URL,
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: [
    {
      command: "npm run dev --prefix server",
      url: `${SERVER_URL}/api/health`,
      reuseExistingServer: !process.env.CI,
      env: {
        PORT: String(SERVER_PORT),
        DATABASE_URL: TEST_DB_URL,
        BETTER_AUTH_SECRET: AUTH_SECRET,
        BETTER_AUTH_URL: SERVER_URL,
        TRUSTED_ORIGINS: CLIENT_URL,
        NODE_ENV: "test",
      },
    },
    {
      command: "npm run dev --prefix client",
      url: CLIENT_URL,
      reuseExistingServer: !process.env.CI,
      env: {
        PORT: String(CLIENT_PORT),
        API_PROXY_TARGET: SERVER_URL,
      },
    },
  ],
});
