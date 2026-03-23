import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AttendanceRepository {
  findMany(filters: { branchId?: string; month?: number; year?: number }) {
    return prisma.attendanceRecord.findMany({
      where: {
        ...(filters.branchId ? { branchId: filters.branchId } : {}),
        ...(filters.month && filters.year
          ? {
              attendanceDate: {
                gte: new Date(Date.UTC(filters.year, filters.month - 1, 1)),
                lt: new Date(Date.UTC(filters.year, filters.month, 1))
              }
            }
          : {})
      },
      include: {
        employee: true
      },
      orderBy: {
        attendanceDate: "desc"
      }
    });
  }

  upsertMany(records: Array<{ employeeId: string; branchId: string; attendanceDate: Date; status: string; attendanceUnits: number }>) {
    return prisma.$transaction(
      records.map((record) =>
        prisma.attendanceRecord.upsert({
          where: {
            employeeId_attendanceDate: {
              employeeId: record.employeeId,
              attendanceDate: record.attendanceDate
            }
          },
          update: {
            status: record.status as never,
            attendanceUnits: record.attendanceUnits
          },
          create: {
            employeeId: record.employeeId,
            branchId: record.branchId,
            attendanceDate: record.attendanceDate,
            status: record.status as never,
            attendanceUnits: record.attendanceUnits
          }
        })
      )
    );
  }
}

export const attendanceRepository = new AttendanceRepository();
