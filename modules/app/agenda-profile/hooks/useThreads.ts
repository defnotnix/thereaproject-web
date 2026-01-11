import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { profileAPI, ThreadListResponse } from "../profile.api";

/**
 * React Query hook for fetching all threads for an agenda
 *
 * Features:
 * - Automatic caching and deduplication
 * - Refetch on window focus
 * - Automatic retry on failure
 * - Loading, error, and data states
 *
 * @param agendaId - The ID of the agenda to fetch threads for
 * @param enabled - Optional flag to control whether the query runs (default: true)
 * @returns Query result with data, loading, and error states
 *
 * @example
 * const { data: threads, isLoading, error } = useThreads("agenda-uuid-123");
 *
 * @example
 * // Conditionally enable the query
 * const { data } = useThreads(selectedId, Boolean(selectedId));
 */
export function useThreads(
  agendaId: string,
  enabled: boolean = true
): UseQueryResult<ThreadListResponse, Error> {
  return useQuery({
    queryKey: ["threads", agendaId],
    queryFn: () => profileAPI.getThreads(agendaId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: true,
    enabled: enabled && Boolean(agendaId),
  });
}
