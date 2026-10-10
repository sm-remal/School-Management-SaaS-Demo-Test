import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcryptjs";
import config from "../src/config";

const adapter = new PrismaPg(config.databaseUrl || "");
const prisma = new PrismaClient({ adapter });

const seed = async () => {
  if (!config.databaseUrl) {
    throw new Error("DATABASE_URL is required to seed the platform database");
  }

  const superAdminRole = await prisma.platformRole.upsert({
    where: { code: "SUPER_ADMIN" },
    update: { name: "Platform Super Admin" },
    create: {
      code: "SUPER_ADMIN",
      name: "Platform Super Admin",
    },
  });

  const passwordHash = await bcrypt.hash(config.superAdminPassword, 12);

  const superAdmin = await prisma.platformUser.upsert({
    where: { email: config.superAdminEmail },
    update: {
      passwordHash,
      status: "ACTIVE",
    },
    create: {
      email: config.superAdminEmail,
      passwordHash,
      status: "ACTIVE",
    },
  });

  await prisma.platformUserRole.upsert({
    where: {
      userId_roleId: {
        userId: superAdmin.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: superAdmin.id,
      roleId: superAdminRole.id,
    },
  });

  console.log(`Seeded Super Admin: ${superAdmin.email}`);
};

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
