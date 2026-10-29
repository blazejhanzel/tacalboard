import { readonly, ref } from 'vue'
import { db } from '../database/database'
import type { Entity, Note, SyncOperation, SyncRequest } from '@tacalboard/shared'
import type { SyncStatus } from '@/types/syncStatus'
import type { Table } from 'dexie'

const syncStatus = ref<SyncStatus>('synced')

async function sync() {
  if (syncStatus.value === 'syncing') {
    // If sync operation is pending, don't force syncing again
    return
  }

  syncStatus.value = 'syncing'

  const request = await prepareRequest()
  console.log(request) // TODO: Temporary for testing
  const response = await sendRequest(request)

  if (!response.ok) {
    throw new Error(`Sync failed: ${response.status}`)
  }

  // Remove pending syncOperations which were send to server and then proceed response
  await db.syncOperations.bulkDelete(request.operations?.map(op => op.id!) ?? [])
  await proceedResponse(response)

  await updateSyncStatus()
}

async function prepareRequest(): Promise<SyncRequest> {
  const request: SyncRequest = {
    operations: await db.syncOperations.toArray(),
    notes: [],
    syncCursor: Number((await db.systemStatuses.get('syncCursor'))?.value ?? 0)
  }

  for (const operation of request.operations ?? []) {
    if (operation.operation === 'create' || operation.operation === 'update') {
      if (operation.entityType === 'note') {
        const note = await db.notes.get(operation.entityId)
  
        if (note) {
          request.notes.push(note)
        }
      }
    }
  }

  return request
}

async function sendRequest(bodyJson: Object) {
  const response = await fetch('/api/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyJson)
  })

  return response
}

async function proceedResponse(response: Response) {
  // TODO: Zaimplementować synchronizację zwrotną
  const data: SyncRequest = await response.json()
  console.log(data) // TODO: Temporary for testing

  for (const note of data.notes) {
    note.createdAt = new Date(note.createdAt)
    note.modifiedAt = new Date(note.modifiedAt)
  }
  
  await db.transaction(
    'rw',
    db.notes,
    db.systemStatuses,
    db.syncOperations,
    async () => {
      if (data.operations) {
        await proceedIncomingOperations(data)
      }
    
      // Clear pending operations
      await db.systemStatuses.put({
        key: 'syncCursor',
        value: String(data.syncCursor)
      })
    }
  )

  // TODO: Usunąć wszystkie pola revision z baz i typów notatek
}

async function proceedIncomingOperations(request: SyncRequest) {
  const notesById = new Map<string, Note>(request.notes.map(note => [note.id, note]))

  for (const operation of request.operations!) {
    const entity = (() => {
      if (operation.entityType === 'note') {
        return notesById.get(operation.entityId)
      }
    })()

    if (operation.operation === 'delete') {
      if (await hasNewerChanges(operation)) {
        registerEntityAsNewlyCreated(operation.entityType, operation.entityId, crypto.randomUUID())
      }
      else {
        registerDeleteOperation(operation)
      }
    }
    else {
      if (!entity) {
        continue
      }

      if (operation.operation === 'update' && await hasNewerChanges(operation)) {
        // If server has newest version, convert update operation to create operation
        const newId = crypto.randomUUID()
        operation.operation = 'create'
        operation.entityId = newId
        entity.id = newId
      }
  
      // operation.operation === 'create' || operation.operation === 'update'
      registerCreateUpdateOperation(operation.entityType, entity)
    }
  }
}

async function hasNewerChanges(operation: SyncOperation): Promise<boolean> {
  return await db.syncOperations
    .where('[entityType+entityId]')
    .equals([operation.entityType, operation.entityId])
    .count() > 0
}

async function registerEntityAsNewlyCreated(
  entityType: SyncOperation['entityType'],
  oldEntityId: string,
  newEntityId: string
): Promise<void> {
  const tableName = `${entityType}s`
  const entityTable = db.table(tableName)
  const entity = await entityTable.get(oldEntityId)

  if (!entity) {
    throw new Error(`Entity not found: ${entityType} with id ${oldEntityId}`)
  }

  // Zmień ID encji
  await entityTable.delete(oldEntityId)
  await entityTable.put({
    ...entity,
    id: newEntityId
  })

  await db.syncOperations
    .where('[entityType+entityId]')
    .equals([entityType, oldEntityId])
    .modify({ entityId: newEntityId, operation: 'create' })
}

async function registerCreateUpdateOperation<T extends Entity>(
  entityType: SyncOperation['entityType'],
  entity: T
): Promise<void> {
  const table = db.table(`${entityType}s`) as Table<T, string>

  await table.put(entity)
}

async function registerDeleteOperation(operation: SyncOperation) {
  const tableName = `${operation.entityType}s`
  const entityTable = db.table(tableName)
  await entityTable.delete(operation.entityId)
}

async function updateSyncStatus() {
  const count = await db.syncOperations.count()

  if (count > 0) {
    syncStatus.value = 'not-synced'
  } else {
    syncStatus.value = 'synced'
  }
}

function initializeSync() {
  updateSyncStatus()
}

export function useSync() {
  return {
    syncStatus: readonly(syncStatus),
    sync,
    initializeSync,
    updateSyncStatus
  }
}
