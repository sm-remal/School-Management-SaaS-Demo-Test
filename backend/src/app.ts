import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.route";
import schoolRoutes from "./modules/school/school.route";
import schoolAuthRoutes from "./modules/school-auth/schoolAuth.route";
import schoolAdminRoutes from "./modules/school-admin/schoolAdmin.route";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { AppError } from "./errors/AppError";

const app = express();
app.use(cors());
app.use(express.json());

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

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/school-auth", schoolAuthRoutes);
app.use("/api/v1/school-admin", schoolAdminRoutes);
app.use("/api/v1/schools", schoolRoutes);

app.use((_req, _res, next) => {
  next(new AppError(404, "Route not found", "ROUTE_NOT_FOUND"));
});

app.use(globalErrorHandler);

export default app;
