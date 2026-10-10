import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import * as bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../shared/prisma";
import type { CreateSchoolRequest } from "./school.interface";

const quoteIdentifier = (identifier: string) => {
  if (!/^[a-z][a-z0-9_]*$/.test(identifier)) {
    throw new Error("Invalid database identifier");
  }

  return `"${identifier}"`;
};

const buildTenantDatabaseUrl = (databaseName: string) => {
  const baseUrl = config.postgresAdminUrl || config.databaseUrl;

  if (!baseUrl) {
    throw new Error("POSTGRES_ADMIN_URL or DATABASE_URL is required");
  }

  const url = new URL(baseUrl);
  url.pathname = `/${databaseName}`;
  return url.toString();
};

const createTenantDatabase = async (databaseName: string) => {
  const adminUrl = config.postgresAdminUrl || config.databaseUrl;

  if (!adminUrl) {
    throw new Error("POSTGRES_ADMIN_URL or DATABASE_URL is required");
  }

  const pool = new Pool({ connectionString: adminUrl });

  try {
    await pool.query(`CREATE DATABASE ${quoteIdentifier(databaseName)}`);
  } finally {
    await pool.end();
  }
};

const initializeTenantDatabase = async (
  databaseName: string,
  payload: CreateSchoolRequest,
) => {
  const tenantPool = new Pool({
    connectionString: buildTenantDatabaseUrl(databaseName),
  });

  const passwordHash = await bcrypt.hash(payload.initialAdminPassword, 12);

  try {
    await tenantPool.query("BEGIN");
    await tenantPool.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id UUID PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await tenantPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(320) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role_id UUID NOT NULL REFERENCES roles(id),
        status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await tenantPool.query(`
      CREATE TABLE IF NOT EXISTS school_settings (
        id UUID PRIMARY KEY,
        school_name VARCHAR(200) NOT NULL,
        school_email VARCHAR(320) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    const roleId = randomUUID();
    const adminUserId = randomUUID();
    const settingsId = randomUUID();

    await tenantPool.query(
      `
        INSERT INTO roles (id, code, name)
        VALUES ($1, 'SCHOOL_ADMIN', 'School Admin')
        ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
      `,
      [roleId],
    );
    await tenantPool.query(
      `
        INSERT INTO users (id, email, password_hash, role_id)
        VALUES ($1, $2, $3, (SELECT id FROM roles WHERE code = 'SCHOOL_ADMIN'))
        ON CONFLICT (email) DO NOTHING
      `,
      [adminUserId, payload.schoolEmail, passwordHash],
    );
    await tenantPool.query(
      `
        INSERT INTO school_settings (id, school_name, school_email)
        VALUES ($1, $2, $3)
      `,
      [settingsId, payload.schoolName, payload.schoolEmail],
    );
    await tenantPool.query("COMMIT");
  } catch (error) {
    await tenantPool.query("ROLLBACK");
    throw error;
  } finally {
    await tenantPool.end();
  }
};

const listSchools = async () => {
  return prisma.school.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      tenantDatabase: true,
    },
  });
};

const createSchool = async (payload: CreateSchoolRequest, actorUserId: string) => {
  const databaseName = `school_${randomUUID().replace(/-/g, "").slice(0, 24)}`;

  const school = await prisma.school.create({
    data: {
      schoolName: payload.schoolName,
      schoolEmail: payload.schoolEmail,
      status: "PROVISIONING",
      tenantDatabase: {
        create: {
          databaseName,
          status: "PENDING",
        },
      },
      auditLogs: {
        create: {
          actorUserId,
          action: "SCHOOL_PROVISIONING_STARTED",
          metadata: {
            databaseName,
            schoolEmail: payload.schoolEmail,
          },
        },
      },
    },
    include: {
      tenantDatabase: true,
    },
  });

  try {
    await createTenantDatabase(databaseName);

    await prisma.tenantDatabase.update({
      where: { schoolId: school.id },
      data: { status: "CREATED" },
    });

    await initializeTenantDatabase(databaseName, payload);

    const activeSchool = await prisma.school.update({
      where: { id: school.id },
      data: {
        status: "ACTIVE",
        errorMessage: null,
        tenantDatabase: {
          update: {
            status: "INITIALIZED",
            errorMessage: null,
          },
        },
        auditLogs: {
          create: {
            actorUserId,
            action: "SCHOOL_PROVISIONING_COMPLETED",
            metadata: { databaseName },
          },
        },
      },
      include: {
        tenantDatabase: true,
      },
    });

    return activeSchool;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Provisioning failed";

    return prisma.school.update({
      where: { id: school.id },
      data: {
        status: "FAILED",
        errorMessage: message,
        tenantDatabase: {
          update: {
            status: "FAILED",
            errorMessage: message,
          },
        },
        auditLogs: {
          create: {
            actorUserId,
            action: "SCHOOL_PROVISIONING_FAILED",
            metadata: {
              databaseName,
              error: message,
            },
          },
        },
      },
      include: {
        tenantDatabase: true,
      },
    });
  }
};

export const schoolService = {
  listSchools,
  createSchool,
};
