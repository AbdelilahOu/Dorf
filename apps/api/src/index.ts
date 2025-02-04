import { setupAuth } from "@/lib/auth";
import configureOpenAPI from "@/lib/config-open-api";
import createApp from "@/lib/create-app";
import { authMiddleware, pinoLoggerMiddleware } from "@/middleware";
import readingsRouter from "./routes/readings";
import usersRouter from "./routes/users";
import waterMetersRouter from "./routes/water-meters";
import dashboardRouter from "./routes/dashboard";

const app = createApp();

configureOpenAPI(app);

app.use("/api/v1/*", authMiddleware);
// app.use("*", corsMiddleware());
app.use("*", pinoLoggerMiddleware());

app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return setupAuth(c).handler(c.req.raw);
});

app.route("/api/v1/water-meters", waterMetersRouter);
app.route("/api/v1/dashboard", dashboardRouter);
app.route("/api/v1/readings", readingsRouter);
app.route("/api/v1/users", usersRouter);

export default app;
