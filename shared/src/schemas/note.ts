import { z } from "zod";
import { EntitySchema, type Entity } from "./entity.js";

export const NoteSchema = EntitySchema.extend({
  content: z.string(),
});

export type Note = z.infer<typeof NoteSchema>;
