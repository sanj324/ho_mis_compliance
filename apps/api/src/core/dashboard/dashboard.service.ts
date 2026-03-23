import { PrismaClient } from "@prisma/client";
import type { HODashboardSummary } from "@ho-mis/types";

const prisma = new PrismaClient();

export class DashboardService {
  async getHOSummary(): Promise<HODashboardSummary> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const [totalBranches, totalUsers, activeUsers, pendingUserApprovals, auditEventsToday] =
      await Promise.all([
        prisma.branch.count(),
        prisma.user.count(),
        prisma.user.count({ where: { isActive: true } }),
        prisma.user.count({ where: { approvalState: "PENDING_APPROVAL" } }),
        prisma.auditLog.count({ where: { createdAt: { gte: startOfDay } } })
      ]);

    return {
      totalBranches,
      totalUsers,
      activeUsers,
      pendingUserApprovals,
      auditEventsToday
    };
  }
}

export const dashboardService = new DashboardService();
