import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { auth } from "../src/lib/auth.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const TEST_USERS = [
  {
    name: "Test Admin",
    email: process.env.TEST_ADMIN_EMAIL ?? "admin@test.local",
    password: process.env.TEST_ADMIN_PASSWORD ?? "Admin1234!",
    role: "admin",
  },
  {
    name: "Test Agent",
    email: process.env.TEST_AGENT_EMAIL ?? "agent@test.local",
    password: process.env.TEST_AGENT_PASSWORD ?? "Agent1234!",
    role: "agent",
  },
];

async function seedTest() {
  const ctx = await auth.$context;

  for (const { name, email, password, role } of TEST_USERS) {
    const hashedPassword = await ctx.password.hash(password);

    const user = await prisma.user.upsert({
      where: { email },
      create: { id: crypto.randomUUID(), name, email, emailVerified: true, role },
      update: { role, emailVerified: true },
    });

    const existing = await prisma.account.findFirst({
      where: { userId: user.id, providerId: "credential" },
    });

    if (!existing) {
      await prisma.account.create({
        data: {
          id: crypto.randomUUID(),
          accountId: user.id,
          providerId: "credential",
          userId: user.id,
          password: hashedPassword,
        },
      });
    } else {
      await prisma.account.update({
        where: { id: existing.id },
        data: { password: hashedPassword },
      });
    }

    console.log(`[seed-test] ✓ ${role}: ${email}`);
  }

  await prisma.$disconnect();
}

seedTest().catch((err) => {
  console.error(err);
  process.exit(1);
});
