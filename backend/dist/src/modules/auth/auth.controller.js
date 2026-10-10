"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
const auth_validation_1 = require("./auth.validation");
const AppError_1 = require("../../errors/AppError");
const login = async (req, res) => {
    const payload = req.body;
    const validation = (0, auth_validation_1.validateLoginInput)(payload);
    if (!validation.success) {
        throw new AppError_1.AppError(400, "Validation failed", "VALIDATION_ERROR", validation.errors);
    }
    const result = await auth_service_1.authService.login(payload);
    res.json({
        success: true,
        data: result,
    });
};
exports.authController = {
    login,
};
//# sourceMappingURL=auth.controller.js.map