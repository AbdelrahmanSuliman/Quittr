import { beforeEach, describe, expect, it, vi } from "vitest";
import { loginController, logoutController, signupController, getCurrentUserController } from "../src/controllers/auth.controller";
import { loginService, signupService, getCurrentUserService } from "../src/services/auth.services";

vi.mock("../src/services/auth.services", () => ({
  loginService: vi.fn(),
  signupService: vi.fn(),
  getCurrentUserService: vi.fn(),
}));

const serviceMocks = vi.mocked({ loginService, signupService, getCurrentUserService });

function response() {
  const res = { status: vi.fn(), send: vi.fn(), json: vi.fn(), cookie: vi.fn(), clearCookie: vi.fn() } as any;
  res.status.mockReturnValue(res); res.send.mockReturnValue(res); res.json.mockReturnValue(res);
  return res;
}

describe("auth controllers", () => {
  beforeEach(() => vi.clearAllMocks());

  it("signs up, sets an httpOnly token cookie, and returns 201", async () => {
    serviceMocks.signupService.mockResolvedValue({ id: "u1", username: "alice" } as any);
    const res = response();
    await signupController({ body: { username: "alice", email: "alice@example.com", password: "secret123" } } as any, res, vi.fn());
    expect(serviceMocks.signupService).toHaveBeenCalledWith("alice", "alice@example.com", "secret123");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.cookie).toHaveBeenCalledWith("token", expect.any(String), expect.objectContaining({ httpOnly: true }));
  });

  it("passes login failures to the error handler", async () => {
    const error = new Error("invalid credentials");
    serviceMocks.loginService.mockRejectedValue(error);
    const next = vi.fn();
    await loginController({ body: { email: "a@example.com", password: "wrong" } } as any, response(), next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it("fetches the current user using the authenticated user id", async () => {
    serviceMocks.getCurrentUserService.mockResolvedValue({ id: "u1" } as any);
    const res = response();
    await getCurrentUserController({ user: { userId: "u1", username: "alice" } } as any, res, vi.fn());
    expect(serviceMocks.getCurrentUserService).toHaveBeenCalledWith("u1");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("clears the token cookie on logout", async () => {
    const res = response();
    await logoutController({} as any, res, vi.fn());
    expect(res.clearCookie).toHaveBeenCalledWith("token", expect.objectContaining({ httpOnly: true, path: "/" }));
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
