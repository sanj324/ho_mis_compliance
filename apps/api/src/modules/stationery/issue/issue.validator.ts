import { z } from "zod";

export const createIssueSchema = z.object({
  branchId: z.string().uuid(),
  issueDate: z.string(),
  issueReason: z.string().min(2).max(255),
  items: z.array(
    z.object({
      itemId: z.string().uuid(),
      quantity: z.number().positive()
    })
  ).min(1)
});
