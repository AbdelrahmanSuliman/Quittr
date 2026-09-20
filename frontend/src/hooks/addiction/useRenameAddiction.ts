import {renameAddictionById } from "@/api/addiction";
import { useMutation } from "@tanstack/react-query";

export default function useRenameAddiction() {
  return useMutation({
    mutationFn: renameAddictionById,
  });
}
