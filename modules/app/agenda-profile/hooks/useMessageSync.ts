import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { profileAPI, MessageListResponse } from "../profile.api";

/**
 * React Query hook for syncing new messages since a specific timestamp
 *
 * Used for polling to fetch only new messages every 30 seconds.
 * This is more efficient than fetching all messages each time.
 *
 * Features:
 * - Automatic caching per thread and timestamp
 * - Does NOT refetch on window focus (to avoid duplicate fetches)
 * - Automatic retry on failure
 * - Loading, error, and data states
 *
 * @param threadId - The ID of the thread to sync messages for
 * @param since - ISO timestamp to fetch messages after
 * @param enabled - Optional flag to control whether the query runs
 * @returns Query result with data, loading, and error states
 *
 * @example
 * const { data: newMessages } = useMessageSync("thread-uuid", "2024-01-11T10:30:00Z");
 *
 * @example
 * // Auto-sync new messages every 30 seconds
 * const { data: newMessages, isLoading } = useMessageSync(
 *   threadId,
 *   lastSyncTime,
 *   Boolean(threadId && lastSyncTime)
 * );
 */
export function useMessageSync(
  threadId: string,
  since: string | null,
  enabled: boolean = true
): UseQueryResult<MessageListResponse, Error> {
  return useQuery({
    queryKey: ["message-sync", threadId, since],
    queryFn: () => profileAPI.syncMessages(threadId, since!),
    staleTime: 0, // Always stale for real-time updates
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Fewer retries for polling
    refetchOnWindowFocus: false, // Don't auto-refetch on focus
    enabled: enabled && Boolean(threadId) && Boolean(since),
  });
}
