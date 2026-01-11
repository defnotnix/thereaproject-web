import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { profileAPI, AgendaDetailResponse } from "../profile.api";

/**
 * React Query hook for fetching detailed agenda information for profile view
 *
 * Features:
 * - Automatic caching and deduplication
 * - Refetch on window focus
 * - Automatic retry on failure
 * - Loading, error, and data states
 *
 * @param agendaId - The ID of the agenda to fetch details for
 * @param enabled - Optional flag to control whether the query runs (default: true)
 * @returns Query result with data, loading, and error states
 *
 * @example
 * const { data: agendaDetail, isLoading, error } = useAgendaDetail("agenda-uuid-123");
 */
export function useAgendaDetail(
  agendaId: string,
  enabled: boolean = true
): UseQueryResult<AgendaDetailResponse, Error> {
  return useQuery({
    queryKey: ["agenda-detail", agendaId],
    queryFn: () => profileAPI.getAgendaDetail(agendaId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: true,
    enabled: enabled && Boolean(agendaId),
  });
}
