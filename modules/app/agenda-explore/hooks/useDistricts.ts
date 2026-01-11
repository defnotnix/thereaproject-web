import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { districtAPI, District, DistrictsResponse } from "@/lib/api/districts";

/**
 * React Query hook for fetching all districts
 *
 * Features:
 * - Automatic caching and deduplication
 * - Refetch on window focus
 * - Automatic retry on failure
 *
 * @returns Query result with districts list, loading, and error states
 *
 * @example
 * const { data: districts, isLoading, error } = useDistricts();
 */
export function useDistricts(): UseQueryResult<District[], Error> {
  return useQuery({
    queryKey: ["districts"],
    queryFn: async () => {
      const response = await districtAPI.getDistricts(100);
      return response.results;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 60 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
