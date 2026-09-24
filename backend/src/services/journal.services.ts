import { journalEntries } from "./../db/schema";
import db from "../db/index";
import * as t from "../db/schema";
import { eq, lt, gte, ne, and, asc, exists } from "drizzle-orm";
import { AppError, ConflictError, NotFoundError } from "../util/error";
import logger from "../util/logger";

export async function addJournalEntryService(
  userId: string,
  addictionId: string,
  succeeded: boolean,
  content: string,
  targetDate: string,
) {
  const [authorizedAddiction] = await db
    .select()
    .from(t.addictions)
    .where(
      and(eq(t.addictions.id, addictionId), eq(t.addictions.userId, userId)),
    )
    .limit(1);

  if (!authorizedAddiction) {
    throw new NotFoundError("Addiction record not found or access denied");
  }

  const [entryExistsThatDate] = await db
    .select()
    .from(t.journalEntries)
    .where(
      and(
        eq(t.journalEntries.date, targetDate),
        eq(t.journalEntries.addictionId, addictionId),
      ),
    );

  if (entryExistsThatDate)
    throw new ConflictError(
      "Entry already exists for that day for that addiction",
    );

  const [newEntry] = await db
    .insert(t.journalEntries)
    .values({ content, succeeded, addictionId, date: targetDate })
    .returning();

  return newEntry;
}

export async function getAllJournalEntriesService(
  userId: string,
  addictionId: string,
  page: number = 1,
  limit: number = 10,
) {
  const offset = (page - 1) * limit;

  const journalEntries = await db
    .select({
      id: t.journalEntries.id,
      content: t.journalEntries.content,
      succeeded: t.journalEntries.succeeded,
      date: t.journalEntries.date,
      addictionId: t.journalEntries.addictionId,
      createdAt: t.journalEntries.createdAt,
      updatedAt: t.journalEntries.updatedAt,
    })
    .from(t.journalEntries)
    .innerJoin(t.addictions, eq(t.journalEntries.addictionId, t.addictions.id))
    .where(
      and(
        eq(t.journalEntries.addictionId, addictionId),
        eq(t.addictions.userId, userId),
      ),
    )
    .orderBy(asc(t.journalEntries.date))
    .limit(limit)
    .offset(offset);
  if (!journalEntries[0])
    throw new NotFoundError("No journals exist for this addiction");

  return journalEntries;
}

export async function getJournalEntryByDateService(
  userId: string,
  addictionId: string,
  date: string,
) {
  const journalEntries = await db
    .select({
      id: t.journalEntries.id,
      content: t.journalEntries.content,
      succeeded: t.journalEntries.succeeded,
      date: t.journalEntries.date,
      addictionId: t.journalEntries.addictionId,
      createdAt: t.journalEntries.createdAt,
      updatedAt: t.journalEntries.updatedAt,
    })
    .from(t.journalEntries)
    .innerJoin(t.addictions, eq(t.journalEntries.addictionId, t.addictions.id))
    .where(
      and(
        eq(t.journalEntries.addictionId, addictionId),
        eq(t.addictions.userId, userId),
        eq(t.journalEntries.date, date),
      ),
    );

  if (!journalEntries[0])
    throw new NotFoundError("No journal exists for this date");

  return journalEntries[0];
}


export async function getAllPartneredJournalEntriesService(
  userId: string,
  addictionId: string,
  page: number = 1,
  limit: number = 10,
) {
  const offset = (page - 1) * limit;
  const journalEntries = await db
    .select({
      id: t.journalEntries.id,
      content: t.journalEntries.content,
      succeeded: t.journalEntries.succeeded,
      date: t.journalEntries.date,
      addictionId: t.journalEntries.addictionId,
      createdAt: t.journalEntries.createdAt,
      updatedAt: t.journalEntries.updatedAt,
    })
    .from(t.journalEntries)
    .innerJoin(t.addictions, eq(t.journalEntries.addictionId, t.addictions.id))
    .where(
      and(
        eq(t.journalEntries.addictionId, addictionId),
        eq(t.addictions.partnerId, userId),
      ),
    )
    .orderBy(asc(t.journalEntries.date))
    .limit(limit)
    .offset(offset);
  if (!journalEntries[0])
    throw new NotFoundError("No journals exist for this addiction");

  return journalEntries;
}

export async function updateJournalEntryService(
  userId: string,
  entryId: string,
  addictionId: string,
  succeeded: boolean,
  content: string,
  targetDate: string,
) {
  const [authorizedAddiction] = await db
    .select()
    .from(t.addictions)
    .where(
      and(eq(t.addictions.id, addictionId), eq(t.addictions.userId, userId)),
    )
    .limit(1);

  if (!authorizedAddiction) {
    throw new NotFoundError("Addiction record not found or access denied");
  }

  const result = await db
    .update(t.journalEntries)
    .set({ content, succeeded, date: targetDate })
    .where(
      and(
        eq(t.journalEntries.id, entryId),
        eq(t.journalEntries.addictionId, addictionId),
      ),
    )
    .returning();

  if (result.length === 0) {
    throw new NotFoundError("Journal entry not found");
  }

  return result[0];
}
export async function deleteJournalEntryService(
  userId: string,
  entryId: string,
  addictionId: string,
) {
  const [deletedEntry] = await db
    .delete(t.journalEntries)
    .where(
      and(
        eq(t.journalEntries.id, entryId),
        eq(t.journalEntries.addictionId, addictionId),
        exists(
          db
            .select()
            .from(t.addictions)
            .where(
              and(
                eq(t.addictions.id, addictionId),
                eq(t.addictions.userId, userId),
              ),
            ),
        ),
      ),
    )
    .returning();

  if (!deletedEntry) {
    throw new NotFoundError("Journal entry not found");
  }

  return deletedEntry;
}
