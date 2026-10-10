"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schoolAuth_middleware_1 = require("../../shared/schoolAuth.middleware");
const schoolAdmin_controller_1 = require("./schoolAdmin.controller");
const router = (0, express_1.Router)();
router.use(schoolAuth_middleware_1.requireSchoolAuth);
router.get("/me", schoolAdmin_controller_1.schoolAdminController.getMe);
exports.default = router;
//# sourceMappingURL=schoolAdmin.route.js.map