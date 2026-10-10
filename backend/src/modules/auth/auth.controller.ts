import type { Request, Response } from "express";
import { authService } from "./auth.service";
import { validateLoginInput } from "./auth.validation";
import type { LoginRequest } from "./auth.interface";

const login = async (req: Request, res: Response) => {
  const payload = req.body as Partial<LoginRequest>;
  const validation = validateLoginInput(payload);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.errors,
    });
    return;
  }

  try {
    const result = await authService.login(payload as LoginRequest);

    res.json({
      success: true,
      data: result,
    });
  } catch (_error) {
    res.status(501).json({
      success: false,
      message: "Auth login is not implemented yet",
    });
  }
};

export const authController = {
  login,
};
