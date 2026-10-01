import { beforeEach, describe, expect, it, vi } from "vitest";
import * as services from "../src/services/journal.services";
import { addJournalEntryController, getJournalEntryByDateController, deleteJournalEntryController } from "../src/controllers/journal.controller";

vi.mock("../src/services/journal.services", () => ({
  addJournalEntryService: vi.fn(), updateJournalEntryService: vi.fn(), getAllJournalEntriesService: vi.fn(),
  deleteJournalEntryService: vi.fn(), getAllPartneredJournalEntriesService: vi.fn(),
  getJournalEntryByDateService: vi.fn(), getPartneredJournalEntryByDateService: vi.fn(),
}));
function response() { const r = { status: vi.fn(), send: vi.fn() } as any; r.status.mockReturnValue(r); r.send.mockReturnValue(r); return r; }
const user = { userId: "u1", username: "alice" };

describe("journal controllers", () => {
  beforeEach(() => vi.clearAllMocks());
  it("creates an entry with the authenticated user and all entry fields", async () => {
    const date = new Date("2026-01-01");
    vi.mocked(services.addJournalEntryService).mockResolvedValue({ id: "e1" } as any);
    await addJournalEntryController({ user, body: { addictionId: "a1", succeeded: true, content: "Done", targetDate: date } } as any, response(), vi.fn());
    expect(services.addJournalEntryService).toHaveBeenCalledWith("u1", "a1", true, "Done", date);
  });
  it("looks up an entry by addiction and date", async () => {
    vi.mocked(services.getJournalEntryByDateService).mockResolvedValue(null as any);
    await getJournalEntryByDateController({ user, params: { addictionId: "a1" }, query: { date: "2026-01-01" } } as any, response(), vi.fn());
    expect(services.getJournalEntryByDateService).toHaveBeenCalledWith("u1", "a1", "2026-01-01");
  });
  it("deletes an entry scoped to both user and addiction", async () => {
    vi.mocked(services.deleteJournalEntryService).mockResolvedValue(undefined as any);
    await deleteJournalEntryController({ user, params: { addictionId: "a1", entryId: "e1" } } as any, response(), vi.fn());
    expect(services.deleteJournalEntryService).toHaveBeenCalledWith("u1", "e1", "a1");
  });
});
