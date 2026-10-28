import { db } from './database'
import { useSync } from '@/composables/useSync'

import type { Operation, EntityType } from '@tacalboard/shared'

export async function registerOperation(operation: Operation, entityType: EntityType, entityId: string) {
  const existing = await db.syncOperations
    .where('[entityType+entityId]')
    .equals([entityType, entityId])
    .first()
  
  let baseRevision = await getRevisionOfEntity(entityType, entityId)

  if (existing) {
    if (existing.operation === 'create' && operation === 'delete') {
      await db.syncOperations.delete(existing.id)
      return
    }

    baseRevision = existing.baseRevision
    await db.syncOperations.delete(existing.id)
  }

  await db.syncOperations.add({
    operation,
    entityType,
    entityId,
    baseRevision
  })

  useSync().updateSyncStatus()
}

async function getRevisionOfEntity(entityType: EntityType, entityId: string) {
  const database = (() => {
    if (entityType === 'note') {
      return db.notes
    }
  })()

  const entity = await database?.where('id').equals(entityId).first()

  return entity?.revision ?? 0
}
