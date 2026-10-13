import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import config from "../config";

let prismaClient: PrismaClient | undefined;

const createPrismaClient = () => {
  if (!config.databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const adapter = new PrismaPg(config.databaseUrl);

  return new PrismaClient({
    adapter,
  });
};

const getPrismaClient = () => {
  prismaClient ??= createPrismaClient();
  return prismaClient;
};

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    const value = Reflect.get(getPrismaClient(), property, receiver);
    return typeof value === "function" ? value.bind(getPrismaClient()) : value;
  },
});
