import { z } from "zod";
import { EntitySchema } from "./entity.js";

export const NoteSchema = EntitySchema.extend({
  content: z.string(),
  pinned: z.number().nullable(),
});

export type Note = z.infer<typeof NoteSchema>;
