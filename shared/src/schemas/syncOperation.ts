import { z } from "zod";

export const OperationSchema = z.enum(["create", "update", "delete"]);
export const EntityTypeSchema = z.enum(["note"]);

export const SyncOperationSchema = z.object({
  id: z.number(),
  operation: OperationSchema,
  entityType: EntityTypeSchema,
  entityId: z.string(),
});

export const NewSyncOperationSchema = SyncOperationSchema.omit({
  id: true,
});

export type Operation = z.infer<typeof OperationSchema>;
export type EntityType = z.infer<typeof EntityTypeSchema>;
export type SyncOperation = z.infer<typeof SyncOperationSchema>;
export type NewSyncOperation = z.infer<typeof NewSyncOperationSchema>;
