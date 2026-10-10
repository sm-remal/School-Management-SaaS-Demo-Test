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
exports.schoolService = exports.buildTenantDatabaseUrl = exports.DuplicateSchoolEmailError = void 0;
const node_crypto_1 = require("node:crypto");
const pg_1 = require("pg");
const bcrypt = __importStar(require("bcryptjs"));
const config_1 = __importDefault(require("../../config"));
const prisma_1 = require("../../shared/prisma");
class DuplicateSchoolEmailError extends Error {
    constructor(email) {
        super(`A school with email ${email} already exists`);
        this.name = "DuplicateSchoolEmailError";
    }
}
exports.DuplicateSchoolEmailError = DuplicateSchoolEmailError;
const quoteIdentifier = (identifier) => {
    if (!/^[a-z][a-z0-9_]*$/.test(identifier)) {
        throw new Error("Invalid database identifier");
    }
    return `"${identifier}"`;
};
const buildTenantDatabaseUrl = (databaseName) => {
    const baseUrl = config_1.default.postgresAdminUrl || config_1.default.databaseUrl;
    if (!baseUrl) {
        throw new Error("POSTGRES_ADMIN_URL or DATABASE_URL is required");
    }
    const url = new URL(baseUrl);
    url.pathname = `/${databaseName}`;
    return url.toString();
};
exports.buildTenantDatabaseUrl = buildTenantDatabaseUrl;
const createTenantDatabase = async (databaseName) => {
    const adminUrl = config_1.default.postgresAdminUrl || config_1.default.databaseUrl;
    if (!adminUrl) {
        throw new Error("POSTGRES_ADMIN_URL or DATABASE_URL is required");
    }
    const pool = new pg_1.Pool({ connectionString: adminUrl });
    try {
        await pool.query(`CREATE DATABASE ${quoteIdentifier(databaseName)}`);
    }
    finally {
        await pool.end();
    }
};
const initializeTenantDatabase = async (databaseName, payload) => {
    const tenantPool = new pg_1.Pool({
        connectionString: (0, exports.buildTenantDatabaseUrl)(databaseName),
    });
    const passwordHash = await bcrypt.hash(payload.initialAdminPassword, 12);
    try {
        await tenantPool.query("BEGIN");
        await tenantPool.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id UUID PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
        await tenantPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(320) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role_id UUID NOT NULL REFERENCES roles(id),
        status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
        await tenantPool.query(`
      CREATE TABLE IF NOT EXISTS school_settings (
        id UUID PRIMARY KEY,
        school_name VARCHAR(200) NOT NULL,
        school_email VARCHAR(320) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
        const roleId = (0, node_crypto_1.randomUUID)();
        const adminUserId = (0, node_crypto_1.randomUUID)();
        const settingsId = (0, node_crypto_1.randomUUID)();
        await tenantPool.query(`
        INSERT INTO roles (id, code, name)
        VALUES ($1, 'SCHOOL_ADMIN', 'School Admin')
        ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
      `, [roleId]);
        await tenantPool.query(`
        INSERT INTO users (id, email, password_hash, role_id)
        VALUES ($1, $2, $3, (SELECT id FROM roles WHERE code = 'SCHOOL_ADMIN'))
        ON CONFLICT (email) DO NOTHING
      `, [adminUserId, payload.schoolEmail, passwordHash]);
        await tenantPool.query(`
        INSERT INTO school_settings (id, school_name, school_email)
        VALUES ($1, $2, $3)
      `, [settingsId, payload.schoolName, payload.schoolEmail]);
        await tenantPool.query("COMMIT");
    }
    catch (error) {
        await tenantPool.query("ROLLBACK");
        throw error;
    }
    finally {
        await tenantPool.end();
    }
};
const listSchools = async () => {
    return prisma_1.prisma.school.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            tenantDatabase: true,
        },
    });
};
const createSchool = async (payload, actorUserId) => {
    const schoolEmail = payload.schoolEmail.trim().toLowerCase();
    const existingSchool = await prisma_1.prisma.school.findUnique({
        where: { schoolEmail },
        select: { id: true },
    });
    if (existingSchool) {
        throw new DuplicateSchoolEmailError(schoolEmail);
    }
    const databaseName = `school_${(0, node_crypto_1.randomUUID)().replace(/-/g, "").slice(0, 24)}`;
    const school = await prisma_1.prisma.school.create({
        data: {
            schoolName: payload.schoolName.trim(),
            schoolEmail,
            status: "PROVISIONING",
            tenantDatabase: {
                create: {
                    databaseName,
                    status: "PENDING",
                },
            },
            auditLogs: {
                create: {
                    actorUserId,
                    action: "SCHOOL_PROVISIONING_STARTED",
                    metadata: {
                        databaseName,
                        schoolEmail,
                    },
                },
            },
        },
        include: {
            tenantDatabase: true,
        },
    });
    try {
        await createTenantDatabase(databaseName);
        await prisma_1.prisma.tenantDatabase.update({
            where: { schoolId: school.id },
            data: { status: "CREATED" },
        });
        await initializeTenantDatabase(databaseName, {
            ...payload,
            schoolName: payload.schoolName.trim(),
            schoolEmail,
        });
        const activeSchool = await prisma_1.prisma.school.update({
            where: { id: school.id },
            data: {
                status: "ACTIVE",
                errorMessage: null,
                tenantDatabase: {
                    update: {
                        status: "INITIALIZED",
                        errorMessage: null,
                    },
                },
                auditLogs: {
                    create: {
                        actorUserId,
                        action: "SCHOOL_PROVISIONING_COMPLETED",
                        metadata: { databaseName },
                    },
                },
            },
            include: {
                tenantDatabase: true,
            },
        });
        return activeSchool;
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Provisioning failed";
        return prisma_1.prisma.school.update({
            where: { id: school.id },
            data: {
                status: "FAILED",
                errorMessage: message,
                tenantDatabase: {
                    update: {
                        status: "FAILED",
                        errorMessage: message,
                    },
                },
                auditLogs: {
                    create: {
                        actorUserId,
                        action: "SCHOOL_PROVISIONING_FAILED",
                        metadata: {
                            databaseName,
                            error: message,
                        },
                    },
                },
            },
            include: {
                tenantDatabase: true,
            },
        });
    }
};
exports.schoolService = {
    listSchools,
    createSchool,
};
//# sourceMappingURL=school.service.js.map