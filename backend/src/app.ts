import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.route";
import schoolRoutes from "./modules/school/school.route";
import schoolAuthRoutes from "./modules/school-auth/schoolAuth.route";
import schoolAdminRoutes from "./modules/school-admin/schoolAdmin.route";

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

export default app;
