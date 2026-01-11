import { axiosInstance } from "@/lib/axios";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface District {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
}

export interface AgendaExtension {
  phase: string;
  phase_display: string;
  categories: Array<{
    id?: string;
    name?: string;
    slug?: string;
  }>;
  title_ne: string;
  description_ne: string;
  discussion_started_at: string | null;
  voting_started_at: string | null;
  voting_ended_at: string | null;
  voting_duration_days: number | null;
  min_votes_required: number | null;
  participant_count: number;
  message_count: number;
  solution_count: number;
  total_votes: number;
  is_featured: boolean;
  is_trending: boolean;
  trending_score: number | null;
  progress_percentage: number;
  winning_solution: string | null;
}

export interface EnhancedAgenda {
  id: string;
  title: string;
  description: string;
  status: string;
  status_display: string;
  scope: string;
  scope_display: string;
  district: District;
  submitted_by: User;
  view_count: number;
  solution_count: number;
  created_at: string;
  approved_at: string | null;
  extension: AgendaExtension;
  is_following: boolean;
  follower_count: number;
}

export interface AgendaListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: EnhancedAgenda[];
}

export interface AgendaDetailResponse extends EnhancedAgenda {}

// ============================================================================
// QUERY PARAMETERS
// ============================================================================

export interface GetAgendasParams {
  district?: string;
  category?: string;
  scope?: "rastriya" | "district";
  page?: number;
  page_size?: number;
}

export interface GetAgendaDetailParams {
  id: string;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

export const exploreAPI = {
  /**
   * Fetch list of agendas with optional filters
   * GET /api/agendas
   *
   * Query Parameters:
   * - district_id: Filter by district ID
   * - category: Filter by category slug
   * - scope: Filter by scope (rastriya or district)
   * - page: Pagination page number
   * - page_size: Number of results per page
   */
  getAgendasEnhanced: async (
    params?: GetAgendasParams
  ): Promise<AgendaListResponse> => {
    // Transform params: map 'district' to 'district_id' for API compatibility
    const apiParams: Record<string, any> = {
      page_size: params?.page_size || 10,
    };

    if (params?.district) {
      apiParams.district_id = params.district;
    }
    if (params?.category) {
      apiParams.category = params.category;
    }
    if (params?.scope) {
      apiParams.scope = params.scope;
    }
    if (params?.page) {
      apiParams.page = params.page;
    }

    const response = await axiosInstance.get<AgendaListResponse>(
      "/api/agendas/",
      {
        params: apiParams,
      }
    );
    return response.data;
  },

  /**
   * Fetch detailed agenda information
   * GET /api/agendas/<id>
   *
   * Returns full agenda details
   */
  getAgendaDetail: async (id: string): Promise<AgendaDetailResponse> => {
    const response = await axiosInstance.get<AgendaDetailResponse>(
      `/api/agendas/${id}`
    );
    return response.data;
  },
};
