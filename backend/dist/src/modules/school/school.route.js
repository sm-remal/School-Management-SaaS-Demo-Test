"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const school_controller_1 = require("./school.controller");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth, auth_1.requireSuperAdmin);
router.get("/", school_controller_1.schoolController.listSchools);
router.post("/", school_controller_1.schoolController.createSchool);
exports.default = router;
//# sourceMappingURL=school.route.js.map