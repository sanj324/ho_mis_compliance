import { PrismaClient } from "@prisma/client";

import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { AssetStatusEnum } from "../../../common/enums/asset.enum.js";
import { assetTransferRepository } from "./assetTransfer.repository.js";

const prisma = new PrismaClient();

export class AssetTransferService {
  list() {
    return assetTransferRepository.findMany();
  }

  async create(
    input: { assetId: string; fromBranchId: string; toBranchId: string; transferDate: string; reason: string },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const transfer = await assetTransferRepository.create({
      asset: { connect: { id: input.assetId } },
      fromBranch: { connect: { id: input.fromBranchId } },
      toBranch: { connect: { id: input.toBranchId } },
      transferDate: new Date(input.transferDate),
      reason: input.reason,
      approvalState: "PENDING_APPROVAL"
    });

    await prisma.asset.update({
      where: { id: input.assetId },
      data: {
        branch: { connect: { id: input.toBranchId } },
        currentStatus: AssetStatusEnum.TRANSFER_PENDING,
        approvalState: "PENDING_APPROVAL"
      }
    });

    await prisma.auditLog.create({
      data: {
        moduleName: "ASSETS",
        entityName: "AssetTransfer",
        entityId: transfer.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        newValues: transfer
      }
    });
    return transfer;
  }
}

export const assetTransferService = new AssetTransferService();
