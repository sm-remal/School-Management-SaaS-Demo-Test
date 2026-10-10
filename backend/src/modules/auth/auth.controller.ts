import type { Request, Response } from "express";
import { authService } from "./auth.service";
import { validateLoginInput } from "./auth.validation";
import type { LoginRequest } from "./auth.interface";
import { AppError } from "../../errors/AppError";

const login = async (req: Request, res: Response) => {
  const payload = req.body as Partial<LoginRequest>;
  const validation = validateLoginInput(payload);

  if (!validation.success) {
    throw new AppError(
      400,
      "Validation failed",
      "VALIDATION_ERROR",
      validation.errors,
    );
  }

  const result = await authService.login(payload as LoginRequest);

  res.json({
    success: true,
    data: result,
  });
};

export const authController = {
  login,
};
