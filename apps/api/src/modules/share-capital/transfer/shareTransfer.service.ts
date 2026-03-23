import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

import { AppError } from "../../../common/errors/app-error.js";
import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { MemberKycStatusEnum } from "../../../common/enums/share-capital.enum.js";
import { memberService } from "../member/member.service.js";
import { shareClassRepository } from "../share-class/shareClass.repository.js";
import { shareTransferRepository } from "./shareTransfer.repository.js";

const prisma = new PrismaClient();

type AuditContext = {
  requestId: string;
  userId: string | null;
  branchId: string | null;
};

export class ShareTransferService {
  async create(
    input: {
      fromMemberId: string;
      toMemberId: string;
      shareClassId: string;
      transferDate: string;
      noOfShares: number;
      remarks?: string;
    },
    context: AuditContext
  ) {
    if (input.fromMemberId === input.toMemberId) {
      throw new AppError("Transfer source and destination members must be different", StatusCodes.BAD_REQUEST);
    }

    const [fromMember, toMember, shareClass] = await Promise.all([
      memberService.getById(input.fromMemberId),
      memberService.getById(input.toMemberId),
      shareClassRepository.findById(input.shareClassId)
    ]);

    if (!shareClass) {
      throw new AppError("Share class not found", StatusCodes.NOT_FOUND);
    }

    if (fromMember.freezeStatus || toMember.freezeStatus) {
      throw new AppError("Frozen member cannot participate in transfer", StatusCodes.BAD_REQUEST);
    }

    if (fromMember.kycStatus !== MemberKycStatusEnum.COMPLETED || toMember.kycStatus !== MemberKycStatusEnum.COMPLETED) {
      throw new AppError("Transfer requires completed KYC for both members", StatusCodes.BAD_REQUEST);
    }

    const availableBalance = await memberService.getShareBalance(input.fromMemberId, input.shareClassId);
    if (availableBalance < input.noOfShares) {
      throw new AppError("Insufficient share balance for transfer", StatusCodes.BAD_REQUEST);
    }

    const transfer = await shareTransferRepository.create({
      fromMember: { connect: { id: input.fromMemberId } },
      toMember: { connect: { id: input.toMemberId } },
      shareClass: { connect: { id: input.shareClassId } },
      transferDate: new Date(input.transferDate),
      noOfShares: input.noOfShares,
      ...(input.remarks ? { remarks: input.remarks } : {}),
      approvalState: "PENDING_APPROVAL"
    });

    await prisma.auditLog.create({
      data: {
        moduleName: "SHARE_CAPITAL",
        entityName: "ShareTransfer",
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

export const shareTransferService = new ShareTransferService();
