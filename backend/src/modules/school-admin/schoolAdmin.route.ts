import { Router } from "express";
import { requireSchoolAuth } from "../../middleware/schoolAuth";
import { schoolAdminController } from "./schoolAdmin.controller";

const router = Router();

router.use(requireSchoolAuth);
router.get("/me", schoolAdminController.getMe);

export default router;
