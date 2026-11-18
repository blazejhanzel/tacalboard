import { z } from "zod";

export const EntitySchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  modifiedAt: z.coerce.date(),
});

export type Entity = z.infer<typeof EntitySchema>;
