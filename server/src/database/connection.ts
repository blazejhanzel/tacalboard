import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

const dataDir = process.env.TACALBOARD_DATA_DIR ?? "data"; // TODO: Add this path as volume in docker

mkdirSync(dataDir, { recursive: true });

export const db = new DatabaseSync(join(dataDir, "tacalboard.db"));

export function getDatabaseVersion(): number {
  const result = db.prepare("PRAGMA user_version").get() as {
    user_version: number;
  };

  return result.user_version;
}
