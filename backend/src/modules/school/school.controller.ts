import type { Response } from "express";
import type { AuthenticatedRequest } from "../../shared/auth.middleware";
import { schoolService } from "./school.service";
import type { CreateSchoolRequest } from "./school.interface";
import { validateCreateSchoolInput } from "./school.validation";

const listSchools = async (_req: AuthenticatedRequest, res: Response) => {
  const schools = await schoolService.listSchools();

  res.json({
    success: true,
    data: schools,
  });
};

const createSchool = async (req: AuthenticatedRequest, res: Response) => {
  const payload = req.body as Partial<CreateSchoolRequest>;
  const validation = validateCreateSchoolInput(payload);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.errors,
    });
    return;
  }

  if (!req.user?.userId) {
    res.status(401).json({
      success: false,
      message: "Authentication token is required",
    });
    return;
  }

  try {
    const school = await schoolService.createSchool(
      payload as CreateSchoolRequest,
      req.user.userId,
    );

    res.status(school.status === "ACTIVE" ? 201 : 500).json({
      success: school.status === "ACTIVE",
      data: school,
      message:
        school.status === "ACTIVE"
          ? "School created successfully"
          : "School provisioning failed",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "School create failed";

    res.status(409).json({
      success: false,
      message,
    });
  }
};

export const schoolController = {
  listSchools,
  createSchool,
};
