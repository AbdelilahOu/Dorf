import { createDatabaseConnection } from "@/db";
import { houses, users } from "@/db/schema";
import { createRouter } from "@/lib/create-app";
import { createRoute } from "@hono/zod-openapi";
import { and, eq, not, sql } from "drizzle-orm";
import { z } from "zod";

const insertHouseSchema = z.object({
  waterMeterId: z.string(),
  district: z.string(),
  name: z.string(),
});

const updateHouseSchema = z.object({
  waterMeterId: z.string().optional(),
  district: z.string().optional(),
  name: z.string().optional(),
});

const houseSchema = z.object({
  waterMeterId: z.string(),
  district: z.string(),
  headOfHousehold: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  deleted: z.boolean(),
});

const housesRoute = createRouter()
  .openapi(
    createRoute({
      method: "get",
      path: "/",
      summary: "Get all non-deleted houses",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.array(
                z.object({
                  waterMeterId: z.string(),
                  name: z.string().nullable(),
                  district: z.string(),
                  headOfHousehold: z.string().nullable(),
                  createdAt: z.date(),
                }),
              ),
            },
          },
          description: "Retrieve all non-deleted houses",
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
        const data = await db
          .select({
            waterMeterId: houses.waterMeterId,
            name: houses.name,
            district: houses.district,
            headOfHousehold: users.name,
            createdAt: houses.createdAt,
          })
          .from(houses)
          .leftJoin(users, eq(users.id, houses.headOfHousehold))
          .where(not(eq(houses.deleted, true)))
          .orderBy(sql`${houses.updatedAt} desc`)
          .all();
        return c.json(data, 200);
      } catch (error) {
        c.env.LOGGER.error("Error fetching houses:", error);
        return c.text("Internal server error", 500);
      }
    },
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/:id",
      summary: "Get a house by ID",
      request: {
        params: z.object({ id: z.coerce.string() }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: houseSchema,
            },
          },
          description: "Retrieve one house",
        },
        404: {
          description: "House not found",
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

        const house = await db
          .select()
          .from(houses)
          .where(
            and(eq(houses.waterMeterId, id), not(eq(houses.deleted, true))),
          )
          .get();

        if (!house) {
          return c.text("House not found", 404);
        }

        return c.json(house, 200);
      } catch (error) {
        c.env.LOGGER.error("Error fetching house by ID:", error);
        return c.text("Internal server error", 500);
      }
    },
  )
  .openapi(
    createRoute({
      method: "post",
      path: "/",
      summary: "Create a new house",
      request: {
        body: {
          content: {
            "application/json": {
              schema: insertHouseSchema,
            },
          },
        },
      },
      responses: {
        201: {
          content: {
            "application/json": {
              schema: houseSchema,
            },
          },
          description: "Create a new house",
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
      const newHouse = c.req.valid("json");
      try {
        const insertedHouse = await db
          .insert(houses)
          .values({ ...newHouse, deleted: false })
          .returning()
          .get();
        return c.json(insertedHouse, 201);
      } catch (error) {
        c.env.LOGGER.error("Error creating house:", error);
        return c.text("Error creating house", 400);
      }
    },
  )
  .openapi(
    createRoute({
      method: "put",
      path: "/:id",
      summary: "Update a house by ID",
      request: {
        params: z.object({ id: z.coerce.string() }),
        body: {
          content: {
            "application/json": {
              schema: updateHouseSchema,
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: houseSchema,
            },
          },
          description: "Update a house by ID",
        },
        400: {
          description: "Invalid input",
        },
        404: {
          description: "House not found",
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
      const updatedHouse = c.req.valid("json");
      try {
        const house = await db
          .update(houses)
          .set(updatedHouse)
          .where(eq(houses.waterMeterId, id))
          .returning()
          .get();
        if (!house) {
          return c.text("House not found", 404);
        }
        return c.json(house);
      } catch (error) {
        c.env.LOGGER.error("Error updating house:", error);
        return c.text("Error updating house", 400);
      }
    },
  )
  .openapi(
    createRoute({
      method: "delete",
      path: "/:id",
      summary: "Soft delete a house by ID",
      request: {
        params: z.object({ id: z.coerce.string() }),
      },
      responses: {
        204: {
          description: "House soft deleted successfully",
        },
        404: {
          description: "House not found",
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
        const house = await db
          .select()
          .from(houses)
          .where(
            and(eq(houses.waterMeterId, id), not(eq(houses.deleted, true))),
          )
          .get();
        if (!house) {
          return c.text("House not found", 404);
        }
        await db
          .update(houses)
          .set({ deleted: true })
          .where(eq(houses.waterMeterId, id))
          .run();
        return c.text("delete successfully", 204);
      } catch (error) {
        c.env.LOGGER.error("Error soft deleting house:", error);
        return c.text("Error soft deleting house", 500);
      }
    },
  );

export default housesRoute;
