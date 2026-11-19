import { ref } from 'vue'
import { db } from '@/database'
import { registerOperation } from '@/database/syncOperations'
import { BackupFileSchema, type BackupFile } from '@/schemas/backupFile'
import { deleteNote, getAllNotes } from '@/database/notes'

const importMode = ref<'replace' | 'append' | null>(null)
const importFile = ref<File | null>(null)

async function download() {
  const data: BackupFile = {
    notes: await getAllNotes(),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const date = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)

  a.href = url
  a.download = `tacalboard-${date}.json`
  a.click()

  URL.revokeObjectURL(url)
}

async function upload(): Promise<boolean> {
  if (!importFile.value || !importMode.value) return false

  try {
    const json: unknown = JSON.parse(await importFile.value.text())
    const data: BackupFile = BackupFileSchema.parse(json)

    await db.transaction('rw', db.notes, db.syncOperations, db.appStates, async () => {
      if (importMode.value === 'replace') {
        for (const note of await getAllNotes()) {
          deleteNote(note.id)
        }
      }

      for (const note of data.notes) {
        const noteToPut = note

        if (importMode.value === 'append') {
          noteToPut.id = crypto.randomUUID()
        }

        // TODO: Should be changes to use notes.ts crud operations
        await db.notes.put(noteToPut)
        await registerOperation('update', 'note', noteToPut.id)
      }
    })
  } catch (error) {
    console.log(error)
    throw error
  }

  return true
}

export function useBackup() {
  return {
    download,
    upload,
    importMode,
    importFile,
  }
}
