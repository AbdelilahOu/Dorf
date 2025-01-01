import { apiReference } from "@scalar/hono-api-reference";
import PackageJson from "package.json";
import { AppOpenAPI } from "./types";

export default function configureOpenAPI(app: AppOpenAPI) {
  app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
    type: "http",
    scheme: "bearer",
  });

  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: PackageJson.version,
      title: "dorf api",
    },
  });

  app.get(
    "/reference",
    apiReference({
      theme: "saturn",
      layout: "modern",
      defaultHttpClient: {
        targetKey: "javascript",
        clientKey: "fetch",
      },
      spec: {
        url: "/doc",
      },
    }),
  );
}
