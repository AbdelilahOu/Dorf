import { auth } from "@/lib/auth";
import { logger } from "@dorf/logger";
import { Context, Next } from "hono";
import { pinoLogger } from "hono-pino";
import { cors } from "hono/cors";

export async function authMiddleware(c: Context, next: Next) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
}

export function corsMiddleware() {
  return cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
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
