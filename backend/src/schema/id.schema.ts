import * as z from "zod";

export const IDParamSchema = z.object({
  id: z.uuid("Invalid ID format"),
});

export const AddictionIdParamSchema = z.object({
  addictionId: z.uuid("Invalid addiction ID format"),
});

export const AddictionAndEntryIdParamsSchema = z.object({
  addictionId: z.uuid("Invalid addiction ID format"),
  entryId: z.uuid("Invalid entry ID format"),
});

export const EntryIdParamsSchema = z.object({
  entryId: z.uuid("Invalid entry ID format"),
});

export const InvitationTokenParamSchema = z.object({
  token: z.uuid("Invalid invitation ID format"),
});
