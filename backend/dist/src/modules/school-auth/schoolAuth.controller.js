"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schoolAuthController = void 0;
const schoolAuth_service_1 = require("./schoolAuth.service");
const schoolAuth_validation_1 = require("./schoolAuth.validation");
const login = async (req, res) => {
    const payload = req.body;
    const validation = (0, schoolAuth_validation_1.validateSchoolLoginInput)(payload);
    if (!validation.success) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validation.errors,
        });
        return;
    }
    try {
        const result = await schoolAuth_service_1.schoolAuthService.login(payload);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (_error) {
        res.status(401).json({
            success: false,
            message: "Invalid school admin email or password",
        });
    }
};
exports.schoolAuthController = {
    login,
};
//# sourceMappingURL=schoolAuth.controller.js.map