import { beforeEach, describe, expect, it, vi } from "vitest";
import * as services from "../src/services/invitation.services";
import { createInvitationController, acceptInvitationController, fetchReceivedInvitationsController } from "../src/controllers/invitation.controller";

vi.mock("../src/services/invitation.services", () => ({
  createInvitationService: vi.fn(), fetchSentInvitationsService: vi.fn(), acceptInvitationService: vi.fn(),
  deleteInvitationService: vi.fn(), fetchReceivedInvitationsService: vi.fn(),
}));
function response() { const r = { status: vi.fn(), send: vi.fn(), json: vi.fn() } as any; r.status.mockReturnValue(r); r.send.mockReturnValue(r); r.json.mockReturnValue(r); return r; }
const user = { userId: "u1", username: "alice" };

describe("invitation controllers", () => {
  beforeEach(() => vi.clearAllMocks());
  it("creates an invitation and returns its link", async () => {
    vi.mocked(services.createInvitationService).mockResolvedValue({ newInvitation: { id: "i1" }, invitationLink: "https://example.test/i1" } as any);
    const res = response();
    await createInvitationController({ user, body: { addictionId: "a1" } } as any, res, vi.fn());
    expect(services.createInvitationService).toHaveBeenCalledWith("u1", "a1");
    expect(res.status).toHaveBeenCalledWith(201);
  });
  it("accepts an invitation using the authenticated user", async () => {
    vi.mocked(services.acceptInvitationService).mockResolvedValue(undefined as any);
    await acceptInvitationController({ user, params: { token: "token-1" } } as any, response(), vi.fn());
    expect(services.acceptInvitationService).toHaveBeenCalledWith("u1", "token-1");
  });
  it("applies default pagination when fetching received invitations", async () => {
    vi.mocked(services.fetchReceivedInvitationsService).mockResolvedValue([] as any);
    await fetchReceivedInvitationsController({ user, query: { status: "pending" } } as any, response(), vi.fn());
    expect(services.fetchReceivedInvitationsService).toHaveBeenCalledWith("u1", "pending", 1, 10);
  });
});
