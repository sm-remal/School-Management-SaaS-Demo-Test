"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schoolController = void 0;
const school_service_1 = require("./school.service");
const school_validation_1 = require("./school.validation");
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
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validation.errors,
        });
        return;
    }
    if (!req.user?.userId) {
        res.status(401).json({
            success: false,
            message: "Authentication token is required",
        });
        return;
    }
    try {
        const school = await school_service_1.schoolService.createSchool(payload, req.user.userId);
        res.status(school.status === "ACTIVE" ? 201 : 500).json({
            success: school.status === "ACTIVE",
            data: school,
            message: school.status === "ACTIVE"
                ? "School created successfully"
                : "School provisioning failed",
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "School create failed";
        res.status(409).json({
            success: false,
            message,
        });
    }
};
exports.schoolController = {
    listSchools,
    createSchool,
};
//# sourceMappingURL=school.controller.js.map