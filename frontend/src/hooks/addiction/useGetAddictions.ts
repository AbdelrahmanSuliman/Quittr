import { getAllAddictions } from "@/api/addiction";
import { useQuery } from "@tanstack/react-query";

export function useGetAddictions() {
  return useQuery({
    queryKey: ["addictions"],
    queryFn: getAllAddictions,
  },);
}
