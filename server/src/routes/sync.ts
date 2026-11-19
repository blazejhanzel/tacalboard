import type { FastifyPluginAsync } from "fastify";
import { db } from "@/database/index.js";
import { SyncRequestSchema } from "@tacalboard/shared";
import type { Note, SyncOperation, SyncRequest } from "@tacalboard/shared";

const syncRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: unknown }>("/", async (request, reply) => {
    const result = SyncRequestSchema.safeParse(request.body);

    if (!result.success) {
      console.log(result.error.issues);
      return reply.code(400).send({
        error: "Invalid sync request",
        details: result.error.issues,
      });
    }

    const syncRequest: SyncRequest = result.data;

    db.exec("BEGIN TRANSACTION");

    try {
      const lastChangeBeforeIncomingOperations =
        (
          db
            .prepare(
              `
        SELECT MAX(id) AS cursor
        FROM sync_operations
      `,
            )
            .get() as { cursor: number | null } | undefined
        )?.cursor ?? 0;

      // Incoming operations are proceed only if request contains anything in operations array
      if (syncRequest.operations) {
        proceedIncomingOperations(syncRequest);
      }

      const response = proceedOutgoingOperations(
        syncRequest,
        lastChangeBeforeIncomingOperations,
      );

      const lastChange =
        (
          db
            .prepare(
              `
        SELECT MAX(id) AS cursor
        FROM sync_operations
      `,
            )
            .get() as { cursor: number | null } | undefined
        )?.cursor ?? 0;

      // SyncCursor need to be updated after proceedIncomingOperations to match new operation table
      response.syncCursor = lastChange;
      db.exec("COMMIT");

      return response;
    } catch (error) {
      // On any error, nothing is saved to database and nothing is returned to client
      db.exec("ROLLBACK");
      throw error;
    }
  });
};

function proceedIncomingOperations(request: SyncRequest) {
  const notesById = new Map<string, Note>(
    request.notes?.map((note: Note) => [note.id, note]) ?? [],
  );

  for (const operation of request.operations!) {
    const entity = (() => {
      switch (operation.entityType) {
        case "note":
          return notesById.get(operation.entityId);
      }
    })();

    if (operation.operation === "delete") {
      if (!hasNewerChanges(request, operation)) {
        registerDeleteOperation(operation);
      }
    } else {
      if (!entity) {
        continue;
      }

      if (
        operation.operation === "update" &&
        hasNewerChanges(request, operation)
      ) {
        // If server has newest version, convert update operation to create operation
        const newId = crypto.randomUUID();
        operation.operation = "create";
        operation.entityId = newId;
        entity.id = newId;
      }

      // operation.operation === 'create' || operation.operation === 'update'
      registerCreateUpdateOperation(operation, entity);
    }
  }
}

function proceedOutgoingOperations(
  request: SyncRequest,
  lastChange: number,
): SyncRequest {
  const changes = db
    .prepare(
      `
    SELECT
      id,
      operation,
      entity_type AS entityType,
      entity_id AS entityId
    FROM sync_operations
    WHERE
      (id > ? AND id <= ?)
      OR (id > ? AND operation = 'create')
  `,
    )
    .all(
      request.syncCursor,
      lastChange,
      lastChange,
    ) as unknown as SyncOperation[];

  const response: SyncRequest = {
    operations: [],
    notes: [],
    syncCursor: 0,
  };

  for (const change of changes) {
    response.operations?.push(change);

    if (change.operation === "delete") {
      continue;
    }

    if (change.entityType === "note") {
      const note: Note = db
        .prepare(
          `
        SELECT
          id,
          content,
          created_at AS createdAt,
          modified_at AS modifiedAt
        FROM notes
        WHERE id = ?
      `,
        )
        .get(change.entityId) as unknown as Note;

      if (note) {
        response.notes!.push(note);
      }
    }
  }

  return response;
}

function hasNewerChanges(
  request: SyncRequest,
  operation: SyncOperation,
): boolean {
  const newerChange = db
    .prepare(
      `
    SELECT id
    FROM sync_operations
    WHERE entity_type = ?
      AND entity_id = ?
      AND id > ?
    LIMIT 1
  `,
    )
    .get(operation.entityType, operation.entityId, request.syncCursor);

  return newerChange !== undefined;
}

function registerCreateUpdateOperation(operation: SyncOperation, entity: Note) {
  let effectiveOperation = operation.operation;

  if (operation.entityType === "note") {
    const exists = db
      .prepare(`SELECT 1 FROM notes WHERE id = ?`)
      .get(operation.entityId);

    effectiveOperation = exists ? "update" : "create";
    putNote(entity as Note);
  }

  db.prepare(
    `
    INSERT INTO sync_operations (
      operation,
      entity_type,
      entity_id
    ) VALUES (?, ?, ?)
  `,
  ).run(effectiveOperation, operation.entityType, operation.entityId);
}

function registerDeleteOperation(operation: SyncOperation) {
  const tableName = `${operation.entityType}s`;

  const result = db
    .prepare(
      `
    DELETE FROM ${tableName}
    WHERE id = ?
  `,
    )
    .run(operation.entityId);

  if (result.changes > 0) {
    db.prepare(
      `
      INSERT INTO sync_operations (
        operation,
        entity_type,
        entity_id
      ) VALUES (?, ?, ?)
    `,
    ).run(operation.operation, operation.entityType, operation.entityId);
  }
}

function putNote(note: Note) {
  db.prepare(
    `
    INSERT INTO notes (
      id,
      content,
      created_at,
      modified_at
    ) VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       content = excluded.content,
       created_at = excluded.created_at,
       modified_at = excluded.modified_at
  `,
  ).run(
    note.id,
    note.content,
    new Date(note.createdAt).toISOString(),
    new Date(note.modifiedAt).toISOString(),
  );
}

export default syncRoutes;
