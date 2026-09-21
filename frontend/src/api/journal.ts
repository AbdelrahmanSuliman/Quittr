import { api } from "@/lib/axios";

export interface CreateJournalEntryResponse {
  id: string;
  content: string | null;
  succeeded: boolean | null;
  date: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  addictionId: string;
}
export type CreateJournalEntryData = {
  addictionId: string;
  succeeded: boolean;
  content: string;
  targetDate: Date;
};

export const createJournalEntry = async(
  {addictionId, succeeded, content, targetDate}: CreateJournalEntryData
): Promise<CreateJournalEntryResponse> => {
  const response = await api.post("/journals/", {
    addictionId,
    succeeded,
    content,
    targetDate,
  });
  return response.data.data;
};
