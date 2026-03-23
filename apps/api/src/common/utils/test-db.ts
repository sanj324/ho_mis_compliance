import type { PrismaClient } from "@prisma/client";

let prismaClient: PrismaClient | null = null;

export const ensureTestEnvironment = (): void => {
  process.env.NODE_ENV ??= "test";
  process.env.API_PREFIX ??= "/api";
  process.env.CORS_ORIGIN ??= "http://localhost:5173";
  process.env.JWT_ACCESS_SECRET ??= "test-access-secret-1234567890";
  process.env.JWT_REFRESH_SECRET ??= "test-refresh-secret-1234567890";
  process.env.JWT_ACCESS_TTL_MINUTES ??= "30";
  process.env.JWT_REFRESH_TTL_DAYS ??= "7";
  process.env.DATABASE_URL ??= "postgresql://postgres:postgres@localhost:5432/ho_mis_test?schema=public";
};

export const getTestDb = async (): Promise<PrismaClient> => {
  ensureTestEnvironment();

  if (!prismaClient) {
    const { PrismaClient } = await import("@prisma/client");
    prismaClient = new PrismaClient();
  }

  return prismaClient;
};

export const resetDatabase = async (): Promise<void> => {
  const prisma = await getTestDb();
  const tables = await prisma.$queryRawUnsafe<Array<{ tablename: string }>>(
    "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'"
  );

  if (!tables.length) {
    return;
  }

  const tableNames = tables.map(({ tablename }) => `"public"."${tablename}"`).join(", ");
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`);
};

export const seedTestDatabase = async (): Promise<void> => {
  const prisma = await getTestDb();
  const { seedDatabase } = await import("../../../prisma/seed.js");
  await seedDatabase(prisma);
};

export const prepareTestDatabase = async (): Promise<void> => {
  await resetDatabase();
  await seedTestDatabase();
};

export const disconnectTestDb = async (): Promise<void> => {
  if (!prismaClient) {
    return;
  }

  await prismaClient.$disconnect();
  prismaClient = null;
};
