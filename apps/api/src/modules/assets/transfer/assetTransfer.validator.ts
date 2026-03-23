import { z } from "zod";

export const createAssetTransferSchema = z.object({
  assetId: z.string().uuid(),
  fromBranchId: z.string().uuid(),
  toBranchId: z.string().uuid(),
  transferDate: z.string(),
  reason: z.string().min(2).max(255)
});
