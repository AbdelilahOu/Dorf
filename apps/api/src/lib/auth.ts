import { createDatabaseConnection } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import type { Context } from "hono";

export function setupAuth(c: Context) {
  const db = createDatabaseConnection(
    c.env["TURSO_CONNECTION_URL"]!,
    c.env["TURSO_AUTH_TOKEN"]!,
  );

  return betterAuth({
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
    emailAndPassword: {
      enabled: true,
    },
    plugins: [bearer()],
  });
}
