import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class AuditRepository {
  create(data: Prisma.AuditLogCreateInput) {
    return prisma.auditLog.create({ data });
  }

  list() {
    return prisma.auditLog.findMany({
      include: {
        user: true,
        branch: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 100
    });
  }
}

export const auditRepository = new AuditRepository();
