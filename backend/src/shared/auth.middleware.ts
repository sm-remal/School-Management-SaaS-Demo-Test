import type { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config";

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

interface AuthPayload {
    userId: string;
    email: string;
    roles: string[];
}

const getBearerToken = (authorizationHeader: string | undefined) => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");
  return scheme === "Bearer" && token ? token : null;
};

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Authentication token is required",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as Partial<AuthPayload>;

    if (
      typeof decoded.userId !== "string" ||
      typeof decoded.email !== "string" ||
      !Array.isArray(decoded.roles)
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token payload",
      });
      return;
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      roles: decoded.roles.filter((role): role is string => typeof role === "string"),
    };
    next();
  } catch (_error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};

export const requireSuperAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user?.roles.includes("SUPER_ADMIN")) {
    res.status(403).json({
      success: false,
      message: "Super Admin permission is required",
    });
    return;
  }

  next();
};
