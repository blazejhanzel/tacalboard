import { ref, computed, type ComputedRef } from 'vue'
import { observeNotes, createNote, updateNote, deleteNote } from '@/database/notes'
import type { Note } from '@tacalboard/shared'

const notes = ref<Note[]>([])

observeNotes().subscribe({
  next: (value) => {
    notes.value = value
  },
  error: (error) => {
    console.error('Error when attempted to observe notes', error)
  },
})

export function useNotes() {
  return {
    notes,
    createNote,
    readNote: (id: string): ComputedRef<Note | null> =>
      computed(() => notes.value.find((note) => note.id === id) ?? null),
    updateNote,
    deleteNote,
    trashNote: async (id: string) => await updateNote(id, { trashedAt: new Date() }),
    untrashNote: async (id: string) => await updateNote(id, { trashedAt: null }),
    deleteAllNotes: async () => {
      for (const note of notes.value) await deleteNote(note.id)
    },
  }
}
