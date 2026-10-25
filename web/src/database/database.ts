// IndexedDB access is provided by Dexie.js library

import { Dexie, type EntityTable } from 'dexie'
import type { KeyValuePair, Note, SyncOperation } from '@tacalboard/shared'

export const db = new Dexie('tacalboard') as Dexie & {
  notes: EntityTable<Note, 'id'>
  syncOperations: EntityTable<SyncOperation, 'id'>
  syncStatuses: EntityTable<KeyValuePair, 'key'>
}

db.version(1).stores({
  notes: 'id, createdAt, modifiedAt',
  syncOperations: '++id, [entityType+entityId]',
  syncStatuses: 'key, value',
})