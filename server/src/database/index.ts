import { db, getDatabaseVersion } from "./connection.js";
import { migrateDatabase } from "./migrate.js";

migrateDatabase();

export { db, getDatabaseVersion };
