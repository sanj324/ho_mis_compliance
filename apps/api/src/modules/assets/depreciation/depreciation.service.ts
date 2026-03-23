import { PrismaClient } from "@prisma/client";

import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { AssetStatusEnum } from "../../../common/enums/asset.enum.js";
import { depreciationRepository } from "./depreciation.repository.js";

const prisma = new PrismaClient();

const roundCurrency = (value: number): number => Number(value.toFixed(2));

export class DepreciationService {
  list(assetId?: string) {
    return depreciationRepository.findRuns(assetId);
  }

  async run(
    input: { branchId?: string; month: number; year: number },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const assets = await prisma.asset.findMany({
      where: {
        ...(input.branchId ? { branchId: input.branchId } : {}),
        currentStatus: AssetStatusEnum.ACTIVE
      }
    });

    const results = [];
    for (const asset of assets) {
      const depreciationBase = Number(asset.originalCost) - Number(asset.salvageValue);
      const monthlyDepreciation = roundCurrency(depreciationBase / Number(asset.usefulLifeMonths));
      const nextAccumulated = roundCurrency(Number(asset.accumulatedDepreciation) + monthlyDepreciation);
      const nextNbv = roundCurrency(Math.max(Number(asset.originalCost) - nextAccumulated, Number(asset.salvageValue)));

      const existingRun = await prisma.assetDepreciationRun.findUnique({
        where: {
          assetId_runMonth_runYear: {
            assetId: asset.id,
            runMonth: input.month,
            runYear: input.year
          }
        }
      });

      const run = existingRun
        ? existingRun
        : await depreciationRepository.createRun({
            asset: { connect: { id: asset.id } },
            runMonth: input.month,
            runYear: input.year,
            depreciationAmount: monthlyDepreciation,
            accumulatedDepreciation: nextAccumulated,
            closingNetBookValue: nextNbv
          });

      if (!existingRun) {
        await prisma.asset.update({
          where: { id: asset.id },
          data: {
            accumulatedDepreciation: nextAccumulated,
            netBookValue: nextNbv
          }
        });
      }

      results.push(run);
    }

    await prisma.auditLog.create({
      data: {
        moduleName: "ASSETS",
        entityName: "AssetDepreciationRun",
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        newValues: {
          runMonth: input.month,
          runYear: input.year,
          processedAssets: results.length
        }
      }
    });

    return results;
  }
}

export const depreciationService = new DepreciationService();
