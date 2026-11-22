// IndexedDB access is provided by Dexie.js library

import { Dexie, type EntityTable } from 'dexie'
import type { Note, SyncOperation } from '@tacalboard/shared'

interface KeyValuePair {
  key: string
  value: string | number
}

export const db = new Dexie('tacalboard') as Dexie & {
  notes: EntityTable<Note, 'id'>
  syncOperations: EntityTable<SyncOperation, 'id'>
  appStates: EntityTable<KeyValuePair, 'key'>
}

// Initial database
db.version(1).stores({
  notes: 'id, createdAt, modifiedAt',
  syncOperations: '++id, [entityType+entityId]',
  systemStatuses: 'key, value',
})

// Changed systemStatuses to appStates (changed naming convention)
db.version(2)
  .stores({
    appStates: 'key',
    notes: 'id, createdAt, modifiedAt',
    syncOperations: '++id, [entityType+entityId]',
    systemStatuses: null,
  })
  .upgrade(async (tx) => {
    const oldData = await tx.table('systemStatuses').toArray()
    await tx.table('appStates').bulkPut(oldData)
  })

// Implemented trash and pin/mark
db.version(3).stores({
  appStates: 'key',
  notes: 'id, createdAt, modifiedAt, trashedAt, pinned',
  syncOperations: '++id, [entityType+entityId]',
})
