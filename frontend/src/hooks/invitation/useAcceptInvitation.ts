import { acceptInvitation } from "@/api/invitation";
import { useMutation } from "@tanstack/react-query";

export default function useAcceptInvitation() {
  return useMutation({
    mutationFn: acceptInvitation,
  });
}
