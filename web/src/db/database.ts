import { Dexie, type EntityTable } from 'dexie'

export interface Note {
  id: string
  text: string
  createdAt: Date
  modifiedAt: Date
}

export const db = new Dexie('tacalboard') as Dexie & {
  notes: EntityTable<Note, 'id'>
}

db.version(1).stores({
  notes: 'id, createdAt, modifiedAt'
})