import type { Note } from './note.js'
import type { SyncOperation } from './syncOperation.js'

export interface SyncRequest {
  operations: SyncOperation[] | null
  notes: Note[]
  syncCursor: number
}