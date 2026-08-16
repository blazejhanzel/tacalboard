import { liveQuery } from 'dexie'
import { db } from './database'

export function observeNotes() {
  return liveQuery(() =>
    db.notes
      .orderBy('modifiedAt')
      .reverse()
      .toArray()
  )
}

export async function createNote(content: string) {
  const now = new Date()

  await db.notes.add({
    id: crypto.randomUUID(),
    content,
    createdAt: now,
    modifiedAt: now
  })
}

export async function updateNote(
  id: string,
  content: string
) {
  await db.notes.update(id, {
    content,
    modifiedAt: new Date()
  })
}

export async function deleteNote(id: string) {
  await db.notes.delete(id)
}