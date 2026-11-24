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
    readNote: (id: string): ComputedRef<Note> =>
      computed(() => {
        const note = notes.value.find((note) => note.id === id) ?? null
        if (!note) throw new Error(`Note ${id} not found`)
        return note
      }),
    updateNote,
    deleteNote,
    deleteAllNotes: async () => {
      for (const note of notes.value) await deleteNote(note.id)
    },
    pinNote: async (id: string) => await updateNote(id, { pinnedAt: new Date() }),
    unpinNote: async (id: string) => await updateNote(id, { pinnedAt: null }),
    trashNote: async (id: string) => await updateNote(id, { trashedAt: new Date() }),
    untrashNote: async (id: string) => await updateNote(id, { trashedAt: null }),
  }
}
