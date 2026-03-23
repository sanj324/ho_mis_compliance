import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

import { AppError } from "../../../common/errors/app-error.js";
import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { memberService } from "../member/member.service.js";
import { shareClassRepository } from "../share-class/shareClass.repository.js";
import { redemptionRepository } from "./redemption.repository.js";

const prisma = new PrismaClient();

type AuditContext = {
  requestId: string;
  userId: string | null;
  branchId: string | null;
};

export class RedemptionService {
  async create(
    input: {
      memberId: string;
      shareClassId: string;
      redemptionDate: string;
      noOfShares: number;
      redemptionValue: number;
      remarks?: string;
    },
    context: AuditContext
  ) {
    const [member, shareClass] = await Promise.all([
      memberService.getById(input.memberId),
      shareClassRepository.findById(input.shareClassId)
    ]);

    if (!shareClass) {
      throw new AppError("Share class not found", StatusCodes.NOT_FOUND);
    }

    if (member.freezeStatus) {
      throw new AppError("Frozen member cannot redeem shares", StatusCodes.BAD_REQUEST);
    }

    const availableBalance = await memberService.getShareBalance(input.memberId, input.shareClassId);
    if (availableBalance < input.noOfShares) {
      throw new AppError("Insufficient share balance for redemption", StatusCodes.BAD_REQUEST);
    }

    const redemption = await redemptionRepository.create({
      member: { connect: { id: input.memberId } },
      shareClass: { connect: { id: input.shareClassId } },
      redemptionDate: new Date(input.redemptionDate),
      noOfShares: input.noOfShares,
      redemptionValue: input.redemptionValue,
      ...(input.remarks ? { remarks: input.remarks } : {}),
      approvalState: "PENDING_APPROVAL"
    });

    await prisma.auditLog.create({
      data: {
        moduleName: "SHARE_CAPITAL",
        entityName: "ShareRedemption",
        entityId: redemption.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        newValues: redemption
      }
    });

    return redemption;
  }
}

export const redemptionService = new RedemptionService();
