"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schoolAuthController = void 0;
const schoolAuth_service_1 = require("./schoolAuth.service");
const schoolAuth_validation_1 = require("./schoolAuth.validation");
const AppError_1 = require("../../errors/AppError");
const login = async (req, res) => {
    const payload = req.body;
    const validation = (0, schoolAuth_validation_1.validateSchoolLoginInput)(payload);
    if (!validation.success) {
        throw new AppError_1.AppError(400, "Validation failed", "VALIDATION_ERROR", validation.errors);
    }
    const result = await schoolAuth_service_1.schoolAuthService.login(payload);
    res.json({
        success: true,
        data: result,
    });
};
exports.schoolAuthController = {
    login,
};
//# sourceMappingURL=schoolAuth.controller.js.map