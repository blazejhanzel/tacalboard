import { db } from "../connection.js";

export function setup() {
  db.exec(`ALTER TABLE changes RENAME TO sync_operations;`);
  db.exec(`ALTER TABLE notes DROP COLUMN revision;`);
}
