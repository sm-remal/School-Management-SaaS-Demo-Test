import type { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config";

export interface SchoolAuthenticatedRequest extends Request {
  schoolUser?: {
    userId: string;
    email: string;
    roles: string[];
    schoolId: string;
    databaseName: string;
  };
}

export const requireSchoolAuth = (
  req: SchoolAuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const [scheme, token] = (req.headers.authorization || "").split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({
      success: false,
      message: "School authentication token is required",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as
      | Partial<SchoolAuthenticatedRequest["schoolUser"]>
      | undefined;

    if (
      !decoded ||
      typeof decoded.userId !== "string" ||
      typeof decoded.email !== "string" ||
      !Array.isArray(decoded.roles) ||
      typeof decoded.schoolId !== "string" ||
      typeof decoded.databaseName !== "string"
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid school authentication token payload",
      });
      return;
    }

    req.schoolUser = {
      userId: decoded.userId,
      email: decoded.email,
      roles: decoded.roles.filter(
        (role): role is string => typeof role === "string",
      ),
      schoolId: decoded.schoolId,
      databaseName: decoded.databaseName,
    };
    next();
  } catch (_error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired school authentication token",
    });
  }
};
