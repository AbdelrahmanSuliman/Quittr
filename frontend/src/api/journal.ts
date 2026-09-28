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

export type GetJournalEntryByDateData = {
  addictionId: string;
  date: string;
};

export type UpdateJournalEntryById = {
  addictionId: string;
  entryId: string;
  targetDate: string;
  content: string;
  succeeded: boolean;
};

export const createJournalEntry = async ({
  addictionId,
  succeeded,
  content,
  targetDate,
}: CreateJournalEntryData): Promise<CreateJournalEntryResponse> => {
  const response = await api.post("/journals/", {
    addictionId,
    succeeded,
    content,
    targetDate,
  });
  return response.data.data;
};

export const getJournalEntryByDate = async ({
  addictionId,
  date,
}: GetJournalEntryByDateData) => {
  const response = await api.get(`/journals/${addictionId}/date`, {
    params: {
      date,
    },
  });

  return response.data.data;
};

export const getPartneredJournalEntryByDate = async ({
  addictionId,
  date,
}: GetJournalEntryByDateData) => {
  const response = await api.get(`/journals/${addictionId}/date/partnered`, {
    params: {
      date,
    },
  });

  return response.data.data;
};

export const updateJournalEntryById = async ({
  addictionId,
  entryId,
  targetDate,
  content,
  succeeded,
}: UpdateJournalEntryById) => {
  const response = await api.patch(`/journals/${entryId}`, {
    addictionId,
    targetDate,
    content,
    succeeded,
  });
  return response.data.data;
};
