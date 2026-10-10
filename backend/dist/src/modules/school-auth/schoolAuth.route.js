"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schoolAuth_controller_1 = require("./schoolAuth.controller");
const router = (0, express_1.Router)();
router.post("/login", schoolAuth_controller_1.schoolAuthController.login);
exports.default = router;
//# sourceMappingURL=schoolAuth.route.js.map