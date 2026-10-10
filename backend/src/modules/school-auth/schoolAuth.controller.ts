import type { Request, Response } from "express";
import type { SchoolLoginRequest } from "./schoolAuth.interface";
import { schoolAuthService } from "./schoolAuth.service";
import { validateSchoolLoginInput } from "./schoolAuth.validation";
import { AppError } from "../../errors/AppError";

const login = async (req: Request, res: Response) => {
  const payload = req.body as Partial<SchoolLoginRequest>;
  const validation = validateSchoolLoginInput(payload);

  if (!validation.success) {
    throw new AppError(
      400,
      "Validation failed",
      "VALIDATION_ERROR",
      validation.errors,
    );
  }

  const result = await schoolAuthService.login(payload as SchoolLoginRequest);

  res.json({
    success: true,
    data: result,
  });
};

export const schoolAuthController = {
  login,
};
