import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

import { AppError } from "../../../common/errors/app-error.js";
import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import {
  MemberKycStatusEnum,
  MemberStatusEnum,
  ShareCapitalExceptionSeverityEnum
} from "../../../common/enums/share-capital.enum.js";
import { memberRepository } from "./member.repository.js";

const prisma = new PrismaClient();

type MemberInput = {
  memberCode: string;
  memberName: string;
  branchId: string;
  panNo?: string;
  aadhaarNo?: string;
  kycStatus?: string;
  memberStatus?: string;
  freezeStatus?: boolean;
  lienStatus?: boolean;
  registrarRefNo?: string;
  panVerified?: boolean;
  aadhaarVerified?: boolean;
  remarks?: string;
};

type AuditContext = {
  requestId: string;
  userId: string | null;
  branchId: string | null;
};

export class MemberService {
  list(branchId?: string) {
    return memberRepository.findMany(branchId);
  }

  async getById(id: string) {
    const member = await memberRepository.findById(id);
    if (!member) {
      throw new AppError("Member not found", StatusCodes.NOT_FOUND);
    }

    const currentBalance = await this.getShareBalance(id);
    return {
      ...member,
      currentBalance
    };
  }

  async getShareBalance(memberId: string, shareClassId?: string) {
    const [allotments, incoming, outgoing, redemptions] = await Promise.all([
      memberRepository.aggregateAllotments(memberId, shareClassId),
      memberRepository.aggregateIncomingTransfers(memberId, shareClassId),
      memberRepository.aggregateOutgoingTransfers(memberId, shareClassId),
      memberRepository.aggregateRedemptions(memberId, shareClassId)
    ]);

    return (
      (allotments._sum.noOfShares ?? 0) +
      (incoming._sum.noOfShares ?? 0) -
      (outgoing._sum.noOfShares ?? 0) -
      (redemptions._sum.noOfShares ?? 0)
    );
  }

  private async createExceptionIfNeeded(memberId: string, exceptionCode: string, exceptionMessage: string) {
    const existing = await memberRepository.findOpenException(memberId, exceptionCode);
    if (existing) {
      return;
    }

    await memberRepository.createException({
      member: { connect: { id: memberId } },
      exceptionCode,
      exceptionMessage,
      severity: ShareCapitalExceptionSeverityEnum.HIGH
    });
  }

  private async captureKycFlags(
    memberId: string,
    input: { kycStatus?: string; panNo?: string | null; aadhaarNo?: string | null }
  ) {
    const isDeficient =
      input.kycStatus === MemberKycStatusEnum.DEFICIENT ||
      input.kycStatus === MemberKycStatusEnum.PENDING ||
      !input.panNo ||
      !input.aadhaarNo;

    if (isDeficient) {
      await this.createExceptionIfNeeded(
        memberId,
        "KYC_DEFICIENT",
        "Member record has incomplete KYC or statutory identifiers"
      );
    }
  }

  async create(input: MemberInput, context: AuditContext) {
    const member = await memberRepository.create({
      memberCode: input.memberCode,
      memberName: input.memberName,
      branch: { connect: { id: input.branchId } },
      ...(input.panNo ? { panNo: input.panNo } : {}),
      ...(input.aadhaarNo ? { aadhaarNo: input.aadhaarNo } : {}),
      kycStatus: input.kycStatus ?? MemberKycStatusEnum.PENDING,
      memberStatus: input.memberStatus ?? MemberStatusEnum.ACTIVE,
      freezeStatus: input.freezeStatus ?? false,
      lienStatus: input.lienStatus ?? false,
      ...(input.registrarRefNo ? { registrarRefNo: input.registrarRefNo } : {})
    });

    await memberRepository.upsertKyc(member.id, {
      memberId: member.id,
      panVerified: input.panVerified ?? false,
      aadhaarVerified: input.aadhaarVerified ?? false,
      remarks: input.remarks ?? null
    });

    await this.captureKycFlags(member.id, input);

    await prisma.auditLog.create({
      data: {
        moduleName: "SHARE_CAPITAL",
        entityName: "Member",
        entityId: member.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        newValues: member
      }
    });

    return this.getById(member.id);
  }

  async update(id: string, input: Partial<MemberInput>, context: AuditContext) {
    const existing = await this.getById(id);
    const member = await memberRepository.update(id, {
      ...(input.memberName !== undefined ? { memberName: input.memberName } : {}),
      ...(input.branchId ? { branch: { connect: { id: input.branchId } } } : {}),
      ...(input.panNo !== undefined ? { panNo: input.panNo } : {}),
      ...(input.aadhaarNo !== undefined ? { aadhaarNo: input.aadhaarNo } : {}),
      ...(input.kycStatus !== undefined ? { kycStatus: input.kycStatus } : {}),
      ...(input.memberStatus !== undefined ? { memberStatus: input.memberStatus } : {}),
      ...(input.freezeStatus !== undefined ? { freezeStatus: input.freezeStatus } : {}),
      ...(input.lienStatus !== undefined ? { lienStatus: input.lienStatus } : {}),
      ...(input.registrarRefNo !== undefined ? { registrarRefNo: input.registrarRefNo } : {})
    });

    if (input.panVerified !== undefined || input.aadhaarVerified !== undefined || input.remarks !== undefined) {
      await memberRepository.upsertKyc(id, {
        memberId: id,
        panVerified: input.panVerified ?? existing.memberKyc?.panVerified ?? false,
        aadhaarVerified: input.aadhaarVerified ?? existing.memberKyc?.aadhaarVerified ?? false,
        remarks: input.remarks ?? existing.memberKyc?.remarks ?? null
      });
    }

    await this.captureKycFlags(id, {
      panNo: input.panNo ?? member.panNo ?? null,
      aadhaarNo: input.aadhaarNo ?? member.aadhaarNo ?? null,
      kycStatus: input.kycStatus ?? member.kycStatus
    });

    await prisma.auditLog.create({
      data: {
        moduleName: "SHARE_CAPITAL",
        entityName: "Member",
        entityId: member.id,
        action: AuditActionEnum.UPDATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        oldValues: existing,
        newValues: member
      }
    });

    return this.getById(id);
  }
}

export const memberService = new MemberService();
