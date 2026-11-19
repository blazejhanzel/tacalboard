import { db } from '.'
import { useSync } from '@/composables/useSync'

import type { Operation, EntityType, NewSyncOperation } from '@tacalboard/shared'

export async function registerOperation(
  operation: Operation,
  entityType: EntityType,
  entityId: string,
) {
  await db.transaction('rw', db.syncOperations, async () => {
    const existing = await db.syncOperations
      .where('[entityType+entityId]')
      .equals([entityType, entityId])
      .first()

    const syncOperation: NewSyncOperation = {
      operation,
      entityType,
      entityId,
    }

    if (existing) {
      if (existing.operation === 'create' && operation === 'delete') {
        await db.syncOperations.delete(existing.id)
        return
      }

      await db.syncOperations.delete(existing.id)
    }

    await db.syncOperations.add(syncOperation)
  })

  useSync().updateSyncStatus()
}
