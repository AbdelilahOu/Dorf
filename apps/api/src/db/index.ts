import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export function createDatabaseConnection(URL: string, auth: string) {
  return drizzle({
    connection: {
      url: URL,
      authToken: auth,
    },
    schema,
  });
}
