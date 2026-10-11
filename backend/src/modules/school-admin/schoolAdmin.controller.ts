import type { Response } from "express";
import type { SchoolAuthenticatedRequest } from "../../middleware/schoolAuth";
import { schoolAdminService } from "./schoolAdmin.service";
import { AppError } from "../../errors/AppError";

const getMe = async (req: SchoolAuthenticatedRequest, res: Response) => {
  if (!req.schoolUser) {
    throw new AppError(
      401,
      "School authentication token is required",
      "SCHOOL_AUTH_TOKEN_REQUIRED",
    );
  }

  const profile = await schoolAdminService.getProfile(req.schoolUser);

  res.json({
    success: true,
    data: profile,
  });
};

export const schoolAdminController = {
  getMe,
};
