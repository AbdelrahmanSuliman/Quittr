import type { NextFunction, Request, Response } from "express";
import {
  signupService,
  loginService,
  getCurrentUserService,
} from "../services/auth.services";
import { StatusCodes } from "http-status-codes";
import generateToken from "../util/generateToken";
import config from "../config";

export async function signupController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { username, email, password } = req.body;

  try {
    const user = await signupService(username, email, password);
    const token = generateToken(user.id, user.username);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: config.nodeEnv === "production" ? "none" : "lax",
      secure: config.nodeEnv === "production",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });
    res
      .status(StatusCodes.CREATED)
      .send({ message: "User signed up successfully", data: { user } });
  } catch (err) {
    next(err);
  }
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email, password } = req.body;
  try {
    const user = await loginService(email, password);
    const token = generateToken(user.id, user.username);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: config.nodeEnv === "production",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });
    res
      .status(StatusCodes.OK)
      .send({ message: "User logged in successfully", data: { user } });
  } catch (err) {
    next(err);
  }
}

export async function getCurrentUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user!.userId;

  try {
    const user = await getCurrentUserService(userId);
    res
      .status(StatusCodes.OK)
      .send({ message: "User fetched successfully", data: { user } });
  } catch (err) {
    next(err);
  }
}

export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "lax"
    })
    res.status(StatusCodes.OK).json({
      message: "User logged out successfully"
    })
  } catch (err) {
    next(err)
  }
}

