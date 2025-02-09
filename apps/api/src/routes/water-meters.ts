import { createRoute } from "@hono/zod-openapi";
import { and, eq, like, not, sql } from "drizzle-orm";
import { z } from "zod";
import { createDatabaseConnection } from "../db";
import { waterMeters } from "../db/schema";
import { createRouter } from "../lib/create-app";

const insertWaterMeterSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
});

const updateWaterMeterSchema = z.object({
  name: z.string().optional(),
});

const waterMeterSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  userId: z.string().nullable(),
  deleted: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});

export type SelectWaterMeterType = typeof waterMeterSchema._type;
export type UpdateWaterMeterType = typeof updateWaterMeterSchema._type;
export type InsertWaterMeterType = typeof insertWaterMeterSchema._type;

const waterMeterRoute = createRouter()
  .openapi(
    createRoute({
      method: "get",
      path: "/",
      request: {
        query: z.object({
          name: z.string().optional(),
          id: z.string().optional(),
        }),
      },
      summary: "Get all non-deleted water meters",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.array(waterMeterSchema),
            },
          },
          description: "Retrieve all non-deleted water meters",
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
        const { name, id } = c.req.valid("query");
        const data = await db
          .select()
          .from(waterMeters)
          .where(
            and(
              not(eq(waterMeters.deleted, true)),
              id ? eq(waterMeters.id, id) : undefined,
              name ? like(waterMeters.name, `%${name}%`) : undefined,
            ),
          )
          .orderBy(sql`${waterMeters.updatedAt} desc`)
          .all();
        return c.json(data, 200);
      } catch (error) {
        c.var.logger.error("Error fetching water meters:", error);
        return c.text("Internal server error", 500);
      }
    },
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/:id",
      summary: "Get a water meter by ID",
      request: {
        params: z.object({ id: z.coerce.string() }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: waterMeterSchema,
            },
          },
          description: "Retrieve one water meter",
        },
        404: {
          description: "Water meter not found",
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

        const meter = await db
          .select()
          .from(waterMeters)
          .where(
            and(eq(waterMeters.id, id), not(eq(waterMeters.deleted, true))),
          )
          .get();

        if (!meter) {
          return c.text("Water meter not found", 404);
        }

        return c.json(meter, 200);
      } catch (error) {
        c.var.logger.error("Error fetching water meter by ID:", error);
        return c.text("Internal server error", 500);
      }
    },
  )
  .openapi(
    createRoute({
      method: "post",
      path: "/",
      summary: "Create a new water meter",
      request: {
        body: {
          content: {
            "application/json": {
              schema: insertWaterMeterSchema,
            },
          },
        },
      },
      responses: {
        201: {
          content: {
            "application/json": {
              schema: waterMeterSchema,
            },
          },
          description: "Create a new water meter",
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
      const newMeter = c.req.valid("json");
      c.var.logger.info(newMeter);
      try {
        const insertedMeter = await db
          .insert(waterMeters)
          .values({
            ...newMeter,
            deleted: false,
          })
          .returning()
          .get();
        return c.json(insertedMeter, 201);
      } catch (error) {
        c.var.logger.error("Error creating water meter:", error);
        return c.text("Error creating water meter", 400);
      }
    },
  )
  .openapi(
    createRoute({
      method: "put",
      path: "/:id",
      summary: "Update a water meter by ID",
      request: {
        params: z.object({ id: z.coerce.string() }),
        body: {
          content: {
            "application/json": {
              schema: updateWaterMeterSchema,
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: waterMeterSchema,
            },
          },
          description: "Update a water meter by ID",
        },
        400: {
          description: "Invalid input",
        },
        404: {
          description: "Water meter not found",
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
      const updatedMeter = c.req.valid("json");
      try {
        const meter = await db
          .update(waterMeters)
          .set({
            ...updatedMeter,
          })
          .where(eq(waterMeters.id, id))
          .returning()
          .get();
        if (!meter) {
          return c.text("Water meter not found", 404);
        }
        return c.json(meter);
      } catch (error) {
        c.var.logger.error("Error updating water meter:", error);
        return c.text("Error updating water meter", 400);
      }
    },
  )
  .openapi(
    createRoute({
      method: "delete",
      path: "/:id",
      summary: "Soft delete a water meter by ID",
      request: {
        params: z.object({ id: z.coerce.string() }),
      },
      responses: {
        204: {
          description: "Water meter soft deleted successfully",
        },
        404: {
          description: "Water meter not found",
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
        const meter = await db
          .select()
          .from(waterMeters)
          .where(
            and(eq(waterMeters.id, id), not(eq(waterMeters.deleted, true))),
          )
          .get();
        if (!meter) {
          return c.text("Water meter not found", 404);
        }
        await db
          .update(waterMeters)
          .set({ deleted: true, updatedAt: new Date() }) // Soft delete and update timestamp
          .where(eq(waterMeters.id, id))
          .run();
        return c.text("Deleted successfully", 204);
      } catch (error) {
        c.var.logger.error("Error soft deleting water meter:", error);
        return c.text("Error soft deleting water meter", 500);
      }
    },
  );

export default waterMeterRoute;
