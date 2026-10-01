import { beforeEach, describe, expect, it, vi } from "vitest";
import * as services from "../src/services/addiction.services";
import { createAddictionController, fetchAddictionsController, deleteAddictionController, updateAddictionController } from "../src/controllers/addiction.controller";

vi.mock("../src/services/addiction.services", () => ({
  createAddictionService: vi.fn(), fetchAllAddictionsService: vi.fn(), deleteAddictionService: vi.fn(),
  updateAddictionService: vi.fn(), fetchAllPartneredAddictionsService: vi.fn(),
}));

function response() { const r = { status: vi.fn(), send: vi.fn() } as any; r.status.mockReturnValue(r); r.send.mockReturnValue(r); return r; }
const user = { userId: "user-1", username: "alice" };

describe("addiction controllers", () => {
  beforeEach(() => vi.clearAllMocks());
  it("creates an addiction for the authenticated user", async () => {
    vi.mocked(services.createAddictionService).mockResolvedValue({ id: "a1", name: "Sugar" } as any);
    const res = response();
    await createAddictionController({ user, body: { name: "Sugar" } } as any, res, vi.fn());
    expect(services.createAddictionService).toHaveBeenCalledWith("Sugar", "user-1");
    expect(res.status).toHaveBeenCalledWith(201);
  });
  it("converts pagination query values and fetches addictions", async () => {
    vi.mocked(services.fetchAllAddictionsService).mockResolvedValue([] as any);
    await fetchAddictionsController({ user, query: { page: "2", limit: "25" } } as any, response(), vi.fn());
    expect(services.fetchAllAddictionsService).toHaveBeenCalledWith("user-1", 2, 25);
  });
  it("deletes and updates only the authenticated user's addiction", async () => {
    vi.mocked(services.deleteAddictionService).mockResolvedValue(undefined as any);
    vi.mocked(services.updateAddictionService).mockResolvedValue(undefined as any);
    await deleteAddictionController({ user, params: { addictionId: "a1" } } as any, response(), vi.fn());
    await updateAddictionController({ user, params: { addictionId: "a1" }, body: { name: "Coffee" } } as any, response(), vi.fn());
    expect(services.deleteAddictionService).toHaveBeenCalledWith("a1", "user-1");
    expect(services.updateAddictionService).toHaveBeenCalledWith("a1", "Coffee", "user-1");
  });
  it("forwards service errors", async () => {
    const error = new Error("database unavailable");
    vi.mocked(services.createAddictionService).mockRejectedValue(error);
    const next = vi.fn();
    await createAddictionController({ user, body: { name: "Sugar" } } as any, response(), next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
