import { and, eq, asc } from "drizzle-orm";
import db from "../db/index";
import * as t from "../db/schema";
import { ConflictError, ForbiddenError, NotFoundError } from "../util/error";
import logger from "../util/logger";
import config from "../config";

export type InvitationStatusEnum = "accepted" | "pending" | "rejected";

export async function fetchSentInvitationsService(
  userId: string,
  status: InvitationStatusEnum,
  page: number = 1,
  pageSize: number = 10,
) {
  return await db
    .select()
    .from(t.invitations)
    .where(
      and(eq(t.invitations.status, status), eq(t.invitations.senderId, userId)),
    )
    .orderBy(asc(t.invitations.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function fetchReceivedInvitationsService(
  userId: string,
  status: InvitationStatusEnum,
  page: number = 1,
  pageSize: number = 10,
) {
  return await db
    .select()
    .from(t.invitations)
    .where(
      and(
        eq(t.invitations.status, status),
        eq(t.invitations.receiverId, userId),
      ),
    )
    .orderBy(asc(t.invitations.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function createInvitationService(
  senderId: string,
  addictionId: string,
) {
  const [existingInvitation] = await db
    .select()
    .from(t.invitations)
    .where(
      and(
        eq(t.invitations.senderId, senderId),
        eq(t.invitations.addictionId, addictionId),
        eq(t.invitations.status, "pending"),
      ),
    );

  if (existingInvitation) {
    throw new ConflictError(
      "A pending invitation already exists for this addiction.",
    );
  }
  const [newInvitation] = await db
    .insert(t.invitations)
    .values({
      senderId,
      addictionId,
    })
    .returning();
  const invitationLink = `${config.frontendUrl}/invite/${newInvitation?.token}`;
  logger.info(newInvitation);
  return { newInvitation, invitationLink };
}

export async function acceptInvitationService(
  currentUserId: string,
  token: string,
) {
  const [result] = await db
    .select({
      invitation: t.invitations,
      addiction: t.addictions,
    })
    .from(t.invitations)
    .innerJoin(t.addictions, eq(t.invitations.addictionId, t.addictions.id))
    .where(eq(t.invitations.token, token));

  if (!result) throw new NotFoundError("Invitation does not exist.");

  const { invitation, addiction } = result;

  if (invitation.senderId === currentUserId) {
    throw new ForbiddenError("You cannot accept your own invitation.");
  }

  if (invitation.status !== "pending")
    throw new ConflictError(
      `Cannot accept invitation with status ${invitation.status}.`,
    );

  if (!addiction) {
    throw new NotFoundError("Addiction does not exist.");
  }

  if (addiction.partnerId) {
    throw new ConflictError("This addiction already has a partner.");
  }

  await db.transaction(async (tx) => {
    await tx
      .update(t.invitations)
      .set({
        status: "accepted",
        receiverId: currentUserId,
      })
      .where(eq(t.invitations.id, invitation.id));
    await tx
      .update(t.addictions)
      .set({ partnerId: currentUserId })
      .where(eq(t.addictions.id, invitation.addictionId));
  });
}

export async function deleteInvitationService(
  senderId: string,
  invitationId: string,
) {
  const [deleted] = await db
    .delete(t.invitations)
    .where(
      and(
        eq(t.invitations.id, invitationId),
        eq(t.invitations.senderId, senderId),
      ),
    )
    .returning();

  if (!deleted) {
    throw new NotFoundError("Invitation not found or unauthorized to delete.");
  }
}
