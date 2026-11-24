import { liveQuery, type Observable } from 'dexie'
import { db } from '.'
import { registerOperation } from './syncOperations'
import { type Note } from '@tacalboard/shared'

export function observeNotes(): Observable<Note[]> {
  return liveQuery(() => db.notes.orderBy('modifiedAt').reverse().toArray())
}

export async function createNote(content: string) {
  const id = crypto.randomUUID()
  const now = new Date()
  const note: Note = {
    id,
    content,
    createdAt: now,
    modifiedAt: now,
    trashedAt: null,
    pinnedAt: null,
  }

  await db.notes.add(note)
  await registerOperation('create', 'note', id)
}

export async function readNote(id: string): Promise<Note | undefined> {
  return await db.notes.get(id)
}

export async function updateNote(
  id: string,
  changes: Partial<Pick<Note, 'content' | 'pinnedAt' | 'trashedAt'>>,
) {
  const excludedFields = ['pinnedAt'] as const
  const shouldUpdateModifiedAt = !excludedFields.some((field) => field in changes)

  await db.notes.update(id, {
    ...changes,
    ...(shouldUpdateModifiedAt && { modifiedAt: new Date() }),
  })

  await registerOperation('update', 'note', id)
}

export async function deleteNote(id: string) {
  await db.notes.delete(id)
  await registerOperation('delete', 'note', id)
}
