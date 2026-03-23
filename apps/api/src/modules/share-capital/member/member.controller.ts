import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { sendSuccess } from "../../../common/utils/response.js";
import { memberService } from "./member.service.js";

export class MemberController {
  async list(request: Request, response: Response) {
    const branchId = typeof request.query.branchId === "string" ? request.query.branchId : undefined;
    const isHoUser = request.authUser?.roleCodes.includes("HO_ADMIN") ?? false;
    const scopedBranchId = isHoUser ? branchId : request.authUser?.branchId ?? undefined;
    const members = await memberService.list(scopedBranchId);
    sendSuccess(response, "Members fetched successfully", members);
  }

  async getById(request: Request, response: Response) {
    const memberId = typeof request.params.id === "string" ? request.params.id : "";
    const member = await memberService.getById(memberId);
    sendSuccess(response, "Member fetched successfully", member);
  }

  async create(request: Request, response: Response) {
    const member = await memberService.create(request.body, {
      requestId: request.context.requestId,
      userId: request.context.userId,
      branchId: request.context.branchId
    });
    sendSuccess(response, "Member created successfully", member, StatusCodes.CREATED);
  }

  async update(request: Request, response: Response) {
    const memberId = typeof request.params.id === "string" ? request.params.id : "";
    const member = await memberService.update(memberId, request.body, {
      requestId: request.context.requestId,
      userId: request.context.userId,
      branchId: request.context.branchId
    });
    sendSuccess(response, "Member updated successfully", member);
  }
}

export const memberController = new MemberController();
