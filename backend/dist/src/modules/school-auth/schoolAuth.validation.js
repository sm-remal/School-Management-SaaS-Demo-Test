"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchoolLoginInput = void 0;
const validateSchoolLoginInput = (payload) => {
    const errors = [];
    if (!payload.email || typeof payload.email !== "string") {
        errors.push("Email is required");
    }
    if (!payload.password || typeof payload.password !== "string") {
        errors.push("Password is required");
    }
    return {
        success: errors.length === 0,
        errors,
    };
};
exports.validateSchoolLoginInput = validateSchoolLoginInput;
//# sourceMappingURL=schoolAuth.validation.js.map