"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const prisma_1 = require("../../shared/prisma");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = require("../../errors/AppError");
const login = async (payload) => {
    const user = await prisma_1.prisma.platformUser.findUnique({
        where: { email: payload.email },
        include: {
            roles: {
                include: {
                    role: true,
                },
            },
        },
    });
    if (!user || user.status !== "ACTIVE") {
        throw new AppError_1.AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }
    const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isPasswordValid) {
        throw new AppError_1.AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }
    const roles = user.roles.map((userRole) => userRole.role.code);
    const accessToken = jwt.sign({
        userId: user.id,
        email: user.email,
        roles,
    }, config_1.default.jwtSecret, { expiresIn: "1d" });
    await prisma_1.prisma.platformUser.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
    });
    return {
        user: {
            id: user.id,
            email: user.email,
            roles,
        },
        accessToken,
    };
};
exports.authService = {
    login,
};
//# sourceMappingURL=auth.service.js.map