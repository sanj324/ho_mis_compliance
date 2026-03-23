import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  PORT: z.coerce.number().default(4000),
  API_PREFIX: z.string().default("/api"),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_TTL_MINUTES: z.coerce.number().default(30),
  JWT_REFRESH_TTL_DAYS: z.coerce.number().default(7),
  CORS_ORIGIN: z.string().default("http://localhost:5173")
});

export const env = schema.parse(process.env);
