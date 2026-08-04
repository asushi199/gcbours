import { z } from "zod";

export const UnlockPayloadSchema = z.object({
  code: z.string().min(1).max(32),
});

export type UnlockPayload = z.infer<typeof UnlockPayloadSchema>;
