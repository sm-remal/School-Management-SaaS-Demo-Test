"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schoolAdminController = void 0;
const schoolAdmin_service_1 = require("./schoolAdmin.service");
const getMe = async (req, res) => {
    if (!req.schoolUser) {
        res.status(401).json({
            success: false,
            message: "School authentication token is required",
        });
        return;
    }
    try {
        const profile = await schoolAdmin_service_1.schoolAdminService.getProfile(req.schoolUser);
        res.json({
            success: true,
            data: profile,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Profile not found",
        });
    }
};
exports.schoolAdminController = {
    getMe,
};
//# sourceMappingURL=schoolAdmin.controller.js.map