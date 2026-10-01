import { invitations } from "./../db/schema";
import type { NextFunction, Request, Response } from "express";
import type { InvitationStatusEnum } from "../services/invitation.services";
import {
  createInvitationService,
  fetchSentInvitationsService,
  acceptInvitationService,
  deleteInvitationService,
  fetchReceivedInvitationsService,
} from "../services/invitation.services";
import { StatusCodes } from "http-status-codes";

export async function fetchSentInvitationsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user!.userId;
  const status = req.query.status as InvitationStatusEnum;
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  try {
    const invitations = await fetchSentInvitationsService(
      userId,
      status,
      page,
      pageSize,
    );
    res.status(StatusCodes.ACCEPTED).json({
      message: "Invitations fetched successfully.",
      data: invitations,
    });
  } catch (err) {
    next(err);
  }
}

export async function fetchReceivedInvitationsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user!.userId;
  const status = req.query.status as InvitationStatusEnum;
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  try {
    const invitations = await fetchReceivedInvitationsService(
      userId,
      status,
      page,
      pageSize,
    );
    res.status(StatusCodes.ACCEPTED).json({
      message: "Invitations fetched successfully.",
      data: invitations,
    });
  } catch (err) {
    next(err);
  }
}

export async function createInvitationController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user!.userId;
  const { addictionId } = req.body;
  try {
    const {newInvitation, invitationLink} = await createInvitationService(userId, addictionId);
    res.status(StatusCodes.CREATED).json({
      message: "Invitation created successfully",
      data: { newInvitation, invitationLink },
    });
  } catch (err) {
    next(err);
  }
}

export async function acceptInvitationController(
  req: Request<{ token: string }>,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user!.userId;
  const token = req.params.token;

  try {
    await acceptInvitationService(userId, token);
    res
      .status(StatusCodes.ACCEPTED)
      .send({ message: "Invitation accepted successfully" });
  } catch (err) {
    next(err);
  }
}

export async function deleteInvitationController(
  req: Request<{ invitationId: string }>,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user!.userId;
  const invitationId = req.params.invitationId;

  try {
    await deleteInvitationService(userId, invitationId);
    res
      .status(StatusCodes.NO_CONTENT)
      .json({ message: "Invitation deleted successfully" });
  } catch (err) {
    throw err;
  }
}
