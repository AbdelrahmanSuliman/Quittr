import { login } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

export default function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}
