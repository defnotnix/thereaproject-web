import { axiosInstance } from "@/lib/axios";

// Types
export interface Author {
  id: string;
  full_name: string;
}

export interface ChatMessage {
  id: string;
  thread: string;
  author: Author;
  message: string;
  is_solution: boolean;
  upvote_count: number;
  downvote_count: number;
  total_votes: number;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  total_pages: number;
  total_items: number;
  current_page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface FetchMessagesResponse {
  results: ChatMessage[];
  pagination: PaginationInfo;
  success: boolean;
  next_page_number: number | null;
  has_next: boolean;
}

export interface SyncMessagesResponse {
  messages: ChatMessage[];
  has_more: boolean;
  sync_timestamp: string;
  count: number;
}

export interface SendMessagePayload {
  thread: string;
  message: string;
}

export interface SendMessageResponse {
  thread: string;
  message: string;
  is_solution: boolean;
}

// API Functions
export async function fetchMessages(
  threadId: string,
  limit: number = 50,
  ordering: string = "-created_at",
  page: number = 1
): Promise<SyncMessagesResponse> {
  const params = new URLSearchParams({
    thread_id: threadId,
    limit: limit.toString(),
    ordering: ordering,
    page: page.toString(),
  });

  const { data } = await axiosInstance.get<FetchMessagesResponse>(
    `/api/messages/?${params.toString()}`
  );

  // Transform API response to match SyncMessagesResponse format
  return {
    messages: data.results,
    has_more: data.has_next || data.pagination.has_next,
    sync_timestamp: new Date().toISOString(),
    count: data.pagination.total_items,
  };
}

export async function syncMessages(
  threadId: string,
  lastSync?: string
): Promise<SyncMessagesResponse> {
  const params = new URLSearchParams({
    thread_id: threadId,
  });

  if (lastSync) {
    params.append("last_sync", lastSync);
  }

  const { data } = await axiosInstance.get<SyncMessagesResponse>(
    `/api/messages/sync/?${params.toString()}`
  );

  return data;
}

export async function sendMessage(
  threadId: string,
  message: string
): Promise<SendMessageResponse> {
  const payload: SendMessagePayload = {
    thread: threadId,
    message,
  };

  const { data } = await axiosInstance.post<SendMessageResponse>(
    "/api/messages/",
    payload
  );

  return data;
}

export async function editMessage(
  messageId: string,
  message: string
): Promise<ChatMessage> {
  const { data } = await axiosInstance.patch<ChatMessage>(
    `/api/messages/${messageId}/`,
    { message }
  );

  return data;
}
