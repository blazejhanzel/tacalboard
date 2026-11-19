import { z } from "zod";

export const BuildChannelSchema = z.enum([
  "release", // Release are all builds from v* tags
  "nightly", // Nightly are all build from master branch or triggered manually
  "dev", // Dev are builds from the rest and app run in dev mode locally on developers PC
]);

export const AppMetadataSchema = z.object({
  version: z.string(),
  buildChannel: BuildChannelSchema,
  buildNumber: z.string().optional(),
  commitSha: z.string(),
  productionBuild: z.boolean(),
  versionString: z.string(),
});

export type BuildChannel = z.infer<typeof BuildChannelSchema>;
export type AppMetadata = z.infer<typeof AppMetadataSchema>;
