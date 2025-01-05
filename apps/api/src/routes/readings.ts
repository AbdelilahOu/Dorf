import { createDatabaseConnection } from "@/db";
import { waterMeterReadingsTable } from "@/db/schema";
import { createRouter } from "@/lib/create-app";
import { createRoute } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { z } from "zod";

const insertReadingSchema = z.object({
  homeId: z.string(),
  amount: z.number(),
});

const updateReadingSchema = z.object({
  homeId: z.string().optional(),
  amount: z.number().optional(),
});

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
              schema: z.array(
                z.object({
                  id: z.string(),
                  homeId: z.string(),
                  amount: z.number(),
                  createdAt: z.string(),
                }),
              ),
            },
          },
          description: "Retrieve all water meter readings",
        },
      },
    }),
    async (c) => {
      const db = createDatabaseConnection(
        c.env.TURSO_CONNECTION_URL,
        c.env.TURSO_AUTH_TOKEN,
      );
      const readings = await db.select().from(waterMeterReadingsTable).all();
      return c.json(readings);
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
              schema: z.object({
                id: z.string(),
                homeId: z.string(),
                amount: z.number(),
                createdAt: z.string(),
              }),
            },
          },
          description: "Retrieve one water meter reading",
        },
        404: {
          description: "Reading not found",
        },
      },
    }),
    async (c) => {
      const db = createDatabaseConnection(
        c.env.TURSO_CONNECTION_URL,
        c.env.TURSO_AUTH_TOKEN,
      );
      const id = c.req.valid("param").id;
      const reading = await db
        .select()
        .from(waterMeterReadingsTable)
        .where(eq(waterMeterReadingsTable.id, id))
        .get();
      if (!reading) {
        return c.text("Reading not found", 404);
      }
      return c.json(reading);
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
              schema: z.object({
                id: z.string(),
                homeId: z.string(),
                amount: z.number(),
                createdAt: z.string(),
              }),
            },
          },
          description: "Create a new water meter reading",
        },
        400: {
          description: "Invalid input",
        },
      },
    }),
    async (c) => {
      const db = createDatabaseConnection(
        c.env.TURSO_CONNECTION_URL,
        c.env.TURSO_AUTH_TOKEN,
      );
      const newReading = c.req.valid("json");
      try {
        const insertedReading = await db
          .insert(waterMeterReadingsTable)
          .values(newReading)
          .returning()
          .get();
        return c.json(insertedReading, 201);
      } catch (error) {
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
              schema: z.object({
                id: z.string(),
                homeId: z.string(),
                amount: z.number(),
                createdAt: z.string(),
              }),
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
          .update(waterMeterReadingsTable)
          .set(updatedReading)
          .where(eq(waterMeterReadingsTable.id, id))
          .returning()
          .get();
        if (!reading) {
          return c.text("Reading not found", 404);
        }
        return c.json(reading);
      } catch (error) {
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
          .from(waterMeterReadingsTable)
          .where(eq(waterMeterReadingsTable.id, id))
          .get();
        if (!reading) {
          return c.text("Reading not found", 404);
        }
        await db
          .delete(waterMeterReadingsTable)
          .where(eq(waterMeterReadingsTable.id, id))
          .run();
        return c.text("deleted successfully", 204);
      } catch (error) {
        return c.text("Error deleting reading", 400);
      }
    },
  );

export default readings;
