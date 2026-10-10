import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const parsePort = (value: string | undefined, fallback: number) => {
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

export default config;
