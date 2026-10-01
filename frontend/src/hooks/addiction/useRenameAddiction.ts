import { renameAddictionById } from "@/api/addiction";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useRenameAddiction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: renameAddictionById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addictions"],
      });
    },
  });
}
