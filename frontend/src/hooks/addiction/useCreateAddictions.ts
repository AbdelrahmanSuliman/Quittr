import { createAddiction } from "@/api/addiction";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateAddiction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAddiction,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addictions"],
      });
    },
  });
}
