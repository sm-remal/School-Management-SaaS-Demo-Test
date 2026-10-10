import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import config from "../config";

if (!config.databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg(config.databaseUrl);

export const prisma = new PrismaClient({
  adapter,
});
