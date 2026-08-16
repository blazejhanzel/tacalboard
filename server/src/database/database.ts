import { DatabaseSync } from "node:sqlite";

export const db = new DatabaseSync("data/tacalboard.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
        uuid TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL,
        modified_at TEXT NOT NULL
    )
`);