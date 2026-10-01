import * as z from "zod";

const maxLength = 255;

export const CreateAddictionSchema = z.object({
  name: z.string("Name must be a string").nonempty().max(maxLength),
});

export const UpdateAddictionSchema = z.object({
  name: z.string("Name must be a string").nonempty().max(maxLength),
});
