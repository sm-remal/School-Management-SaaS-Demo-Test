import type { CreateSchoolRequest } from "./school.interface";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateCreateSchoolInput = (
  payload: Partial<CreateSchoolRequest>,
) => {
  const errors: string[] = [];

  if (!payload.schoolName || typeof payload.schoolName !== "string") {
    errors.push("School name is required");
  }

  if (!payload.schoolEmail || typeof payload.schoolEmail !== "string") {
    errors.push("School email is required");
  } else if (!emailRegex.test(payload.schoolEmail)) {
    errors.push("School email must be valid");
  }

  if (
    !payload.initialAdminPassword ||
    typeof payload.initialAdminPassword !== "string"
  ) {
    errors.push("Initial admin password is required");
  } else if (payload.initialAdminPassword.length < 8) {
    errors.push("Initial admin password must be at least 8 characters");
  }

  return {
    success: errors.length === 0,
    errors,
  };
};
