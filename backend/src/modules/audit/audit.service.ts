import { prisma } from "../../shared/prisma";

const listAuditLogs = async () => {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      actor: {
        select: {
          id: true,
          email: true,
        },
      },
      school: {
        select: {
          id: true,
          schoolName: true,
          schoolEmail: true,
          status: true,
        },
      },
    },
  });
};

export const auditService = {
  listAuditLogs,
};
