import { ref } from 'vue'
import { db } from '@/database/database'
import { registerOperation } from '@/database/syncOperations'
import { BackupFileSchema, type BackupFile } from '@/schemas/backupFile'

const importMode = ref<'replace' | 'append'>('replace')
const selectedFile = ref<File | null>(null)

async function exportToFile() {
  const tablesToExport = ['notes']
  const data: BackupFile = {
    notes: [],
  }

  for (const tableName of tablesToExport) {
    data.notes = await db.table(tableName).toArray()
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

async function importFromFile(): Promise<boolean> {
  if (!selectedFile.value || !importMode.value) return false

  // TODO: Zweryfikować tryby replace i append, zastosować to odpowiednio jeśli baza korzysta też z synchronizacji z serwerem

  try {
    const json: unknown = JSON.parse(await selectedFile.value.text())
    const data: BackupFile = BackupFileSchema.parse(json)

    await db.transaction('rw', db.notes, db.syncOperations, db.appStates, async () => {
      if (importMode.value === 'replace') {
        await db.appStates.put({
          key: 'syncCursor',
          value: 0,
        })
        await db.syncOperations.clear()
        await db.notes.clear()
      }

      for (const note of data.notes) {
        await db.notes.put(note)
        await registerOperation('update', 'note', note.id)
      }
    })
  } catch (error) {
    console.log(error)
    throw error
  }

  return true
}

export function useDatabase() {
  return {
    exportToFile,
    importFromFile,
    importMode,
    selectedFile,
  }
}
