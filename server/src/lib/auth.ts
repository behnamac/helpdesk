import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "./prisma.js";

const rawOrigins = process.env.TRUSTED_ORIGINS;
if (!rawOrigins) {
  throw new Error(
    "TRUSTED_ORIGINS environment variable is required. " +
    "Set it to your frontend origin (e.g. http://localhost:5173)."
  );
}
const trustedOrigins = rawOrigins.split(",").map((o) => o.trim()).filter(Boolean);

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, disableSignUp: true },
  trustedOrigins,
  plugins: [admin()],
  rateLimit: {
    enabled: true,
    window: 10,
    max: 10,
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});
