import { createRoute } from "@hono/zod-openapi";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { createDatabaseConnection } from "../db";
import { users } from "../db/schema";
import { createRouter } from "../lib/create-app";

const updateUserSchema = z.object({
  name: z.string().optional(),
  nic: z.string().optional(),
  role: z.string().optional(),
  email: z.string().email().optional(),
  emailVerified: z.boolean().optional(),
  image: z.string().optional(),
});

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  nic: z.string(),
  role: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const usersRouter = createRouter()
  .openapi(
    createRoute({
      method: "get",
      path: "/",
      summary: "Get all users",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.array(userSchema),
            },
          },
          description: "Retrieve all users",
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
        const allUsers = await db.select().from(users).all();
        return c.json(allUsers, 200);
      } catch (error) {
        c.var.logger.error("Error fetching all users:", error);
        return c.text("Internal server error", 500);
      }
    },
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/:id",
      summary: "Get a user by ID",
      request: {
        params: z.object({ id: z.coerce.string() }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: userSchema,
            },
          },
          description: "Retrieve one user",
        },
        404: {
          description: "User not found",
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
        const user = await db
          .select()
          .from(users)
          .where(eq(users.id, id))
          .get();
        if (!user) {
          return c.text("User not found", 404);
        }
        return c.json(user, 200);
      } catch (error) {
        c.var.logger.error("Error fetching user by ID:", error);
        return c.text("Internal server error", 500);
      }
    },
  )
  .openapi(
    createRoute({
      method: "put",
      path: "/:id",
      summary: "Update a user by ID",
      request: {
        params: z.object({ id: z.coerce.string() }),
        body: {
          content: {
            "application/json": {
              schema: updateUserSchema,
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: userSchema,
            },
          },
          description: "Update a user by ID",
        },
        400: {
          description: "Invalid input",
        },
        404: {
          description: "User not found",
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
      const updatedUser = c.req.valid("json");
      try {
        const user = await db
          .update(users)
          .set({
            ...updatedUser,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(users.id, id))
          .returning()
          .get();
        if (!user) {
          return c.text("User not found", 404);
        }
        return c.json(user, 200);
      } catch (error) {
        c.var.logger.error("Error updating user:", error);
        return c.text("Error updating user", 400);
      }
    },
  )
  .openapi(
    createRoute({
      method: "delete",
      path: "/:id",
      summary: "Delete a user by ID",
      request: {
        params: z.object({ id: z.coerce.string() }),
      },
      responses: {
        204: {
          description: "User deleted successfully",
        },
        404: {
          description: "User not found",
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
        const user = await db
          .select()
          .from(users)
          .where(eq(users.id, id))
          .get();
        if (!user) {
          return c.text("User not found", 404);
        }
        await db.delete(users).where(eq(users.id, id)).run();
        return c.text("User deleted successfully", 204);
      } catch (error) {
        c.var.logger.error("Error deleting user:", error);
        return c.text("Error deleting user", 500);
      }
    },
  );

export default usersRouter;
