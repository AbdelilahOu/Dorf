import { createDatabaseConnection } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const db = createDatabaseConnection(
  process.env["TURSO_CONNECTION_URL"]!,
  process.env["TURSO_AUTH_TOKEN"]!,
);

export const auth = betterAuth({
  baseURL: "http://localhost:3003",
  database: drizzleAdapter(db, {
    provider: "sqlite",
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
