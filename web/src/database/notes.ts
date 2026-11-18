import { liveQuery, type Observable } from 'dexie'
import { db } from './database'
import { registerOperation } from './syncOperations'
import { type Note } from '@tacalboard/shared'

export function observeNotes(): Observable<Note[]> {
  return liveQuery(() =>
    db.notes
      .orderBy('modifiedAt')
      .reverse()
      .toArray()
  )
}

export async function createNote(content: string) {
  const id = crypto.randomUUID()
  const now = new Date()
  const note: Note = {
    id,
    content,
    createdAt: now,
    modifiedAt: now,
  }

  await db.notes.add(note)
  await registerOperation('create', 'note', id)
}

export async function readNote(id: string): Promise<Note | undefined> {
  return db.notes.get(id)
}

export async function updateNote(id: string, content: string) {
  await db.notes.update(id, {
    content,
    modifiedAt: new Date(),
  })

  await registerOperation('update', 'note', id)
}

export async function deleteNote(id: string) {
  await db.notes.delete(id)
  await registerOperation('delete', 'note', id)
}
