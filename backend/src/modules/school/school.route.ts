import { Router } from "express";
import { requireAuth, requireSuperAdmin } from "../../middleware/auth";
import { schoolController } from "./school.controller";

const router = Router();

router.use(requireAuth, requireSuperAdmin);

router.get("/", schoolController.listSchools);
router.post("/", schoolController.createSchool);

export default router;
