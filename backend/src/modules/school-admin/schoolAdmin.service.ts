import { Pool } from "pg";
import { buildTenantDatabaseUrl } from "../school/school.service";
import type { SchoolAdminProfile } from "./schoolAdmin.interface";
import { AppError } from "../../errors/AppError";

interface TenantProfileRow {
  user_id: string;
  user_email: string;
  user_status: string;
  role_code: string;
  school_name: string;
  school_email: string;
}

const getProfile = async (payload: {
  userId: string;
  schoolId: string;
  databaseName: string;
}): Promise<SchoolAdminProfile> => {
  const pool = new Pool({
    connectionString: buildTenantDatabaseUrl(payload.databaseName),
  });

  try {
    const result = await pool.query<TenantProfileRow>(
      `
        SELECT
          users.id AS user_id,
          users.email AS user_email,
          users.status AS user_status,
          roles.code AS role_code,
          school_settings.school_name,
          school_settings.school_email
        FROM users
        JOIN roles ON roles.id = users.role_id
        CROSS JOIN school_settings
        WHERE users.id = $1
        ORDER BY school_settings.created_at DESC
        LIMIT 1
      `,
      [payload.userId],
    );
    const profile = result.rows[0];

    if (!profile) {
      throw new AppError(404, "School profile not found", "PROFILE_NOT_FOUND");
    }

    return {
      user: {
        id: profile.user_id,
        email: profile.user_email,
        role: profile.role_code,
        status: profile.user_status,
      },
      school: {
        id: payload.schoolId,
        name: profile.school_name,
        email: profile.school_email,
        databaseName: payload.databaseName,
      },
    };
  } finally {
    await pool.end();
  }
};

export const schoolAdminService = {
  getProfile,
};
