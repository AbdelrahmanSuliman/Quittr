import { getCurrentUser } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
  });
}
