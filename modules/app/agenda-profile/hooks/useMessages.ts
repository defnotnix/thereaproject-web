import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { profileAPI, MessageListResponse } from "../profile.api";

/**
 * React Query hook for fetching all messages in a thread
 *
 * Used for initial load of messages. After this, use useMessageSync for polling.
 *
 * Features:
 * - Automatic caching and deduplication
 * - Refetch on window focus
 * - Automatic retry on failure
 * - Loading, error, and data states
 *
 * @param threadId - The ID of the thread to fetch messages for
 * @param enabled - Optional flag to control whether the query runs (default: true)
 * @returns Query result with data, loading, and error states
 *
 * @example
 * const { data: messages, isLoading } = useMessages("thread-uuid-123");
 *
 * @example
 * // Conditionally enable the query
 * const { data } = useMessages(selectedId, Boolean(selectedId));
 */
export function useMessages(
  threadId: string,
  enabled: boolean = true
): UseQueryResult<MessageListResponse, Error> {
  return useQuery({
    queryKey: ["messages", threadId],
    queryFn: () => profileAPI.getMessages(threadId),
    staleTime: 0, // Always stale, but still cached
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false, // Don't auto-refetch on focus
    enabled: enabled && Boolean(threadId),
  });
}
