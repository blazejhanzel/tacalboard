import type { FastifyPluginAsync } from "fastify"
import { db } from "@/database/database.js"
import type { Note, SyncOperation, SyncRequest } from '@tacalboard/shared'

let notesById = new Map<string, Note>

const syncRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: SyncRequest }>("/", async (request) => {
    // TODO: Mam już wysyłanie requesta, teraz trzeba go przetworzyć gdy serwer go dostanie
    db.exec('BEGIN TRANSACTION')

    notesById = new Map<string, Note>(
      request.body.notes.map(note => [note.id, note])
    )

    try {
      if (request.body.operations) {
        for (const operation of request.body.operations) {
          if (operation.operation === 'delete') {
            registerDeleteOperation(operation)
          }
          else {
            proceedCreateUpdateOperation(operation)
          }
        }
      }

      if (request.body.cursor) { // Partial sync
        
      } else { // Full sync

      }

      db.exec('COMMIT')
    }
    catch (error) {
      db.exec('ROLLBACK')
      throw error
    }

    const notes = db
      .prepare('SELECT id, content, created_at, modified_at FROM notes')
      .all()

    const cursor = db
      .prepare('SELECT MAX(sequence) AS cursor FROM changes')
      .get() as { cursor: number | null }

    return {
      notes,
      cursor
    }
  })
}

function proceedCreateUpdateOperation(operation: SyncOperation) {
  if (operation.entityType === 'note') {
    const note = notesById.get(operation.entityId)

    if (!note) return

    const existing = db.prepare(`
      SELECT id, content, created_at, modified_at, revision
      FROM notes
      WHERE id = ?
    `).get(note.id) as Note | undefined

    if (existing) {
      if (operation.baseRevision === existing.revision) { // no conflict
        registerUpdatedNote(existing, note)
      }
      else { // conflict

      }
    }
    else {
      registerCreatedNote(note)
    }
  }
}

function registerCreatedNote(note: Note) {
  db.prepare(`
    INSERT INTO notes (
      id,
      content,
      created_at,
      modified_at,
      revision
    ) VALUES (?, ?, ?, ?, ?)
  `).run(
    note.id,
    note.content,
    note.createdAt.toISOString(),
    note.modifiedAt.toISOString(),
    note.revision
  )

  db.prepare(`
    INSERT INTO changes (
      operation,
      entity_type,
      entity_id
    ) VALUES (?, ?, ?)
  `).run(
    'create',
    'note',
    note.id
  )
}

function registerUpdatedNote(existing: Note, updated: Note) {
  const newRevision = existing.revision + 1

  db.prepare(`
    UPDATE notes
    SET
      content = ?,
      modified_at = ?,
      revision = ?
    WHERE id = ?
  `).run(
    updated.content,
    updated.modifiedAt.toISOString(),
    newRevision,
    updated.id
  )

  db.prepare(`
    INSERT INTO changes (
      entity_type,
      entity_id,
      operation
    ) VALUES (?, ?, ?)
  `).run(
    'note',
    updated.id,
    'update'
  )
}

function registerDeleteOperation(operation: SyncOperation) {
  const result = db.prepare(`
    DELETE FROM notes
    WHERE id = ?
  `).run(operation.entityId)

  if (result.changes > 0) {
    db.prepare(`
      INSERT INTO changes (
        operation,
        entity_type,
        entity_id
      ) VALUES (?, ?, ?)
    `).run(
      operation.operation,
      operation.entityType,
      operation.entityId
    )
  }
}

export default syncRoutes