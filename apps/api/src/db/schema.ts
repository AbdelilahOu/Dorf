import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const sessionsTable = sqliteTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),
});

export const accounts = sqliteTable("accounts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verifications = sqliteTable("verifications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const homesTable = sqliteTable("homes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  waterMeterId: text("water-meter-id").notNull().unique(),
  district: text("district").notNull(),
  headOfHousehold: text("head-of-household")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  deleted: integer({ mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export const waterMeterReadingsTable = sqliteTable("water-meter-readings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  homeId: text("home_id")
    .notNull()
    .references(() => homesTable.id, { onDelete: "restrict" }),
  amount: real("amount").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertSession = typeof sessionsTable.$inferInsert;
export type SelectSession = typeof sessionsTable.$inferSelect;

export type InsertAccount = typeof accounts.$inferInsert;
export type SelectAccount = typeof accounts.$inferSelect;

export type InsertVerification = typeof verifications.$inferInsert;
export type SelectVerification = typeof verifications.$inferSelect;

export type InsertHome = typeof homesTable.$inferInsert;
export type SelectHome = typeof homesTable.$inferSelect;

export type InsertReading = typeof waterMeterReadingsTable.$inferInsert;
export type SelectReading = typeof waterMeterReadingsTable.$inferSelect;
