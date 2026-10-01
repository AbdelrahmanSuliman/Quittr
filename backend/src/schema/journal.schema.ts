import * as z from "zod";

const maxLength = 1000;

export const AddJournalEntrySchema = z.object({
  addictionId: z.uuid("Addiction ID must be valid"),
  content: z.string("Content must be a valid string").max(maxLength),
  succeeded: z.boolean("Succeeded must be a boolean"),
  targetDate: z.coerce.date("Target date must be valid"),
});

export const UpdateJournalEntrySchema = z.object({
  addictionId: z
    .uuid("Addiction ID must be valid")
    .nonoptional("Addiction ID must be provided"),
  content: z.string("Content must be a valid string").max(maxLength),
  succeeded: z.boolean("Succeeded must be a boolean"),
  targetDate: z.coerce.date("Target date must be valid"),
});

export const JournalDateQuerySchema = z.object({
  date: z.string().date(),
});
