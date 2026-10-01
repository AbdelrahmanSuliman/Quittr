import * as z from "zod";

export const createInvitationSchema = z.object({
  addictionId: z
    .uuid("Addiction ID must be valid")
    .nonoptional("Addiction ID must be provided"),
});

export const fetchInvitationSchema = z.object({
    status: z.enum(["rejected","pending","accepted"])
})