import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth";
import { auditService } from "./audit.service";

const listAuditLogs = async (_req: AuthenticatedRequest, res: Response) => {
  const auditLogs = await auditService.listAuditLogs();

  res.json({
    success: true,
    data: auditLogs,
  });
};

export const auditController = {
  listAuditLogs,
};
