import { deleteAddictionById } from "@/api/addiction";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteAddiction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAddictionById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addictions"],
      });
    }
  });
}
