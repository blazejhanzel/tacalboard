import { z } from "zod";
import { EntitySchema } from "./entity.js";

export const NoteSchema = EntitySchema.extend({
  content: z.string(),
  pinnedAt: z.coerce.date().nullable(),
});

export type Note = z.infer<typeof NoteSchema>;
