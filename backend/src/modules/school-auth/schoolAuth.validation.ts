import type { SchoolLoginRequest } from "./schoolAuth.interface";

export const validateSchoolLoginInput = (
  payload: Partial<SchoolLoginRequest>,
) => {
  const errors: string[] = [];

  if (!payload.email || typeof payload.email !== "string") {
    errors.push("Email is required");
  }

  if (!payload.password || typeof payload.password !== "string") {
    errors.push("Password is required");
  }

  return {
    success: errors.length === 0,
    errors,
  };
};
