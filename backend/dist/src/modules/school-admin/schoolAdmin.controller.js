"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schoolAdminController = void 0;
const schoolAdmin_service_1 = require("./schoolAdmin.service");
const AppError_1 = require("../../errors/AppError");
const getMe = async (req, res) => {
    if (!req.schoolUser) {
        throw new AppError_1.AppError(401, "School authentication token is required", "SCHOOL_AUTH_TOKEN_REQUIRED");
    }
    const profile = await schoolAdmin_service_1.schoolAdminService.getProfile(req.schoolUser);
    res.json({
        success: true,
        data: profile,
    });
};
exports.schoolAdminController = {
    getMe,
};
//# sourceMappingURL=schoolAdmin.controller.js.map