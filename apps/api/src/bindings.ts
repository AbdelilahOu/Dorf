import type { SelectSession, SelectUser } from "./db/schema";
import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";

export type Variables = {
  user: SelectUser | null;
  session: SelectSession | null;
  logger: PinoLogger;
};

export type Bindings = {
  TURSO_CONNECTION_URL: string;
  TURSO_AUTH_TOKEN: string;
};

export interface AppBindings {
  Bindings: Bindings;
  Variables: Variables;
}

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;
