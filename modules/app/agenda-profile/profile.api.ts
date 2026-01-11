import { axiosInstance } from "@/lib/axios";
import {
  AgendaDetailResponse as ExploreAgendaDetailResponse,
} from "@/modules/app/agenda-explore/explore.api";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

// Extended User type with profile fields
export interface User {
  id: string;
  name: string;
  email: string;
  full_name: string;
  district: string | null;
  district_name: string | null;
  profession: string;
  is_verified: boolean;
  is_moderator: boolean;
}

// Extended District type with profile fields
export interface District {
  id: string;
  name: string;
  code: string;
  population: number;
  description: string;
  is_active: boolean;
}

// Extend the explore agenda detail to include profile-specific fields
export interface AgendaDetailResponse extends ExploreAgendaDetailResponse {
  district: District;
  submitted_by: User;
  chat_thread_id?: string;
  message_count?: number;
  reviewed_by?: User | null;
  reviewed_at?: string | null;
  rejection_reason?: string;
  updated_at?: string;
}

export interface Thread {
  id: string;
  agenda: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ThreadListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Thread[];
}

export interface Message {
  id: string;
  thread: string;
  sender: User;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface MessageListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Message[];
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

export const profileAPI = {
  /**
   * Fetch detailed agenda information
   * GET /api/agendas/<id>/
   *
   * Returns full agenda details including district, author,
   * status, and message thread information
   *
   * Note: Uses /enhanced/ endpoint which includes additional metadata
   */
  getAgendaDetail: async (agendaId: string): Promise<AgendaDetailResponse> => {
    const response = await axiosInstance.get<AgendaDetailResponse>(
      `/api/agendas/${agendaId}/`
    );
    return response.data;
  },

  /**
   * Fetch all threads for a specific agenda
   * GET /api/threads/?agenda={agenda_id}
   *
   * Returns list of discussion threads associated with the agenda
   */
  getThreads: async (agendaId: string): Promise<ThreadListResponse> => {
    const response = await axiosInstance.get<ThreadListResponse>(
      "/api/threads/",
      {
        params: {
          agenda: agendaId,
        },
      }
    );
    return response.data;
  },

  /**
   * Fetch all messages in a thread
   * GET /api/messages/?thread={thread_id}
   *
   * Returns all messages in the thread, used for initial load
   */
  getMessages: async (threadId: string): Promise<MessageListResponse> => {
    const response = await axiosInstance.get<MessageListResponse>(
      "/api/messages/",
      {
        params: {
          thread: threadId,
        },
      }
    );
    return response.data;
  },

  /**
   * Sync messages since a specific timestamp
   * GET /api/messages/sync/?thread={thread_id}&since={timestamp}
   *
   * Returns only new messages since the provided timestamp.
   * Used for polling to get new messages every 30 seconds.
   *
   * @param threadId - The thread ID to sync messages for
   * @param since - ISO timestamp to fetch messages after
   */
  syncMessages: async (
    threadId: string,
    since: string
  ): Promise<MessageListResponse> => {
    const response = await axiosInstance.get<MessageListResponse>(
      "/api/messages/sync/",
      {
        params: {
          thread_id: threadId,
          since,
        },
      }
    );
    return response.data;
  },
};
