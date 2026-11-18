import { z } from "zod";

export const KeyValuePairSchema = z.object({
  key: z.string(),
  value: z.union([z.string(), z.number()]),
});

export type KeyValuePair = z.infer<typeof KeyValuePairSchema>;
