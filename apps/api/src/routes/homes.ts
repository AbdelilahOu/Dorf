import { createDatabaseConnection } from "@/db";
import { homesTable } from "@/db/schema";
import { createRouter } from "@/lib/create-app";
import { createRoute } from "@hono/zod-openapi";
import { and, eq, not } from "drizzle-orm";
import { z } from "zod";

const insertHomeSchema = z.object({
  waterMeterId: z.string(),
  district: z.string(),
  headOfHousehold: z.string(),
});

const updateHomeSchema = z.object({
  waterMeterId: z.string().optional(),
  district: z.string().optional(),
  headOfHousehold: z.string().optional(),
});

const homes = createRouter()
  .openapi(
    createRoute({
      method: "get",
      path: "/",
      summary: "Get all non-deleted homes",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.array(
                z.object({
                  id: z.string(),
                  waterMeterId: z.string(),
                  district: z.string(),
                  headOfHousehold: z.string(),
                  createdAt: z.date(),
                  updatedAt: z.date().nullable(),
                  deleted: z.boolean(),
                }),
              ),
            },
          },
          description: "Retrieve all non-deleted homes",
        },
      },
    }),
    async (c) => {
      const db = createDatabaseConnection(
        c.env.TURSO_CONNECTION_URL,
        c.env.TURSO_AUTH_TOKEN,
      );
      const homes = await db
        .select()
        .from(homesTable)
        .where(not(eq(homesTable.deleted, true)))
        .all();
      return c.json(homes, 200);
    },
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/:id",
      summary: "Get a home by ID",
      request: {
        params: z.object({ id: z.coerce.string() }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.object({
                id: z.string(),
                waterMeterId: z.string(),
                district: z.string(),
                headOfHousehold: z.string(),
                createdAt: z.date(),
                updatedAt: z.date().nullable(),
                deleted: z.boolean(),
              }),
            },
          },
          description: "Retrieve one home",
        },
        404: {
          description: "Home not found",
        },
      },
    }),
    async (c) => {
      const db = createDatabaseConnection(
        c.env.TURSO_CONNECTION_URL,
        c.env.TURSO_AUTH_TOKEN,
      );

      const id = c.req.valid("param").id;

      const home = await db
        .select()
        .from(homesTable)
        .where(and(eq(homesTable.id, id), not(eq(homesTable.deleted, true))))
        .get();

      if (!home) {
        return c.text("Home not found", 404);
      }

      return c.json(home, 200);
    },
  )
  .openapi(
    createRoute({
      method: "post",
      path: "/",
      summary: "Create a new home",
      request: {
        body: {
          content: {
            "application/json": {
              schema: insertHomeSchema,
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
                waterMeterId: z.string(),
                district: z.string(),
                headOfHousehold: z.string(),
                createdAt: z.date(),
                updatedAt: z.date().nullable(),
                deleted: z.boolean(),
              }),
            },
          },
          description: "Create a new home",
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
      const newHome = c.req.valid("json");
      try {
        const insertedHome = await db
          .insert(homesTable)
          .values({ ...newHome, deleted: false })
          .returning()
          .get();
        return c.json(insertedHome, 201);
      } catch (error) {
        return c.text("Error creating home", 400);
      }
    },
  )
  .openapi(
    createRoute({
      method: "put",
      path: "/:id",
      summary: "Update a home by ID",
      request: {
        params: z.object({ id: z.coerce.string() }),
        body: {
          content: {
            "application/json": {
              schema: updateHomeSchema,
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
                waterMeterId: z.string(),
                district: z.string(),
                headOfHousehold: z.string(),
                createdAt: z.date(),
                updatedAt: z.date().nullable(),
                deleted: z.boolean(),
              }),
            },
          },
          description: "Update a home by ID",
        },
        400: {
          description: "Invalid input",
        },
        404: {
          description: "Home not found",
        },
      },
    }),
    async (c) => {
      const db = createDatabaseConnection(
        c.env.TURSO_CONNECTION_URL,
        c.env.TURSO_AUTH_TOKEN,
      );
      const id = c.req.valid("param").id;
      const updatedHome = c.req.valid("json");
      try {
        const home = await db
          .update(homesTable)
          .set(updatedHome)
          .where(eq(homesTable.id, id))
          .returning()
          .get();
        if (!home) {
          return c.text("Home not found", 404);
        }
        return c.json(home);
      } catch (error) {
        return c.text("Error updating home", 400);
      }
    },
  )
  .openapi(
    createRoute({
      method: "delete",
      path: "/:id",
      summary: "Soft delete a home by ID",
      request: {
        params: z.object({ id: z.coerce.string() }),
      },
      responses: {
        204: {
          description: "Home soft deleted successfully",
        },
        404: {
          description: "Home not found",
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
        const home = await db
          .select()
          .from(homesTable)
          .where(and(eq(homesTable.id, id), not(eq(homesTable.deleted, true))))
          .get();
        if (!home) {
          return c.text("Home not found", 404);
        }
        await db
          .update(homesTable)
          .set({ deleted: true })
          .where(eq(homesTable.id, id))
          .run();
        return c.text("delete successfully", 204);
      } catch (error) {
        return c.text("Error soft deleting home", 400);
      }
    },
  );

export default homes;
