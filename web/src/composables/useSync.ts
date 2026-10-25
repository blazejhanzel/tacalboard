import { readonly, ref } from 'vue'
import { db } from '../database/database'
import type { SyncRequest } from '@tacalboard/shared'
import type { SyncStatus } from '@/types/syncStatus'

const syncStatus = ref<SyncStatus>('synced')

async function sync() {
  syncStatus.value = 'syncing'

  const operations = await db.syncOperations.toArray()
  const syncStatuses = await db.syncStatuses.toArray()
  const cursor = syncStatuses[0]?.value | null // TODO: Check cursor set
  
  const request: SyncRequest = {
    operations,
    notes: [],
    cursor
  }

  for (const operation of operations) {
    if (operation.operation === 'create' || operation.operation === 'update') {
      if (operation.entityType === 'note') {
        const note = await db.notes.get(operation.entityId)
  
        if (note) {
          request.notes.push(note)
        }
      }
    }
  }

  console.log(request)
  //const response = await proceedResponse(await sendRequest(request))

  await updateSyncStatus()
}

async function fullSync() {
  const request: SyncRequest = {
    operations: await db.syncOperations.toArray(),
    notes: await db.notes.toArray(),
    cursor: null
  }

  const response = await proceedResponse(await sendRequest(request))

  await updateSyncStatus()
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
  if (!response.ok) {
    throw new Error(`Sync failed: ${response.status}`)
  }

  return response.json()
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
    initializeSync
  }
}
