import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import { PinoLogger } from "hono-pino";
import { auth } from "./auth";

export type Variables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

export type Bindings = {
  AI: Ai;
  TURSO_CONNECTION_URL: string;
  TURSO_AUTH_TOKEN: string;
  PRACTICE_AUDIO_GENERATOR: Workflow;
  LOGGER: PinoLogger;
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
