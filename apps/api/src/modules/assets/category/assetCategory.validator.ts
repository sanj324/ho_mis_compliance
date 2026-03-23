import { z } from "zod";

export const createAssetCategorySchema = z.object({
  code: z.string().min(2).max(20),
  name: z.string().min(2).max(120),
  usefulLifeMonths: z.number().int().positive()
});
