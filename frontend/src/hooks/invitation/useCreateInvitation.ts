import { createInvitation } from '@/api/invitation';
import { useMutation } from "@tanstack/react-query";

export default function useCreateInvitation() {
  return useMutation({
    mutationFn: createInvitation,
  });
}
