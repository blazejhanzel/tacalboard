import { z } from "zod";
import { NoteSchema, type Note } from "./note";
import { SyncOperationSchema } from "./syncOperation";

export const SyncRequestSchema = z.object({
  operations: SyncOperationSchema.array(),
  notes: NoteSchema.array().nullable(),
  syncCursor: z.number(),
});

export type SyncRequest = z.infer<typeof SyncRequestSchema>;
