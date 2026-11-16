import { ref } from 'vue'
import { db } from '@/database/database'
import { registerOperation } from '@/database/syncOperations'
import { normalizeNote } from '@/database/notes'

const importMode = ref<'replace' | 'append'>('replace')
const selectedFile = ref<File | null>(null)

async function exportToFile() {
  const tablesToExport = ['notes']
  const data: Record<string, unknown[]> = {}

  for (const tableName of tablesToExport) {
    data[tableName] = await db.table(tableName).toArray()
  }

  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: 'application/json' }
  );

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const date = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)

  a.href = url
  a.download = `tacalboard-${date}.json`
  a.click()

  URL.revokeObjectURL(url)
}

async function importFromFile(): Promise<boolean> {
  if (!selectedFile.value || !importMode.value)
    return false

  try {
    const json = JSON.parse(await selectedFile.value.text())

    await db.transaction('rw', db.notes, db.syncOperations, db.systemStatuses, async () => {
      if (importMode.value === 'replace') {
        await db.systemStatuses.put({
          key: 'syncCursor',
          value: 0
        })
        await db.syncOperations.clear()
        await db.notes.clear()
      }

      for (const note of json.notes) {
        await db.notes.put(normalizeNote(note))
        await registerOperation('create', 'note', note.id)
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
    selectedFile
  }
}