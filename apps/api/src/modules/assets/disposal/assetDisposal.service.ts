import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

import { AppError } from "../../../common/errors/app-error.js";
import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { AssetStatusEnum } from "../../../common/enums/asset.enum.js";
import { assetDisposalRepository } from "./assetDisposal.repository.js";

const prisma = new PrismaClient();

export class AssetDisposalService {
  list() {
    return assetDisposalRepository.findMany();
  }

  async create(
    input: { assetId: string; disposalDate: string; disposalValue: number; reason?: string },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const asset = await prisma.asset.findUnique({ where: { id: input.assetId } });
    if (!asset) {
      throw new AppError("Asset not found", StatusCodes.NOT_FOUND);
    }

    const nbv = Number(asset.netBookValue);
    const gainLossAmount = Number((input.disposalValue - nbv).toFixed(2));
    const disposal = await assetDisposalRepository.create({
      asset: { connect: { id: input.assetId } },
      disposalDate: new Date(input.disposalDate),
      disposalValue: input.disposalValue,
      netBookValueAtDisposal: nbv,
      gainLossAmount,
      ...(input.reason ? { reason: input.reason } : {}),
      approvalState: "PENDING_APPROVAL"
    });

    await prisma.asset.update({
      where: { id: input.assetId },
      data: {
        currentStatus: AssetStatusEnum.DISPOSED,
        approvalState: "PENDING_APPROVAL"
      }
    });

    await prisma.auditLog.create({
      data: {
        moduleName: "ASSETS",
        entityName: "AssetDisposal",
        entityId: disposal.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        newValues: disposal
      }
    });
    return disposal;
  }
}

export const assetDisposalService = new AssetDisposalService();
