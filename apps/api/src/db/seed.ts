import { createDatabaseConnection } from "./index"; // Path to your db connection
import { homesTable, users, waterMeterReadingsTable } from "./schema"; // Path to your schema
import { sql } from "drizzle-orm";
import { faker } from "@faker-js/faker";
import { createId } from "@paralleldrive/cuid2";
import { verifyEmail } from "better-auth/api";

async function main() {
  const db = createDatabaseConnection(
    process.env.TURSO_CONNECTION_URL!,
    process.env.TURSO_AUTH_TOKEN!,
  );
  // Clear existing tables if necessary (optional)
  await db.delete(waterMeterReadingsTable);
  await db.delete(homesTable);
  const usersFromDb = await db.select().from(users);

  // Generate some dummy homes
  const newHomes = Array.from({ length: 5 }).map(() => ({
    id: createId(),
    waterMeterId: createId(),
    district: faker.location.city(),
    headOfHousehold: faker.helpers.arrayElement(usersFromDb).id,
  }));

  await db.insert(homesTable).values(newHomes).returning();
  const homesFromDb = await db.select().from(homesTable);

  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  const today = new Date();
  const readings = [];

  for (const home of homesFromDb) {
    let currentDate = new Date(twoYearsAgo);

    while (currentDate <= today) {
      const readingDate = new Date(currentDate);
      readings.push({
        id: createId(),
        homeId: home.id,
        amount: parseFloat(faker.number.float({ min: 0, max: 200 }).toFixed(2)),
        createdAt: readingDate.toISOString(),
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }

  await db.insert(waterMeterReadingsTable).values(readings);

  console.log("Seed data inserted successfully!");
}

main()
  .catch((err) => {
    console.error("Error seeding database:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
