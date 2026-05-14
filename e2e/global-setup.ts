import { execSync } from "child_process";
import { Client } from "pg";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, ".env.test") });

const TEST_DB_URL = process.env.TEST_DATABASE_URL!;
const SERVER_DIR = path.join(__dirname, "../server");

const CHILD_ENV = {
  ...process.env,
  DATABASE_URL: TEST_DB_URL,
  TRUSTED_ORIGINS: process.env.TRUSTED_ORIGINS ?? "http://localhost:5173",
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  NODE_ENV: "test",
};

function parseDbUrl(rawUrl: string) {
  const url = new URL(rawUrl);
  return {
    host: url.hostname,
    port: parseInt(url.port || "5432"),
    user: url.username,
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
  };
}

async function ensureTestDatabase() {
  const { host, port, user, password, database } = parseDbUrl(TEST_DB_URL);

  const admin = new Client({ host, port, user, password, database: "postgres" });
  await admin.connect();

  const { rowCount } = await admin.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [database]
  );

  if (!rowCount) {
    await admin.query(`CREATE DATABASE "${database}"`);
    console.log(`[setup] Created test database: ${database}`);
  }

  await admin.end();
}

async function truncateAllTables() {
  const conn = parseDbUrl(TEST_DB_URL);
  const client = new Client(conn);
  await client.connect();

  await client.query(
    `TRUNCATE TABLE "session", "account", "verification", "user" CASCADE`
  );

  await client.end();
}

export default async function globalSetup() {
  await ensureTestDatabase();

  execSync("npx prisma migrate deploy", {
    cwd: SERVER_DIR,
    env: CHILD_ENV,
    stdio: "inherit",
  });

  await truncateAllTables();

  execSync("npx tsx prisma/seed-test.ts", {
    cwd: SERVER_DIR,
    env: CHILD_ENV,
    stdio: "inherit",
  });
}
