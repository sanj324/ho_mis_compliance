import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

import { AppError } from "../../../common/errors/app-error.js";
import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { memberService } from "../member/member.service.js";
import { shareClassRepository } from "../share-class/shareClass.repository.js";
import { allotmentRepository } from "./allotment.repository.js";

const prisma = new PrismaClient();

type AuditContext = {
  requestId: string;
  userId: string | null;
  branchId: string | null;
};

export class AllotmentService {
  async create(
    input: {
      memberId: string;
      shareClassId: string;
      allotmentDate: string;
      noOfShares: number;
      paidUpValue: number;
      shareCertificateNo?: string;
    },
    context: AuditContext
  ) {
    const member = await memberService.getById(input.memberId);
    if (member.freezeStatus) {
      throw new AppError("Frozen member cannot receive fresh allotment", StatusCodes.BAD_REQUEST);
    }

    const shareClass = await shareClassRepository.findById(input.shareClassId);
    if (!shareClass) {
      throw new AppError("Share class not found", StatusCodes.NOT_FOUND);
    }

    const allotment = await allotmentRepository.create({
      member: { connect: { id: input.memberId } },
      shareClass: { connect: { id: input.shareClassId } },
      allotmentDate: new Date(input.allotmentDate),
      noOfShares: input.noOfShares,
      paidUpValue: input.paidUpValue,
      ...(input.shareCertificateNo ? { shareCertificateNo: input.shareCertificateNo } : {}),
      approvalState: "PENDING_APPROVAL"
    });

    await prisma.auditLog.create({
      data: {
        moduleName: "SHARE_CAPITAL",
        entityName: "ShareAllotment",
        entityId: allotment.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        newValues: allotment
      }
    });

    return allotment;
  }
}

export const allotmentService = new AllotmentService();
