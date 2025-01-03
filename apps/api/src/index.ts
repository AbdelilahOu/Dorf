import { auth } from "@/lib/auth";
import configureOpenAPI from "@/lib/config-open-api";
import createApp from "@/lib/create-app";
import { corsMiddleware, pinoLoggerMiddleware } from "@/middleware";

const app = createApp();

configureOpenAPI(app);

// app.use("*", authMiddleware);
app.use("*", corsMiddleware());
app.use(pinoLoggerMiddleware());

app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

export default app;
