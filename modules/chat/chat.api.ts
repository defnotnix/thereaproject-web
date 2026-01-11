import { axiosInstance } from "@/lib/axios";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ChatAuthor {
  id: string;
  full_name: string;
  name?: string;
}

export interface ChatMessage {
  id: string;
  thread: string;
  author: ChatAuthor;
  message: string;
  created_at: string;
  updated_at: string;
  is_solution: boolean;
  upvote_count?: number;
  downvote_count?: number;
  total_votes?: number;
  user_vote?: "upvote" | "downvote" | null; // Current user's vote on this message
}

export interface FetchMessagesResponse {
  messages: ChatMessage[];
  has_more: boolean;
  sync_timestamp: string;
}

export interface SyncMessagesResponse {
  messages: ChatMessage[];
  sync_timestamp: string;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Fetch messages from a thread with pagination
 * GET /api/messages/?thread={thread_id}&limit={limit}&ordering={ordering}&page={page}
 *
 * @param threadId - The thread ID
 * @param limit - Number of messages to fetch (default: 50)
 * @param ordering - Sort order: "-created_at" (newest first) or "created_at" (oldest first)
 * @param page - Page number for pagination
 */
export async function fetchMessages(
  threadId: string,
  limit: number = 50,
  ordering: string = "-created_at",
  page: number = 1
): Promise<FetchMessagesResponse> {
  const response = await axiosInstance.get<{
    count: number;
    next: string | null;
    previous: string | null;
    results: ChatMessage[];
  }>("/api/messages/", {
    params: {
      thread_id: threadId,
      limit,
      ordering,
      page,
    },
  });

  return {
    messages: response.data.results,
    has_more: response.data.next !== null,
    sync_timestamp: response.data.results[0]?.created_at || new Date().toISOString(),
  };
}

/**
 * Sync messages since a specific timestamp
 * GET /api/messages/sync/?thread={thread_id}&since={timestamp}
 *
 * Returns only new messages since the provided timestamp.
 * Used for polling to get new messages every 30 seconds.
 *
 * @param threadId - The thread ID to sync messages for
 * @param since - ISO timestamp to fetch messages after (optional)
 */
export async function syncMessages(
  threadId: string,
  since?: string
): Promise<SyncMessagesResponse> {
  const params: Record<string, string> = {
    thread_id: threadId,
  };

  if (since) {
    params.since = since;
  }

  const response = await axiosInstance.get<{
    messages?: ChatMessage[];
    results?: ChatMessage[];
  }>("/api/messages/sync/", {
    params,
  });

  // Handle both response formats: either "messages" or "results" field
  const messages = response.data.messages || response.data.results || [];
  const syncTimestamp = messages.length > 0
    ? messages[messages.length - 1].created_at
    : new Date().toISOString();

  return {
    messages,
    sync_timestamp: syncTimestamp,
  };
}

/**
 * Send a message to a thread
 * POST /api/messages/
 *
 * Creates a new message in the thread
 */
export async function sendMessage(
  threadId: string,
  content: string
): Promise<ChatMessage> {
  const response = await axiosInstance.post<ChatMessage>("/api/messages/", {
    thread: threadId,
    message: content,
  });

  return response.data;
}

/**
 * Cast a vote on a message
 * POST /api/votes/
 *
 * Votes (upvote/downvote) on a message. Casting the same vote type again removes the vote.
 *
 * @param messageId - The message ID to vote on
 * @param voteType - Type of vote: "upvote" (1) or "downvote" (-1)
 */
export async function castVote(
  messageId: string,
  voteType: "upvote" | "downvote"
): Promise<ChatMessage> {
  const voteValue = voteType === "upvote" ? 1 : -1;

  const response = await axiosInstance.post<ChatMessage>("/api/votes/", {
    message: messageId,
    value: voteValue,
  });

  return response.data;
}

// Legacy API object for backwards compatibility
export const chatAPI = {
  fetchMessages,
  syncMessages,
  sendMessage,
  castVote,
};
