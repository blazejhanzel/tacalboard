import type { FastifyPluginAsync } from "fastify"
import { db } from "@/database/database.js"
import type { Note, SyncOperation, SyncRequest } from '@tacalboard/shared'

const syncRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: SyncRequest }>("/", async (request) => {
    db.exec('BEGIN TRANSACTION')

    try {
      // Outgoing operations are proceed first, to not proceed incoming operations as outgoing
      const response = proceedOutgoingOperations(request.body) // TODO: Brakuje w zwracanym response informacji o utworzonych notatkach jeśli wystąpił konflikt

      // Incoming operations are proceed only if request contains anything in operations array
      if (request.body.operations) {
        proceedIncomingOperations(request.body)
      }

      const lastChange = db.prepare(`
        SELECT MAX(id) AS cursor
        FROM changes
      `).get() as { cursor: number | null } | undefined

      // SyncCursor need to be updated after proceedIncomingOperations to match new operation table
      response.syncCursor = lastChange?.cursor ?? 0
      db.exec('COMMIT')
      
      return response
    }
    catch (error) {
      // On any error, nothing is saved to database and nothing is returned to client
      db.exec('ROLLBACK')
      throw error
    }
  })
}

function proceedIncomingOperations(request: SyncRequest) {
  const notesById = new Map<string, Note>(request.notes.map(note => [note.id, note]))

  for (const operation of request.operations!) {
    const entity = (() => {
      if (operation.entityType === 'note') {
        return notesById.get(operation.entityId)
      }
    })()
      
    if (operation.operation === 'delete') {
      if (!hasNewerChanges(request, operation)) {
        registerDeleteOperation(operation)
      }
    }
    else {
      if (!entity) {
        continue
      }

      if (operation.operation === 'update' && hasNewerChanges(request, operation)) {
        // If server has newest version, convert update operation to create operation
        const newId = crypto.randomUUID()
        operation.operation = 'create'
        operation.entityId = newId
        entity.id = newId
      }
  
      // operation.operation === 'create' || operation.operation === 'update'
      registerCreateUpdateOperation(operation, entity)
    }
  }
}

function proceedOutgoingOperations(request: SyncRequest): SyncRequest {
  const changes = db.prepare(`
    SELECT
      id,
      operation,
      entity_type AS entityType,
      entity_id AS entityId
    FROM changes
    WHERE id > ?
  `).all(request.syncCursor) as unknown as SyncOperation[]

  const response: SyncRequest = {
    operations: [],
    notes: [],
    syncCursor: 0
  }

  for (const change of changes) {
    response.operations?.push(change)

    if (change.operation === 'delete') {
      continue
    }

    if (change.entityType === "note") {
      response.notes.push(
        db.prepare(`
          SELECT
            id,
            content,
            created_at AS createdAt,
            modified_at AS modifiedAt
          FROM notes
          WHERE id = ?
        `).get(change.entityId) as unknown as Note
      )
    }
  }

  return response
}

function hasNewerChanges(request: SyncRequest, operation: SyncOperation): boolean {
  const newerChange = db.prepare(`
    SELECT id
    FROM changes
    WHERE entity_type = ?
      AND entity_id = ?
      AND id > ?
    LIMIT 1
  `).get(
    operation.entityType,
    operation.entityId,
    request.syncCursor
  )

  return newerChange !== undefined
}

function registerCreateUpdateOperation(operation: SyncOperation, entity: Note) {
  if (operation.entityType === "note") {
    if (operation.operation === "create") {
      createNote(entity as Note)
    }
    else if (operation.operation === "update") {
      updateNote(entity as Note)
    }
  }

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

function registerDeleteOperation(operation: SyncOperation) {
  const tableName = `${operation.entityType}s`

  const result = db.prepare(`
    DELETE FROM ${tableName}
    WHERE id = ?
  `).run(
    operation.entityId
  )

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

function createNote(note: Note) {
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
    new Date(note.createdAt).toISOString(),
    new Date(note.modifiedAt).toISOString(),
    note.revision
  )
}

function updateNote(note: Note) {
  db.prepare(`
    UPDATE notes
    SET
      content = ?,
      modified_at = ?
    WHERE id = ?
  `).run(
    note.content,
    new Date(note.modifiedAt).toISOString(),
    note.id
  )
}

export default syncRoutes