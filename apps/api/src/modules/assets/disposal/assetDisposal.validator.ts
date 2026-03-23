import { z } from "zod";

export const createAssetDisposalSchema = z.object({
  assetId: z.string().uuid(),
  disposalDate: z.string(),
  disposalValue: z.number().nonnegative(),
  reason: z.string().max(255).optional()
});
