"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
const parsePort = (value, fallback) => {
    const port = Number(value);
    return Number.isInteger(port) && port > 0 ? port : fallback;
};
const config = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: parsePort(process.env.PORT, 5000),
    databaseUrl: process.env.DATABASE_URL,
    postgresAdminUrl: process.env.POSTGRES_ADMIN_URL,
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
    jwtSecret: process.env.JWT_SECRET || "demo_super_admin_secret_change_me",
    superAdminEmail: process.env.SUPER_ADMIN_EMAIL || "superadmin@example.com",
    superAdminPassword: process.env.SUPER_ADMIN_PASSWORD || "Admin@12345",
};
exports.default = config;
//# sourceMappingURL=index.js.map