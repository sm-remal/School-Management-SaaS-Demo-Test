import { Router } from "express";
import { schoolAuthController } from "./schoolAuth.controller";

const router = Router();

router.post("/login", schoolAuthController.login);

export default router;
