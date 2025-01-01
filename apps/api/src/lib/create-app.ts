import { OpenAPIHono } from "@hono/zod-openapi";

import type { AppBindings } from "./types";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json({ success: false, errors: result.error.errors }, 422);
      }
    },
  });
}

export default function createApp() {
  const app = createRouter();
  return app;
}
