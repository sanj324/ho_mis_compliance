import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AssetDashboardService {
  async summary(branchId?: string) {
    const assets = branchId ? await prisma.asset.findMany({ where: { branchId } }) : await prisma.asset.findMany();

    const insuranceExpiring = assets.filter((asset) => {
      if (!asset.insuranceExpiryDate) {
        return false;
      }
      const days = Math.ceil((asset.insuranceExpiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return days <= 30;
    }).length;

    const byStatus = new Map<string, number>();
    for (const asset of assets) {
      byStatus.set(asset.currentStatus, (byStatus.get(asset.currentStatus) ?? 0) + 1);
    }

    return {
      totalAssets: assets.length,
      totalOriginalCost: assets.reduce((sum, asset) => sum + Number(asset.originalCost), 0),
      totalNetBookValue: assets.reduce((sum, asset) => sum + Number(asset.netBookValue), 0),
      insuranceExpiring,
      byStatus: Array.from(byStatus.entries()).map(([status, count]) => ({ status, count }))
    };
  }
}

export const assetDashboardService = new AssetDashboardService();
