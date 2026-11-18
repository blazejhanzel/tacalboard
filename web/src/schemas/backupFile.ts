import { z } from 'zod'
import { NoteSchema } from '@tacalboard/shared'

export const BackupFileSchema = z.object({
  notes: z.array(NoteSchema),
})

export type BackupFile = z.infer<typeof BackupFileSchema>;