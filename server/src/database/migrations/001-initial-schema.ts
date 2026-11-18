import { db } from "@/database/connection.js"

export function setup() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      modified_at TEXT NOT NULL,
      revision INTEGER NOT NULL
    )
  `);
  
  // TODO: Change table to "sync_operations" to be the same as in frontend
  db.exec(`
    CREATE TABLE IF NOT EXISTS changes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      operation TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL
    )
  `);
}