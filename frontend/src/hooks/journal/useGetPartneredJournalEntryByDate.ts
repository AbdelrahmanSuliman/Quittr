import { useQuery } from "@tanstack/react-query";
import {
  getPartneredJournalEntryByDate,
  type GetJournalEntryByDateData,
} from "@/api/journal";

export default function useGetPartneredJournalEntryByDate(
  addictionId: string,
  date: string,
) {
  const data: GetJournalEntryByDateData = {
    addictionId,
    date,
  };

  return useQuery({
    queryKey: ["partneredJournalEntry", addictionId, date],
    queryFn: () => getPartneredJournalEntryByDate(data),
    enabled: !!addictionId && !!date,
  });
}
