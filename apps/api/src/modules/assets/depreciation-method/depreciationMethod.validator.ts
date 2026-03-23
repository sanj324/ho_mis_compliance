import { z } from "zod";

export const createDepreciationMethodSchema = z.object({
  code: z.string().min(2).max(20),
  name: z.string().min(2).max(120),
  calculationType: z.enum(["STRAIGHT_LINE", "WRITTEN_DOWN"])
});
