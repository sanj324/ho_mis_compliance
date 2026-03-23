import { z } from "zod";

export const createRequisitionSchema = z.object({
  branchId: z.string().uuid(),
  vendorId: z.string().uuid().optional(),
  requisitionDate: z.string(),
  remarks: z.string().max(255).optional(),
  items: z.array(
    z.object({
      itemId: z.string().uuid(),
      quantity: z.number().positive()
    })
  ).min(1)
});
