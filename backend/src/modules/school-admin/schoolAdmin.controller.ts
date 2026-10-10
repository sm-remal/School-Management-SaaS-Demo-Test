import type { Response } from "express";
import type { SchoolAuthenticatedRequest } from "../../shared/schoolAuth.middleware";
import { schoolAdminService } from "./schoolAdmin.service";

const getMe = async (req: SchoolAuthenticatedRequest, res: Response) => {
  if (!req.schoolUser) {
    res.status(401).json({
      success: false,
      message: "School authentication token is required",
    });
    return;
  }

  try {
    const profile = await schoolAdminService.getProfile(req.schoolUser);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Profile not found",
    });
  }
};

export const schoolAdminController = {
  getMe,
};
