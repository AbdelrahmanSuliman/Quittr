import * as z from "zod";

const minLength = 6;
const maxLength = 255;

export const UserLoginSchema = z.object({
  email: z
    .email()
    .nonempty("Email is required")
    .min(minLength, `Email must be at least ${minLength} characters long`)
    .max(maxLength),
  password: z
    .string()
    .nonempty("Password is required")
    .min(minLength, `Password must be at least ${minLength} characters long`)
    .max(maxLength),
});

export const UserSignupSchema = z.object({
  username: z
    .string()
    .nonempty("Username is required")
    .min(minLength, `Username must be at least ${minLength} characters long`)
    .max(255),
  email: z
    .email("Invalid email format")
    .nonempty("Email is required")
    .min(minLength, `Email must be at least ${minLength} characters long`)
    .max(255),
  password: z
    .string()
    .nonempty("Password is required")
    .min(minLength, `Password must be at least ${minLength} characters long`)
    .max(255),
});
