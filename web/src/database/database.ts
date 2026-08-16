import { Dexie, type EntityTable } from 'dexie'
import type { Note } from '@tacalboard/shared';

export const db = new Dexie('tacalboard') as Dexie & {
  notes: EntityTable<Note, 'id'>
}

db.version(1).stores({
  notes: 'id, createdAt, modifiedAt'
})