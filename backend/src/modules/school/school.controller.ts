import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth";
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

const getSchoolIdParam = (req: AuthenticatedRequest) => {
  const schoolId = req.params.id;

  if (typeof schoolId !== "string" || !schoolId) {
    throw new AppError(400, "School id is required", "SCHOOL_ID_REQUIRED");
  }

  return schoolId;
};

const changeSchoolStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  status: "ACTIVE" | "SUSPENDED",
) => {
  if (!req.user?.userId) {
    throw new AppError(
      401,
      "Authentication token is required",
      "AUTH_TOKEN_REQUIRED",
    );
  }

  const school = await schoolService.updateSchoolStatus(
    getSchoolIdParam(req),
    status,
    req.user.userId,
  );

  res.json({
    success: true,
    data: school,
    message:
      status === "ACTIVE"
        ? "School activated successfully"
        : "School deactivated successfully",
  });
};

const activateSchool = async (req: AuthenticatedRequest, res: Response) => {
  await changeSchoolStatus(req, res, "ACTIVE");
};

const deactivateSchool = async (req: AuthenticatedRequest, res: Response) => {
  await changeSchoolStatus(req, res, "SUSPENDED");
};

const permanentlyDeleteSchool = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  if (!req.user?.userId) {
    throw new AppError(
      401,
      "Authentication token is required",
      "AUTH_TOKEN_REQUIRED",
    );
  }

  const confirmationSchoolName =
    typeof req.body?.schoolName === "string" ? req.body.schoolName : "";

  const deletedSchool = await schoolService.permanentlyDeleteSchool(
    getSchoolIdParam(req),
    confirmationSchoolName,
    req.user.userId,
  );

  res.json({
    success: true,
    data: deletedSchool,
    message: "School permanently deleted successfully",
  });
};

export const schoolController = {
  listSchools,
  createSchool,
  activateSchool,
  deactivateSchool,
  permanentlyDeleteSchool,
};
