import express from "express";
import verifyToken from "../middleware/verifyToken.middleware";
import {
  acceptInvitationController,
  createInvitationController,
  deleteInvitationController,
  fetchReceivedInvitationsController,
  fetchSentInvitationsController,
} from "../controllers/invitation.controller";
import { validateData } from "../middleware/validation.middleware";
import { InvitationTokenParamSchema } from "../schema/id.schema";
import {
  createInvitationSchema,
  fetchInvitationSchema,
} from "../schema/invitation.schema";

const invitationRouter = express.Router();

invitationRouter.get("/sent", verifyToken, fetchSentInvitationsController);
invitationRouter.get(
  "/received",
  verifyToken,
  validateData({ query: fetchInvitationSchema }),
  fetchReceivedInvitationsController,
);
invitationRouter.post(
  "/",
  verifyToken,
  validateData({ body: createInvitationSchema }),
  createInvitationController,
);
invitationRouter.patch(
  "/:token/accept",
  verifyToken,
  validateData({ params: InvitationTokenParamSchema }),
  acceptInvitationController,
);
invitationRouter.delete(
  "/:invitationId",
  verifyToken,
  validateData({ params: InvitationTokenParamSchema }),
  deleteInvitationController,
);

export default invitationRouter;
