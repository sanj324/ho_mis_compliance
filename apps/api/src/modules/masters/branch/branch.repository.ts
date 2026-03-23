import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class BranchRepository {
  findMany() {
    return prisma.branch.findMany({
      orderBy: {
        name: "asc"
      }
    });
  }

  findById(id: string) {
    return prisma.branch.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            auditLogs: true,
            departments: true,
            designations: true,
            costCenters: true,
            employees: true,
            payrollMonths: true,
            payrollRuns: true,
            attendance: true,
            statutorySetups: true,
            investments: true,
            investmentExposureSnapshots: true,
            assets: true,
            outgoingAssetTransfers: true,
            incomingAssetTransfers: true,
            requisitions: true,
            stockLedgers: true,
            stockIssues: true,
            outgoingStockTransfers: true,
            incomingStockTransfers: true,
            stationeryExceptions: true,
            members: true,
            complianceEvents: true,
            complianceCalendarItems: true,
            notifications: true,
            documents: true,
            vouchers: true,
            reportGenerations: true,
            approvalTasks: true
          }
        }
      }
    });
  }

  create(data: Prisma.BranchCreateInput) {
    return prisma.branch.create({ data });
  }

  update(id: string, data: Prisma.BranchUpdateInput) {
    return prisma.branch.update({
      where: { id },
      data
    });
  }

  delete(id: string) {
    return prisma.branch.delete({
      where: { id }
    });
  }
}

export const branchRepository = new BranchRepository();
