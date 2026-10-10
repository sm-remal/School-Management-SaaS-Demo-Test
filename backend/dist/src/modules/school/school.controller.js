"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schoolController = void 0;
const school_service_1 = require("./school.service");
const school_validation_1 = require("./school.validation");
const AppError_1 = require("../../errors/AppError");
const listSchools = async (_req, res) => {
    const schools = await school_service_1.schoolService.listSchools();
    res.json({
        success: true,
        data: schools,
    });
};
const createSchool = async (req, res) => {
    const payload = req.body;
    const validation = (0, school_validation_1.validateCreateSchoolInput)(payload);
    if (!validation.success) {
        throw new AppError_1.AppError(400, "Validation failed", "VALIDATION_ERROR", validation.errors);
    }
    if (!req.user?.userId) {
        throw new AppError_1.AppError(401, "Authentication token is required", "AUTH_TOKEN_REQUIRED");
    }
    const school = await school_service_1.schoolService.createSchool(payload, req.user.userId);
    res.status(school.status === "ACTIVE" ? 201 : 500).json({
        success: school.status === "ACTIVE",
        data: school,
        message: school.status === "ACTIVE"
            ? "School created successfully"
            : "School provisioning failed",
    });
};
exports.schoolController = {
    listSchools,
    createSchool,
};
//# sourceMappingURL=school.controller.js.map