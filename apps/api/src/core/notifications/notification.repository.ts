import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class NotificationRepository {
  list(userId?: string) {
    return prisma.notification.findMany({
      ...(userId ? { where: { OR: [{ userId }, { userId: null }] } } : {}),
      orderBy: { createdAt: "desc" }
    });
  }

  findById(id: string) {
    return prisma.notification.findUnique({ where: { id } });
  }

  create(data: Parameters<typeof prisma.notification.create>[0]["data"]) {
    return prisma.notification.create({ data });
  }

  markRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });
  }
}

export const notificationRepository = new NotificationRepository();
