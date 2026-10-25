import { liveQuery } from 'dexie'
import { db } from './database'
import { registerOperation } from './syncOperations'

export function observeNotes() {
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

  await db.notes.add({
    id,
    content,
    createdAt: now,
    modifiedAt: now,
    revision: 0
  })

  await registerOperation('create', 'note', id)
}

export async function readNote(id: string) {
  return db.notes.get(id)
}

export async function updateNote(id: string, content: string) {
  const note = await readNote(id)
  const revision = (() => {
    if (note && note.revision != null) {
      return note.revision + 1
    }
    return 0
  })()

  await db.notes.update(id, {
    content,
    modifiedAt: new Date(),
    revision
  })

  await registerOperation('update', 'note', id)
}

export async function deleteNote(id: string) {
  await db.notes.delete(id)
  await registerOperation('delete', 'note', id)
}