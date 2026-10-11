import { Router } from "express";
import { requireAuth, requireSuperAdmin } from "../../middleware/auth";
import { auditController } from "./audit.controller";

const router = Router();

router.use(requireAuth, requireSuperAdmin);
router.get("/", auditController.listAuditLogs);

export default router;
