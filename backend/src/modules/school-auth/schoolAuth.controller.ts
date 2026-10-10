import type { Request, Response } from "express";
import type { SchoolLoginRequest } from "./schoolAuth.interface";
import { schoolAuthService } from "./schoolAuth.service";
import { validateSchoolLoginInput } from "./schoolAuth.validation";

const login = async (req: Request, res: Response) => {
  const payload = req.body as Partial<SchoolLoginRequest>;
  const validation = validateSchoolLoginInput(payload);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.errors,
    });
    return;
  }

  try {
    const result = await schoolAuthService.login(payload as SchoolLoginRequest);

    res.json({
      success: true,
      data: result,
    });
  } catch (_error) {
    res.status(401).json({
      success: false,
      message: "Invalid school admin email or password",
    });
  }
};

export const schoolAuthController = {
  login,
};
