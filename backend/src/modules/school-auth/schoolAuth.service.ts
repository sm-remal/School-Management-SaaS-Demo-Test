import { Pool } from "pg";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import config from "../../config";
import { prisma } from "../../shared/prisma";
import { buildTenantDatabaseUrl } from "../school/school.service";
import { AppError } from "../../errors/AppError";
import type {
  SchoolLoginRequest,
  SchoolLoginResponse,
} from "./schoolAuth.interface";

interface TenantUserRow {
  id: string;
  email: string;
  password_hash: string;
  status: string;
  role_code: string;
}

const login = async (
  payload: SchoolLoginRequest,
): Promise<SchoolLoginResponse> => {
  const school = await prisma.school.findUnique({
    where: { schoolEmail: payload.email },
    include: { tenantDatabase: true },
  });

  if (
    !school ||
    school.status !== "ACTIVE" ||
    !school.tenantDatabase ||
    school.tenantDatabase.status !== "INITIALIZED"
  ) {
    throw new AppError(
      401,
      "Invalid school admin email or password",
      "INVALID_SCHOOL_CREDENTIALS",
    );
  }

  const tenantPool = new Pool({
    connectionString: buildTenantDatabaseUrl(school.tenantDatabase.databaseName),
  });

  try {
    const result = await tenantPool.query<TenantUserRow>(
      `
        SELECT users.id, users.email, users.password_hash, users.status, roles.code AS role_code
        FROM users
        JOIN roles ON roles.id = users.role_id
        WHERE users.email = $1
        LIMIT 1
      `,
      [payload.email],
    );
    const tenantUser = result.rows[0];

    if (!tenantUser || tenantUser.status !== "ACTIVE") {
      throw new AppError(
        401,
        "Invalid school admin email or password",
        "INVALID_SCHOOL_CREDENTIALS",
      );
    }

    const isPasswordValid = await bcrypt.compare(
      payload.password,
      tenantUser.password_hash,
    );

    if (!isPasswordValid) {
      throw new AppError(
        401,
        "Invalid school admin email or password",
        "INVALID_SCHOOL_CREDENTIALS",
      );
    }

    const accessToken = jwt.sign(
      {
        userId: tenantUser.id,
        email: tenantUser.email,
        roles: [tenantUser.role_code],
        schoolId: school.id,
        databaseName: school.tenantDatabase.databaseName,
      },
      config.jwtSecret,
      { expiresIn: "1d" },
    );

    return {
      user: {
        id: tenantUser.id,
        email: tenantUser.email,
        role: tenantUser.role_code,
        schoolId: school.id,
        schoolName: school.schoolName,
      },
      accessToken,
    };
  } finally {
    await tenantPool.end();
  }
};

export const schoolAuthService = {
  login,
};
