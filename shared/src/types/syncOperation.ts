// Describes operation, what changed on client or server, step by step
// ID is incrementaly changed on every change in database (eg. notes)

export type Operation = 'create' | 'update' | 'delete'
export type EntityType = 'note'

export interface SyncOperation {
  id: number
  operation: Operation
  entityType: EntityType
  entityId: string
  baseRevision: number
}