"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schoolAdminService = void 0;
const pg_1 = require("pg");
const school_service_1 = require("../school/school.service");
const getProfile = async (payload) => {
    const pool = new pg_1.Pool({
        connectionString: (0, school_service_1.buildTenantDatabaseUrl)(payload.databaseName),
    });
    try {
        const result = await pool.query(`
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
      `, [payload.userId]);
        const profile = result.rows[0];
        if (!profile) {
            throw new Error("School profile not found");
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
    }
    finally {
        await pool.end();
    }
};
exports.schoolAdminService = {
    getProfile,
};
//# sourceMappingURL=schoolAdmin.service.js.map