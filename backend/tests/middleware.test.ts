import { describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";
import { validateData } from "../src/middleware/validation.middleware";
import verifyToken from "../src/middleware/verifyToken.middleware";
import { z } from "zod";

describe("request middleware", () => {
  it("calls next with structured validation errors for invalid input", () => {
    const next = vi.fn();
    validateData({ body: z.object({ name: z.string().min(1) }) })({ body: { name: "" } } as any, {} as any, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400, errorMessages: expect.any(Object) }));
  });
  it("rejects requests without a token", () => {
    const next = vi.fn();
    verifyToken({ cookies: {} } as any, {} as any, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401, message: "Token required" }));
  });
  it("rejects malformed or expired tokens", () => {
    const next = vi.fn();
    verifyToken({ cookies: { token: "not-a-jwt" } } as any, {} as any, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401, message: "Invalid or expired token" }));
  });
  it("attaches a valid token payload to the request", () => {
    const next = vi.fn();
    const token = jwt.sign({ userId: "u1", username: "alice" }, process.env.JWT_SECRET_KEY ?? "test-secret");
    const req = { cookies: { token } } as any;
    verifyToken(req, {} as any, next);
    expect(req.user).toEqual(expect.objectContaining({ userId: "u1", username: "alice" }));
    expect(next).toHaveBeenCalledWith();
  });
});
