import { z } from "zod";

export const createItemSchema = z.object({
  itemCode: z.string().min(2).max(30),
  itemName: z.string().min(2).max(150),
  itemCategoryId: z.string().uuid(),
  unitOfMeasure: z.string().min(1).max(20),
  reorderLevel: z.number().nonnegative(),
  maxLevel: z.number().nonnegative(),
  gstRate: z.number().nonnegative()
});
