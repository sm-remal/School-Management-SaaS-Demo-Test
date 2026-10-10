"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const config_1 = __importDefault(require("../config"));
if (!config_1.default.databaseUrl) {
    throw new Error("DATABASE_URL is required");
}
const adapter = new adapter_pg_1.PrismaPg(config_1.default.databaseUrl);
exports.prisma = new client_1.PrismaClient({
    adapter,
});
//# sourceMappingURL=prisma.js.map