import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export function createDatabaseConnection(URL: string) {
  const client = postgres(URL);
  return drizzle({ client, schema });
}
