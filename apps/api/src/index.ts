import { setupAuth } from "@/lib/auth";
import configureOpenAPI from "@/lib/config-open-api";
import createApp from "@/lib/create-app";
import {
  authMiddleware,
  corsMiddleware,
  pinoLoggerMiddleware,
} from "@/middleware";
import readings from "./routes/readings";
import waterMeters from "./routes/water-meters";

const app = createApp();

configureOpenAPI(app);

app.use("/api/v1/*", authMiddleware);
app.use("*", corsMiddleware());
app.use("*", pinoLoggerMiddleware());

app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return setupAuth(c).handler(c.req.raw);
});

app.route("/api/v1/water-meters", waterMeters);
app.route("/api/v1/readings", readings);

export default app;
