import { eq, and, desc } from "drizzle-orm";
import db from "../db/index";
import * as t from "../db/schema";
import { AppError, ConflictError, NotFoundError } from "../util/error";
import { StatusCodes } from "http-status-codes";

export async function createAddictionService(name: string, userId: string) {
  const [newAddiction] = await db
    .insert(t.addictions)
    .values({ name, userId })
    .returning();
  if (!newAddiction)
    throw new AppError(
      "Failed to create addiction",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  return newAddiction;
}

export async function fetchAllAddictionsService(
  userId: string,
  page: number = 1,
  pageSize: number = 10,
) {
  const addictions = await db
    .select()
    .from(t.addictions)
    .where(eq(t.addictions.userId, userId))
    .orderBy(desc(t.addictions.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
  return addictions;
}


export async function fetchAllPartneredAddictionsService(
  userId: string,
  page: number = 1,
  pageSize: number = 10,
) {
  const addictions = await db
    .select({
      id: t.addictions.id,
      name: t.addictions.name,
      userId: t.addictions.userId,
      createdAt: t.addictions.createdAt,
    })
    .from(t.addictions)
    .innerJoin(t.invitations, eq(t.invitations.addictionId, t.addictions.id))
    .where(
      and(
        eq(t.invitations.receiverId, userId),
        eq(t.invitations.status, "accepted"),
      ),
    )
    .orderBy(desc(t.addictions.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return addictions;
}

export async function updateAddictionService(
  addictionId: string,
  addictionName: string,
  userId: string,
) {
  const [updatedAddiction] = await db
    .update(t.addictions)
    .set({ name: addictionName })
    .where(
      and(eq(t.addictions.id, addictionId), eq(t.addictions.userId, userId)),
    )
    .returning();

  if (!updatedAddiction) throw new NotFoundError("Addiction not found.");
}
export async function deleteAddictionService(
  addictionId: string,
  userId: string,
) {
  const [deletedAddiction] = await db
    .delete(t.addictions)
    .where(
      and(eq(t.addictions.id, addictionId), eq(t.addictions.userId, userId)),
    )
    .returning();

  if (!deletedAddiction) {
    throw new NotFoundError("Addiction not found.");
  }

  return deletedAddiction;
}
