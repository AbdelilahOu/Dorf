import { setupAuth } from "@/lib/auth";
import { logger } from "@dorf/logger";
import type { Context, Next } from "hono";
import { pinoLogger } from "hono-pino";
import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";

export const authMiddleware = createMiddleware(
  async (c: Context, next: Next) => {
    const auth = setupAuth(c);
    const headers = new Headers(c.req.raw.headers);
    const session = await auth.api.getSession({ headers });

    if (!session) {
      return c.json({ message: "UNAUTHORIZED" }, 401);
    }

    if (!session.user.emailVerified) {
      return c.json({ message: "EMAIL IS NOT VERIFIED" }, 403);
    }

    c.set("user", session.user);
    c.set("session", session.session);

    return next();
  },
);

export function corsMiddleware() {
  return cors({
    origin: [
      "http://192.168.1.115:3000",
      "http://localhost:3003",
      "http://tauri.host",
    ],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  });
}

export function pinoLoggerMiddleware() {
  return pinoLogger({
    pino: logger,
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
}
