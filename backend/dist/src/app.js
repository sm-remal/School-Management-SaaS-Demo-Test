"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./modules/auth/auth.route"));
const school_route_1 = __importDefault(require("./modules/school/school.route"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "School Management API is running",
    });
});
app.get("/health", (_req, res) => {
    res.json({
        success: true,
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});
app.use("/api/v1/auth", auth_route_1.default);
app.use("/api/v1/schools", school_route_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map