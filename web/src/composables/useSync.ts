import { readonly, ref } from 'vue'
import { db } from '@/database'
import { SyncRequestSchema } from '@tacalboard/shared'
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

  try {
    const request = await prepareRequest()
    const response = await sendRequest(request)

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status}`)
    }

    // Remove pending syncOperations which were send to server and then proceed response
    await db.syncOperations.bulkDelete(request.operations?.map((op) => op.id!) ?? [])
    await proceedResponse(response)

    await updateSyncStatus() // TODO: Zmienić nazwę albo ogólnie sposób podliczania tego na realtime, ta funkcja jest źle opisana
  } catch (error) {
    syncStatus.value = 'sync-failed'
    throw error
  }
}

async function prepareRequest(): Promise<SyncRequest> {
  const request: SyncRequest = {
    operations: await db.syncOperations.toArray(),
    notes: [],
    syncCursor: Number((await db.appStates.get('syncCursor'))?.value ?? 0),
  }

  for (const operation of request.operations ?? []) {
    if (operation.operation === 'create' || operation.operation === 'update') {
      switch (operation.entityType) {
        case 'note': {
          const note = await db.notes.get(operation.entityId)
          if (note) request.notes!.push(note)
          continue
        }
      }
    }
  }

  return request
}

async function sendRequest(body: SyncRequest): Promise<Response> {
  const response = await fetch('/api/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  return response
}

async function proceedResponse(response: Response): Promise<void> {
  const rawData: unknown = await response.json()
  const data: SyncRequest = SyncRequestSchema.parse(rawData)

  await db.transaction('rw', db.notes, db.appStates, db.syncOperations, async () => {
    if (data.operations) {
      await proceedIncomingOperations(data)
    }

    // Set new syncCursor corelated with server response
    await db.appStates.put({
      key: 'syncCursor',
      value: String(data.syncCursor),
    })
  })

  // TODO: Usunąć wszystkie pola revision z baz i typów notatek
}

async function proceedIncomingOperations(request: SyncRequest): Promise<void> {
  const notesById = new Map<string, Note>(request.notes?.map((note) => [note.id, note]) ?? [])

  for (const operation of request.operations!) {
    const entity = (() => {
      switch (operation.entityType) {
        case 'note':
          return notesById.get(operation.entityId)
      }
    })()

    if (operation.operation === 'delete') {
      if (await hasNewerChanges(operation)) {
        await registerEntityAsNewlyCreated(
          operation.entityType,
          operation.entityId,
          crypto.randomUUID(),
        )
      } else {
        await registerDeleteOperation(operation)
      }
    } else {
      if (!entity) {
        continue
      }

      if (operation.operation === 'update' && (await hasNewerChanges(operation))) {
        // If server has newest version, convert update operation to create operation
        const newId = crypto.randomUUID()
        operation.operation = 'create'
        operation.entityId = newId
        entity.id = newId
      }

      // operation.operation === 'create' || operation.operation === 'update'
      await registerCreateUpdateOperation(operation.entityType, entity)
    }
  }
}

async function hasNewerChanges(operation: SyncOperation): Promise<boolean> {
  return (
    (await db.syncOperations
      .where('[entityType+entityId]')
      .equals([operation.entityType, operation.entityId])
      .count()) > 0
  )
}

async function registerEntityAsNewlyCreated(
  entityType: SyncOperation['entityType'],
  oldEntityId: string,
  newEntityId: string,
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
    id: newEntityId,
  })

  await db.syncOperations
    .where('[entityType+entityId]')
    .equals([entityType, oldEntityId])
    .modify({ entityId: newEntityId, operation: 'create' })
}

async function registerCreateUpdateOperation<T extends Entity>(
  entityType: SyncOperation['entityType'],
  entity: T,
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
    updateSyncStatus,
  }
}
