import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { exploreAPI, AgendaListResponse, GetAgendasParams } from "../explore.api";

/**
 * React Query hook for fetching paginated list of enhanced agendas
 *
 * Features:
 * - Automatic caching and deduplication
 * - Refetch on window focus
 * - Automatic retry on failure
 * - Loading, error, and data states
 *
 * @param params - Query parameters (district, category, page, page_size)
 * @returns Query result with data, loading, and error states
 *
 * @example
 * const { data, isLoading, error } = useAgendasEnhanced({
 *   district: "kathmandu-id",
 *   category: "health",
 *   page: 1,
 *   page_size: 10,
 * });
 */
export function useAgendasEnhanced(
  params?: GetAgendasParams
): UseQueryResult<AgendaListResponse, Error> {
  return useQuery({
    // CRITICAL: Use serializable primitive values in queryKey, not objects
    // This ensures React Query properly detects when params change
    queryKey: [
      "agendas-enhanced",
      params?.district || null,
      params?.category || null,
      params?.scope || null,
      params?.page || 1,
      params?.page_size || 10,
    ],
    queryFn: () => exploreAPI.getAgendasEnhanced(params),
    staleTime: 1 * 60 * 1000, // 1 minute (reduced for better responsiveness)
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: true,
  });
}
