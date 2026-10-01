import type { UserPayload } from "./../schema/user.payload";
import jwt from "jsonwebtoken";
import { AuthenticationError } from "./../util/error";
import type { Request, Response, NextFunction } from "express";
import config from "../config";
import logger from "../util/logger";

export default function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.token
  
  if (!token) {
    next(new AuthenticationError("Token required"));
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      config.jwt.secretKey,
    ) as unknown as UserPayload;

    req.user = decoded;

    next();
  } catch (err) {
    next(new AuthenticationError("Invalid or expired token"));
  }
}
