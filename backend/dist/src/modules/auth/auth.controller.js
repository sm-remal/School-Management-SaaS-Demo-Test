"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
const auth_validation_1 = require("./auth.validation");
const login = async (req, res) => {
    const payload = req.body;
    const validation = (0, auth_validation_1.validateLoginInput)(payload);
    if (!validation.success) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validation.errors,
        });
        return;
    }
    try {
        const result = await auth_service_1.authService.login(payload);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (_error) {
        res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
    }
};
exports.authController = {
    login,
};
//# sourceMappingURL=auth.controller.js.map