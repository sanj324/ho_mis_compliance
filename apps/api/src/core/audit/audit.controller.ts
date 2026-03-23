import type { Request, Response } from "express";

import { sendSuccess } from "../../common/utils/response.js";
import { auditService } from "./audit.service.js";

export class AuditController {
  list = async (_request: Request, response: Response): Promise<void> => {
    const data = await auditService.list();
    sendSuccess(response, "Audit logs fetched", data);
  };
}

export const auditController = new AuditController();
