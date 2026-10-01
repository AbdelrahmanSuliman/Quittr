import { getAllPartneredAddictions } from "@/api/addiction";
import { useQuery } from "@tanstack/react-query";

export function useGetPartneredAddictions() {
  return useQuery({
    queryKey: ["partneredAddictions"],
    queryFn: getAllPartneredAddictions,
  });
}
