import type { NextFunction, Request, Response } from "express";
import {
  createAddictionService,
  fetchAllAddictionsService,
  deleteAddictionService,
  updateAddictionService,
  fetchAllPartneredAddictionsService
} from "../services/addiction.services";
import { StatusCodes } from "http-status-codes";

export async function createAddictionController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user!.userId;
  const { name } = req.body;
  try {
    const newAddiction = await createAddictionService(name, userId);
    res
      .status(StatusCodes.CREATED)
      .send({ message: "Addiction created successfully", data: newAddiction });
  } catch (err) {
    next(err);
  }
}

export async function fetchAddictionsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user!.userId;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  try {
    const addictions = await fetchAllAddictionsService(userId, page, limit);
    res
      .status(StatusCodes.OK)
      .send({ message: "Addictions fetched successfully", data: addictions });
  } catch (err) {
    next(err);
  }
}

export async function fetchPartneredAddictionsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user!.userId;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  try {
    const addictions = await fetchAllPartneredAddictionsService(
      userId,
      page,
      limit,
    );

    res.status(StatusCodes.OK).send({
      message: "Partnered addictions fetched successfully",
      data: addictions,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteAddictionController(
  req: Request<{ addictionId: string }>,
  res: Response,
  next: NextFunction,
) {
  const addictionId = req.params.addictionId;
  const userId = req.user!.userId;

  try {
    await deleteAddictionService(addictionId, userId);
    res
      .status(StatusCodes.OK)
      .send({ message: "Addiction deleted successfully" });
  } catch (err) {
    next(err);
  }
}

export async function updateAddictionController(
  req: Request<{ addictionId: string }>,
  res: Response,
  next: NextFunction,
) {
  const addictionId = req.params.addictionId;
  const userId = req.user!.userId;
  const { name } = req.body;
  try {
    await updateAddictionService(addictionId, name, userId);

    res
      .status(StatusCodes.OK)
      .send({ message: "Addiction updated successfully" });
  } catch (err) {
    next(err);
  }
}
