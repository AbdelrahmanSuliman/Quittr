import { updateJournalEntryById } from "@/api/journal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateJournalEntryById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJournalEntryById,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addictions"],
      });
    },
  });
}
