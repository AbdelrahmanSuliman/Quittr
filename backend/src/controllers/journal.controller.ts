import { StatusCodes } from "http-status-codes";
import {
  addJournalEntryService,
  updateJournalEntryService,
  getAllJournalEntriesService,
  deleteJournalEntryService,
  getAllPartneredJournalEntriesService,
  getJournalEntryByDateService,
} from "../services/journal.services";
import type { NextFunction, Request, Response } from "express";

export async function addJournalEntryController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user!.userId;
  const { addictionId, succeeded, content, targetDate } = req.body;
  try {
    const newEntry = await addJournalEntryService(
      userId,
      addictionId,
      succeeded,
      content,
      targetDate,
    );
    res
      .status(StatusCodes.CREATED)
      .send({ message: "Entry created successfully", data: newEntry });
  } catch (err) {
    next(err);
  }
}

export async function updateJournalEntryController(
  req: Request<{ entryId: string }>,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user!.userId;
  const entryId = req.params.entryId;
  const { addictionId, succeeded, content, targetDate } = req.body;
  try {
    await updateJournalEntryService(
      userId,
      entryId,
      addictionId,
      succeeded,
      content,
      targetDate,
    );
    res
      .status(StatusCodes.OK)
      .send({ message: "Journal updated successfully" });
  } catch (err) {
    next(err);
  }
}

export async function getAllJournalEntriesController(
  req: Request<{ addictionId: string }>,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user!.userId;
  const addictionId = req.params.addictionId;
  try {
    const journalEntries = await getAllJournalEntriesService(
      userId,
      addictionId,
    );
    res
      .status(StatusCodes.OK)
      .send({ message: "Journals fetched successfully", data: journalEntries });
  } catch (err) {
    next(err);
  }
}

export async function getJournalEntryByDateController(
  req: Request<{ addictionId: string }, {}, {}, { date: string }>,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user!.userId;
  const addictionId = req.params.addictionId;
  const date = req.query.date;
  try {
    const journalEntry = await getJournalEntryByDateService(
      userId,
      addictionId,
      date,
    );
    res
      .status(StatusCodes.OK)
      .send({ message: "Journal fetched successfully", data: journalEntry });
  } catch (err) {
    next(err);
  }
}

export async function getAllPartneredJournalEntriesController(
  req: Request<{ userId: string; addictionId: string }>,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user!.userId;
  const addictionId = req.params.addictionId;
  try {
    const journalEntries = await getAllPartneredJournalEntriesService(
      userId,
      addictionId,
    );
    res
      .status(StatusCodes.OK)
      .send({ message: "Journals fetched successfully", data: journalEntries });
  } catch (err) {
    next(err);
  }
}

export async function deleteJournalEntryController(
  req: Request<{ entryId: string; addictionId: string }>,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user!.userId;
  const addictionId = req.params.addictionId;
  const entryId = req.params.entryId;

  try {
    await deleteJournalEntryService(userId, entryId, addictionId);
    res
      .status(StatusCodes.NO_CONTENT)
      .send({ message: "Journal deleted successfully" });
  } catch (err) {
    next(err);
  }
}
