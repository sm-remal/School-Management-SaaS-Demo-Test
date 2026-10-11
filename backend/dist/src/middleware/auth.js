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
exports.requireSuperAdmin = exports.requireAuth = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const getBearerToken = (authorizationHeader) => {
    if (!authorizationHeader) {
        return null;
    }
    const [scheme, token] = authorizationHeader.split(" ");
    return scheme === "Bearer" && token ? token : null;
};
const requireAuth = (req, res, next) => {
    const token = getBearerToken(req.headers.authorization);
    if (!token) {
        res.status(401).json({
            success: false,
            message: "Authentication token is required",
        });
        return;
    }
    try {
        const decoded = jwt.verify(token, config_1.default.jwtSecret);
        if (typeof decoded.userId !== "string" ||
            typeof decoded.email !== "string" ||
            !Array.isArray(decoded.roles)) {
            res.status(401).json({
                success: false,
                message: "Invalid authentication token payload",
            });
            return;
        }
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            roles: decoded.roles.filter((role) => typeof role === "string"),
        };
        next();
    }
    catch (_error) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token",
        });
    }
};
exports.requireAuth = requireAuth;
const requireSuperAdmin = (req, res, next) => {
    if (!req.user?.roles.includes("SUPER_ADMIN")) {
        res.status(403).json({
            success: false,
            message: "Super Admin permission is required",
        });
        return;
    }
    next();
};
exports.requireSuperAdmin = requireSuperAdmin;
//# sourceMappingURL=auth.js.map