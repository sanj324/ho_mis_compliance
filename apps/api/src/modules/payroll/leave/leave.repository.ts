import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class LeaveRepository {
  findMany(employeeId?: string) {
    return prisma.leaveRecord.findMany({
      ...(employeeId ? { where: { employeeId } } : {}),
      include: {
        employee: true
      },
      orderBy: {
        startDate: "desc"
      }
    });
  }

  create(data: Prisma.LeaveRecordCreateInput) {
    return prisma.leaveRecord.create({
      data,
      include: {
        employee: true
      }
    });
  }
}

export const leaveRepository = new LeaveRepository();
