import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ComplianceRepository {
  listEvents(filters?: { status?: string; moduleName?: string; branchId?: string }) {
    return prisma.complianceEvent.findMany({
      ...(filters
        ? {
            where: {
              ...(filters.status ? { status: filters.status } : {}),
              ...(filters.moduleName ? { moduleName: filters.moduleName as never } : {}),
              ...(filters.branchId ? { branchId: filters.branchId } : {})
            }
          }
        : {}),
      orderBy: { detectedOn: "desc" }
    });
  }

  getCalendar(branchId?: string) {
    return prisma.complianceCalendarItem.findMany({
      ...(branchId ? { where: { branchId } } : {}),
      orderBy: { dueDate: "asc" }
    });
  }

  findOpenEvent(input: { moduleName: string; entityType: string; entityId: string; ruleCode: string }) {
    return prisma.complianceEvent.findFirst({
      where: {
        moduleName: input.moduleName as never,
        entityType: input.entityType,
        entityId: input.entityId,
        ruleCode: input.ruleCode,
        status: "OPEN"
      }
    });
  }

  createEvent(data: Parameters<typeof prisma.complianceEvent.create>[0]["data"]) {
    return prisma.complianceEvent.create({ data });
  }

  closeEvent(id: string, closedBy?: string, remarks?: string) {
    return prisma.complianceEvent.update({
      where: { id },
      data: {
        status: "CLOSED",
        closedOn: new Date(),
        ...(closedBy ? { closedBy } : {}),
        ...(remarks ? { remarks } : {})
      }
    });
  }

  findEventById(id: string) {
    return prisma.complianceEvent.findUnique({ where: { id } });
  }

  dashboardSummary() {
    return Promise.all([
      prisma.complianceEvent.count({ where: { status: "OPEN" } }),
      prisma.complianceEvent.count({ where: { status: "OPEN", severity: "HIGH" } }),
      prisma.complianceCalendarItem.count({ where: { status: "OVERDUE" } }),
      prisma.complianceCalendarItem.count({ where: { status: "UPCOMING" } }),
      prisma.complianceEvent.groupBy({
        by: ["moduleName"],
        _count: { _all: true },
        where: { status: "OPEN" }
      })
    ]);
  }

  listRules() {
    return prisma.complianceRule.findMany({
      where: { isActive: true },
      orderBy: [{ moduleName: "asc" }, { ruleCode: "asc" }]
    });
  }
}

export const complianceRepository = new ComplianceRepository();
