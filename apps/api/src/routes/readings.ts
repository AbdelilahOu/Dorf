import { createDatabaseConnection } from "@/db";
import { users, waterMeterReadings, waterMeters } from "@/db/schema";
import { createRouter } from "@/lib/create-app";
import { createRoute } from "@hono/zod-openapi";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

const insertReadingSchema = z.object({
  waterMeterId: z.string(),
  amount: z.number(),
  periodStart: z.string(),
  periodEnd: z.string(),
});

const updateReadingSchema = z.object({
  amount: z.number().optional(),
});

const readingSchema = z.object({
  id: z.string(),
  waterMeterId: z.string(),
  amount: z.number(),
  periodStart: z.string(),
  periodEnd: z.string(),
  createdAt: z.string().nullable(),
  waterMeterName: z.string().nullable(),
});

export type SelectReadingType = typeof readingSchema._type;
export type UpdateReadingType = typeof updateReadingSchema._type;
export type InsertReadingType = typeof insertReadingSchema._type;

const readings = createRouter()
  .openapi(
    createRoute({
      method: "get",
      path: "/",
      summary: "Get all water meter readings",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.array(readingSchema),
            },
          },
          description: "Retrieve all water meter readings",
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
        const readings = await db
          .select({
            id: waterMeterReadings.id,
            waterMeterId: waterMeterReadings.waterMeterId,
            amount: waterMeterReadings.amount,
            periodStart: waterMeterReadings.periodStart,
            periodEnd: waterMeterReadings.periodEnd,
            createdAt: waterMeterReadings.createdAt,
            waterMeterName: waterMeters.name,
          })
          .from(waterMeterReadings)
          .leftJoin(
            waterMeters,
            eq(waterMeters.id, waterMeterReadings.waterMeterId),
          )
          .leftJoin(users, eq(users.id, waterMeters.userId))
          .orderBy(sql`${waterMeterReadings.createdAt} desc`)
          .all();
        return c.json(readings, 200);
      } catch (error) {
        c.var.logger.error("Error fetching all readings:", error);
        return c.text("Internal server error", 500);
      }
    },
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/:id",
      summary: "Get a water meter reading by ID",
      request: {
        params: z.object({ id: z.coerce.string() }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: readingSchema,
            },
          },
          description: "Retrieve one water meter reading",
        },
        404: {
          description: "Reading not found",
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
        const id = c.req.valid("param").id;
        const reading = await db
          .select()
          .from(waterMeterReadings)
          .where(eq(waterMeterReadings.id, id))
          .get();
        if (!reading) {
          return c.text("Reading not found", 404);
        }
        return c.json(reading, 200);
      } catch (error) {
        c.var.logger.error("Error fetching reading by ID:", error);
        return c.text("Internal server error", 500);
      }
    },
  )
  .openapi(
    createRoute({
      method: "post",
      path: "/",
      summary: "Create a new water meter reading",
      request: {
        body: {
          content: {
            "application/json": {
              schema: insertReadingSchema,
            },
          },
        },
      },
      responses: {
        201: {
          content: {
            "application/json": {
              schema: readingSchema,
            },
          },
          description: "Create a new water meter reading",
        },
        400: {
          description: "Invalid input",
        },
        500: {
          description: "Internal server error",
        },
      },
    }),
    async (c) => {
      const db = createDatabaseConnection(
        c.env.TURSO_CONNECTION_URL,
        c.env.TURSO_AUTH_TOKEN,
      );
      const newReading = c.req.valid("json");

      console.log(c.req.json());

      try {
        const insertedReading = await db
          .insert(waterMeterReadings)
          .values(newReading)
          .returning()
          .get();
        return c.json(insertedReading, 201);
      } catch (error) {
        c.var.logger.error("Error creating reading:", error);
        return c.text("Error creating reading", 400);
      }
    },
  )
  .openapi(
    createRoute({
      method: "put",
      path: "/:id",
      summary: "Update a water meter reading by ID",
      request: {
        params: z.object({ id: z.coerce.string() }),
        body: {
          content: {
            "application/json": {
              schema: updateReadingSchema,
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: readingSchema,
            },
          },
          description: "Update a water meter reading by ID",
        },
        400: {
          description: "Invalid input",
        },
        404: {
          description: "Reading not found",
        },
        500: {
          description: "Internal server error",
        },
      },
    }),
    async (c) => {
      const db = createDatabaseConnection(
        c.env.TURSO_CONNECTION_URL,
        c.env.TURSO_AUTH_TOKEN,
      );
      const id = c.req.valid("param").id;
      const updatedReading = c.req.valid("json");
      try {
        const reading = await db
          .update(waterMeterReadings)
          .set(updatedReading)
          .where(eq(waterMeterReadings.id, id))
          .returning()
          .get();
        if (!reading) {
          return c.text("Reading not found", 404);
        }
        return c.json(reading, 200);
      } catch (error) {
        c.var.logger.error("Error updating reading:", error);
        return c.text("Error updating reading", 400);
      }
    },
  )
  .openapi(
    createRoute({
      method: "delete",
      path: "/:id",
      summary: "Delete a water meter reading by ID",
      request: {
        params: z.object({ id: z.coerce.string() }),
      },
      responses: {
        204: {
          description: "Reading deleted successfully",
        },
        404: {
          description: "Reading not found",
        },
        500: {
          description: "Internal server error",
        },
      },
    }),
    async (c) => {
      const db = createDatabaseConnection(
        c.env.TURSO_CONNECTION_URL,
        c.env.TURSO_AUTH_TOKEN,
      );
      const id = c.req.valid("param").id;
      try {
        const reading = await db
          .select()
          .from(waterMeterReadings)
          .where(eq(waterMeterReadings.id, id))
          .get();
        if (!reading) {
          return c.text("Reading not found", 404);
        }
        await db
          .delete(waterMeterReadings)
          .where(eq(waterMeterReadings.id, id))
          .run();
        return c.text("deleted successfully", 204);
      } catch (error) {
        c.var.logger.error("Error deleting reading:", error);
        return c.text("Error deleting reading", 500);
      }
    },
  );

export default readings;
