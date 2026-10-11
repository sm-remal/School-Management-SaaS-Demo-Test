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
const getSchoolIdParam = (req) => {
    const schoolId = req.params.id;
    if (typeof schoolId !== "string" || !schoolId) {
        throw new AppError_1.AppError(400, "School id is required", "SCHOOL_ID_REQUIRED");
    }
    return schoolId;
};
const changeSchoolStatus = async (req, res, status) => {
    if (!req.user?.userId) {
        throw new AppError_1.AppError(401, "Authentication token is required", "AUTH_TOKEN_REQUIRED");
    }
    const school = await school_service_1.schoolService.updateSchoolStatus(getSchoolIdParam(req), status, req.user.userId);
    res.json({
        success: true,
        data: school,
        message: status === "ACTIVE"
            ? "School activated successfully"
            : "School deactivated successfully",
    });
};
const activateSchool = async (req, res) => {
    await changeSchoolStatus(req, res, "ACTIVE");
};
const deactivateSchool = async (req, res) => {
    await changeSchoolStatus(req, res, "SUSPENDED");
};
const permanentlyDeleteSchool = async (req, res) => {
    if (!req.user?.userId) {
        throw new AppError_1.AppError(401, "Authentication token is required", "AUTH_TOKEN_REQUIRED");
    }
    const confirmationSchoolName = typeof req.body?.schoolName === "string" ? req.body.schoolName : "";
    const deletedSchool = await school_service_1.schoolService.permanentlyDeleteSchool(getSchoolIdParam(req), confirmationSchoolName, req.user.userId);
    res.json({
        success: true,
        data: deletedSchool,
        message: "School permanently deleted successfully",
    });
};
exports.schoolController = {
    listSchools,
    createSchool,
    activateSchool,
    deactivateSchool,
    permanentlyDeleteSchool,
};
//# sourceMappingURL=school.controller.js.map