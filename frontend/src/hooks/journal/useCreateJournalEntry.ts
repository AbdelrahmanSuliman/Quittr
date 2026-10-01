import { createJournalEntry } from "@/api/journal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJournalEntry,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["journalEntries"],
      });
    },
  });
}
