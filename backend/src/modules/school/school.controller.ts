import type { Response } from "express";
import type { AuthenticatedRequest } from "../../shared/auth.middleware";
import { schoolService } from "./school.service";
import type { CreateSchoolRequest } from "./school.interface";
import { validateCreateSchoolInput } from "./school.validation";
import { AppError } from "../../errors/AppError";

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
    throw new AppError(
      400,
      "Validation failed",
      "VALIDATION_ERROR",
      validation.errors,
    );
  }

  if (!req.user?.userId) {
    throw new AppError(
      401,
      "Authentication token is required",
      "AUTH_TOKEN_REQUIRED",
    );
  }

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
};

export const schoolController = {
  listSchools,
  createSchool,
};
