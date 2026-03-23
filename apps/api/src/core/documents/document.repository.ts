import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class DocumentRepository {
  list(filters?: { moduleName?: string; entityType?: string; entityId?: string }) {
    return prisma.documentAttachment.findMany({
      ...(filters
        ? {
            where: {
              ...(filters.moduleName ? { moduleName: filters.moduleName as never } : {}),
              ...(filters.entityType ? { entityType: filters.entityType } : {}),
              ...(filters.entityId ? { entityId: filters.entityId } : {})
            }
          }
        : {}),
      orderBy: { createdAt: "desc" }
    });
  }

  findById(id: string) {
    return prisma.documentAttachment.findUnique({ where: { id } });
  }

  create(data: Parameters<typeof prisma.documentAttachment.create>[0]["data"]) {
    return prisma.documentAttachment.create({ data });
  }
}

export const documentRepository = new DocumentRepository();
