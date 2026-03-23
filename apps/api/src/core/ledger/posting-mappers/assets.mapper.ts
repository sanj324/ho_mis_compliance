import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const mapAssetPosting = async (assetId: string) => {
  const asset = await prisma.asset.findUnique({ where: { id: assetId } });
  if (!asset) {
    return null;
  }

  return {
    moduleName: "ASSETS" as const,
    eventCode: "ASSET_CAPITALIZATION",
    referenceType: "Asset",
    referenceId: asset.id,
    branchId: asset.branchId,
    postingDate: new Date(),
    amount: Number(asset.originalCost),
    narration: `Asset capitalization for ${asset.assetCode}`
  };
};
