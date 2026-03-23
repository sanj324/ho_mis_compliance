import { z } from "zod";

export const createBrokerSchema = z.object({
  code: z.string().min(2).max(30),
  name: z.string().min(3).max(120),
  registrationNo: z.string().max(60).optional()
});
