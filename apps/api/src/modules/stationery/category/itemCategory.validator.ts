import { z } from "zod";

export const createItemCategorySchema = z.object({
  code: z.string().min(2).max(20),
  name: z.string().min(2).max(120)
});
