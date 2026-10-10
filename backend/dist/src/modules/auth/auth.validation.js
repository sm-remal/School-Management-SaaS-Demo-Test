"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginInput = void 0;
const validateLoginInput = (payload) => {
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
exports.validateLoginInput = validateLoginInput;
//# sourceMappingURL=auth.validation.js.map