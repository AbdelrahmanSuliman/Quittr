import { getJournalEntryByDate } from "@/api/journal";
import { useQuery } from "@tanstack/react-query";

export default function useGetJournalEntryByDate(
  addictionId: string,
  date: string,
) {
  return useQuery({
    queryKey: ["journal-entry", addictionId, date],
    queryFn: () =>
      getJournalEntryByDate({
        addictionId,
        date,
      }),
    enabled: !!addictionId && !!date,
  });
}
