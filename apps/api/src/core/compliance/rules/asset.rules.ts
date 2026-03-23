import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const evaluateAssetRules = async () => {
  const assets = await prisma.asset.findMany({
    where: {
      OR: [
        { insuranceExpiryDate: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } },
        { insuranceExpiryDate: null }
      ]
    }
  });

  return assets.map((asset) => ({
    moduleName: "ASSETS" as const,
    entityType: "Asset",
    entityId: asset.id,
    ruleCode: asset.insuranceExpiryDate ? "ASSET_INSURANCE_EXPIRY" : "ASSET_INSURANCE_MISSING",
    ruleDescription: asset.insuranceExpiryDate
      ? "Asset insurance expiry falls within the next 30 days"
      : "Asset insurance details are not available",
    severity: asset.insuranceExpiryDate ? "MEDIUM" : "HIGH",
    branchId: asset.branchId,
    dueDate: asset.insuranceExpiryDate
  }));
};
