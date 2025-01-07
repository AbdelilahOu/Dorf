import { setupAuth } from "@/lib/auth";
import configureOpenAPI from "@/lib/config-open-api";
import createApp from "@/lib/create-app";
import {
  authMiddleware,
  corsMiddleware,
  pinoLoggerMiddleware,
} from "@/middleware";
import homes from "./routes/homes";
import readings from "./routes/readings";

const app = createApp();

configureOpenAPI(app);

app.use("*", authMiddleware);
app.use("*", corsMiddleware());
app.use(pinoLoggerMiddleware());

app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return setupAuth(c).handler(c.req.raw);
});

app.route("/homes", homes);
app.route("readings", readings);

export default app;
