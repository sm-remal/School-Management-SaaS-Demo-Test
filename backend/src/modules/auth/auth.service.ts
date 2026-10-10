import type { LoginRequest, LoginResponse } from "./auth.interface";
import { prisma } from "../../shared/prisma";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import config from "../../config";
import { AppError } from "../../errors/AppError";

const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const user = await prisma.platformUser.findUnique({
    where: { email: payload.email },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user || user.status !== "ACTIVE") {
    throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
  }

  const roles = user.roles.map((userRole) => userRole.role.code);
  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      roles,
    },
    config.jwtSecret,
    { expiresIn: "1d" },
  );

  await prisma.platformUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      roles,
    },
    accessToken,
  };
};

export const authService = {
  login,
};
