import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AssetReportService {
  async register(branchId?: string) {
    const assets = branchId
      ? await prisma.asset.findMany({
          where: { branchId },
          include: {
            branch: true,
            assetCategory: true,
            depreciationMethod: true
          },
          orderBy: { capitalizationDate: "desc" }
        })
      : await prisma.asset.findMany({
          include: {
            branch: true,
            assetCategory: true,
            depreciationMethod: true
          },
          orderBy: { capitalizationDate: "desc" }
        });

    return assets.map((asset) => ({
      assetCode: asset.assetCode,
      assetName: asset.assetName,
      assetType: asset.assetCategory.name,
      branch: asset.branch.name,
      category: asset.assetCategory.name,
      depreciationMethod: asset.depreciationMethod.name,
      usefulLifeMonths: asset.usefulLifeMonths,
      depreciationRate: Number(asset.depreciationRate).toFixed(2),
      totalCost: Number(asset.originalCost).toFixed(2),
      originalCost: Number(asset.originalCost).toFixed(2),
      accumulatedDepreciation: Number(asset.accumulatedDepreciation).toFixed(2),
      netBookValue: Number(asset.netBookValue).toFixed(2),
      insurancePolicyNo: asset.insurancePolicyNo ?? "-",
      insuranceExpiryDate: asset.insuranceExpiryDate?.toISOString().slice(0, 10) ?? "-",
      barcodeOrTagNo: asset.barcodeOrTagNo ?? "-",
      status: asset.currentStatus
    }));
  }

  async depreciationSchedule(branchId?: string) {
    const runs = branchId
      ? await prisma.assetDepreciationRun.findMany({
          where: { asset: { branchId } },
          include: { asset: true },
          orderBy: [{ runYear: "desc" }, { runMonth: "desc" }]
        })
      : await prisma.assetDepreciationRun.findMany({
          include: { asset: true },
          orderBy: [{ runYear: "desc" }, { runMonth: "desc" }]
        });

    return runs.map((run) => ({
      assetCode: run.asset.assetCode,
      assetName: run.asset.assetName,
      runMonth: run.runMonth,
      runYear: run.runYear,
      depreciationAmount: Number(run.depreciationAmount).toFixed(2),
      accumulatedDepreciation: Number(run.accumulatedDepreciation).toFixed(2),
      closingNetBookValue: Number(run.closingNetBookValue).toFixed(2)
    }));
  }

  async insuranceExpiry(branchId?: string) {
    const assets = await prisma.asset.findMany({
      where: {
        ...(branchId ? { branchId } : {}),
        insuranceExpiryDate: { not: null }
      },
      orderBy: { insuranceExpiryDate: "asc" }
    });

    return assets.map((asset) => ({
      assetCode: asset.assetCode,
      assetName: asset.assetName,
      insurancePolicyNo: asset.insurancePolicyNo ?? "-",
      insuranceExpiryDate: asset.insuranceExpiryDate?.toISOString().slice(0, 10) ?? "-",
      status: asset.currentStatus
    }));
  }
}

export const assetReportService = new AssetReportService();
