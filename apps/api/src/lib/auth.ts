import { createDatabaseConnection } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const db = createDatabaseConnection(process.env["DATABASE_URL"]!);

export const auth = betterAuth({
  baseURL: "http://localhost:3003",
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },
});
