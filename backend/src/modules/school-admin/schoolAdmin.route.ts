import { Router } from "express";
import { requireSchoolAuth } from "../../shared/schoolAuth.middleware";
import { schoolAdminController } from "./schoolAdmin.controller";

const router = Router();

router.use(requireSchoolAuth);
router.get("/me", schoolAdminController.getMe);

export default router;
