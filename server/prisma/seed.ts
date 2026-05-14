import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { auth } from "../src/lib/auth.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function seed() {
  const email = process.env.ADMIN_EMAIL!;
  const password = process.env.ADMIN_PASSWORD!;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  }

  const ctx = await auth.$context;
  const hashedPassword = await ctx.password.hash(password);

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      id: crypto.randomUUID(),
      name: "Admin",
      email,
      emailVerified: true,
      role: "admin",
    },
    update: { role: "admin", emailVerified: true },
  });

  const existingAccount = await prisma.account.findFirst({
    where: { userId: user.id, providerId: "credential" },
  });

  if (!existingAccount) {
    await prisma.account.create({
      data: {
        id: crypto.randomUUID(),
        accountId: user.id,
        providerId: "credential",
        userId: user.id,
        password: hashedPassword,
      },
    });
  }

  console.log(`✓ Admin user seeded: ${email}`);
  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
