import { signup } from '@/api/auth';
import { useMutation } from "@tanstack/react-query"

export default function useSignup() {
  return useMutation({
    mutationFn: signup
  });
}
