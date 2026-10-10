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
exports.schoolAuthService = void 0;
const pg_1 = require("pg");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const prisma_1 = require("../../shared/prisma");
const school_service_1 = require("../school/school.service");
const login = async (payload) => {
    const school = await prisma_1.prisma.school.findUnique({
        where: { schoolEmail: payload.email },
        include: { tenantDatabase: true },
    });
    if (!school ||
        school.status !== "ACTIVE" ||
        !school.tenantDatabase ||
        school.tenantDatabase.status !== "INITIALIZED") {
        throw new Error("INVALID_CREDENTIALS");
    }
    const tenantPool = new pg_1.Pool({
        connectionString: (0, school_service_1.buildTenantDatabaseUrl)(school.tenantDatabase.databaseName),
    });
    try {
        const result = await tenantPool.query(`
        SELECT users.id, users.email, users.password_hash, users.status, roles.code AS role_code
        FROM users
        JOIN roles ON roles.id = users.role_id
        WHERE users.email = $1
        LIMIT 1
      `, [payload.email]);
        const tenantUser = result.rows[0];
        if (!tenantUser || tenantUser.status !== "ACTIVE") {
            throw new Error("INVALID_CREDENTIALS");
        }
        const isPasswordValid = await bcrypt.compare(payload.password, tenantUser.password_hash);
        if (!isPasswordValid) {
            throw new Error("INVALID_CREDENTIALS");
        }
        const accessToken = jwt.sign({
            userId: tenantUser.id,
            email: tenantUser.email,
            roles: [tenantUser.role_code],
            schoolId: school.id,
            databaseName: school.tenantDatabase.databaseName,
        }, config_1.default.jwtSecret, { expiresIn: "1d" });
        return {
            user: {
                id: tenantUser.id,
                email: tenantUser.email,
                role: tenantUser.role_code,
                schoolId: school.id,
                schoolName: school.schoolName,
            },
            accessToken,
        };
    }
    finally {
        await tenantPool.end();
    }
};
exports.schoolAuthService = {
    login,
};
//# sourceMappingURL=schoolAuth.service.js.map