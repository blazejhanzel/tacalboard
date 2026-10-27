import { mkdirSync } from "node:fs"
import { join } from "node:path"
import { DatabaseSync } from "node:sqlite"

const dataDir = process.env.TACALBOARD_DATA_DIR ?? "data"

mkdirSync(dataDir, { recursive: true })

export const db = new DatabaseSync(
  join(dataDir, "tacalboard.db")
)

db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    modified_at TEXT NOT NULL,
    revision INTEGER NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS changes (
    sequence INTEGER PRIMARY KEY AUTOINCREMENT,
    operation TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL
  )
`);