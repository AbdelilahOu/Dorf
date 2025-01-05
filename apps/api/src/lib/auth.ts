import { createDatabaseConnection } from "@/db";
import * as schema from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import type { Context } from "hono";

export function setupAuth(c: Context) {
  const tursoConnectionUrl = c.env["TURSO_CONNECTION_URL"];
  const tursoAuthToken = c.env["TURSO_AUTH_TOKEN"];
  const trustedOriginsString = c.env["TRUSTED_ORIGINS"];

  if (!tursoConnectionUrl || !tursoAuthToken) {
    throw new Error(
      "TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN environment variables are required",
    );
  }

  const db = createDatabaseConnection(tursoConnectionUrl, tursoAuthToken);

  const trustedOrigins = trustedOriginsString?.split(",").filter(Boolean) || [];

  return betterAuth({
    trustedOrigins: trustedOrigins,
    database: drizzleAdapter(db, {
      provider: "sqlite",
      usePlural: true,
      schema: schema,
    }),
    advanced: {
      defaultCookieAttributes: {
        sameSite: "None",
        secure: true,
        partitioned: true,
      },
    },
    emailAndPassword: {
      enabled: true,
    },
    plugins: [bearer()],
  });
}
