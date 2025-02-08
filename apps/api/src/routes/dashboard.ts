import { createDatabaseConnection } from "../db";
import { waterMeterReadings, waterMeters } from "../db/schema";
import { createRouter } from "../lib/create-app";
import { createRoute } from "@hono/zod-openapi";
import { count, sql, sum } from "drizzle-orm";
import { z } from "zod";

const dashboardData = z.object({});

const dashboardRouter = createRouter().openapi(
  createRoute({
    method: "get",
    path: "/",
    summary: "Get dashboard data",
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.array(dashboardData),
          },
        },
        description: "Retrieve dashboard data",
      },
      500: {
        description: "Internal server error",
      },
    },
  }),
  async (c) => {
    try {
      const db = createDatabaseConnection(
        c.env.TURSO_CONNECTION_URL,
        c.env.TURSO_AUTH_TOKEN,
      );
      const [waterMetersCount] = await db
        .select({
          count: count(),
        })
        .from(waterMeters);

      const [totalWaterConsumption] = await db
        .select({
          total: sum(sql`COALESCE(water_meter_readings.amount, 0)`),
        })
        .from(waterMeterReadings);

      return c.json(
        {
          waterMetersCount: waterMetersCount.count,
          totalWaterConsumption: totalWaterConsumption.total,
        },
        200,
      );
    } catch (error) {
      c.var.logger.error("Error fetching all readings:", error);
      return c.text("Internal server error", 500);
    }
  },
);

export default dashboardRouter;
