import { z } from "zod";
import { NoteSchema, type Note } from "./note.js";
import { SyncOperationSchema } from "./syncOperation.js";

export const SyncRequestSchema = z.object({
  operations: SyncOperationSchema.array(),
  notes: NoteSchema.array().nullable(),
  syncCursor: z
    .union([z.number(), z.string().regex(/^\d+$/).transform(Number)])
    .pipe(z.int().nonnegative()),
});

export type SyncRequest = z.infer<typeof SyncRequestSchema>;
