import { db, getDatabaseVersion } from "./connection.js";

import * as migration001 from "./migrations/001-initial-schema.js";
import * as migration002 from "./migrations/002-rename-and-drop.js";

const migrations = [
  { version: 1, setup: migration001.setup },
  { version: 2, setup: migration002.setup },
];

export function migrateDatabase() {
  const currentVersion = getDatabaseVersion();

  for (const migration of migrations) {
    if (migration.version <= currentVersion) {
      continue;
    }

    db.exec("BEGIN");

    try {
      migration.setup();

      db.exec(`PRAGMA user_version = ${migration.version}`);
      db.exec("COMMIT");

      console.log(`Database migrated to version ${getDatabaseVersion()}`);
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
}
