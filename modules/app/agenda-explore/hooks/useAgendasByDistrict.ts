import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { EnhancedAgenda } from "../explore.api";

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T;
}

/**
 * React Query hook for fetching agendas filtered by district
 *
 * Features:
 * - Automatic caching and deduplication
 * - Refetch on window focus
 * - Automatic retry on failure
 * - Only queries when districtId is available
 *
 * @param districtId - The ID of the district to fetch agendas for
 * @returns Query result with data, loading, and error states
 *
 * @example
 * const { data, isLoading, error } = useAgendasByDistrict("district-id-123");
 */
export function useAgendasByDistrict(
  districtId: string | null | undefined
): UseQueryResult<EnhancedAgenda[], Error> {
  return useQuery({
    queryKey: ["agendas-by-district", districtId || null],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<EnhancedAgenda[]>>(
        "/api/agendas/by_district/",
        {
          params: {
            district_id: districtId,
          },
        }
      );
      return data.results || [];
    },
    enabled: !!districtId,
    staleTime: 1 * 60 * 1000, // 1 minute (reduced for better responsiveness)
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: true,
  });
}
