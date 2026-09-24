import express from "express";
import verifyToken from "../middleware/verifyToken.middleware";
import {
  addJournalEntryController,
  deleteJournalEntryController,
  getAllJournalEntriesController,
  updateJournalEntryController,
  getAllPartneredJournalEntriesController,
  getJournalEntryByDateController,
} from "../controllers/journal.controller";
import { validateData } from "../middleware/validation.middleware";
import {
  AddJournalEntrySchema,
  JournalDateQuerySchema,
  UpdateJournalEntrySchema,
} from "../schema/journal.schema";
import {
  AddictionAndEntryIdParamsSchema,
  AddictionIdParamSchema,
  EntryIdParamsSchema,
} from "../schema/id.schema";

const journalRouter = express.Router();

journalRouter.post(
  "/",
  verifyToken,
  validateData({ body: AddJournalEntrySchema }),
  addJournalEntryController,
);
journalRouter.patch(
  "/:entryId",
  verifyToken,
  validateData({ body: UpdateJournalEntrySchema, params: EntryIdParamsSchema }),
  updateJournalEntryController,
);
journalRouter.get(
  "/:addictionId",
  verifyToken,
  validateData({ params: AddictionIdParamSchema }),
  getAllJournalEntriesController,
);
journalRouter.get(
  "/:addictionId/date",
  verifyToken,
  validateData({
    params: AddictionIdParamSchema,
    query: JournalDateQuerySchema,
  }),
  getJournalEntryByDateController,
);
journalRouter.get(
  "/:addictionId/partnered",
  verifyToken,
  validateData({ params: AddictionIdParamSchema }),
  getAllPartneredJournalEntriesController,
);
journalRouter.delete(
  "/addictions/:addictionId/entries/:entryId",
  verifyToken,
  validateData({ params: AddictionAndEntryIdParamsSchema }),
  deleteJournalEntryController,
);

export default journalRouter;
