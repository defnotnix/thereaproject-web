import { axiosInstance } from "@/lib/axios";

/**
 * Follow/Notification Preferences API
 * Handles agenda follow status and notification preferences
 */

export interface NotificationPreferences {
  notify_new_messages: boolean;
  notify_new_solutions: boolean;
  notify_status_change: boolean;
  notify_voting: boolean;
  email_notifications: boolean;
}

export interface FollowStatusResponse {
  is_following: boolean;
  preferences: NotificationPreferences;
}

export interface ToggleFollowResponse {
  success: boolean;
  is_following: boolean;
}

export interface UpdatePreferencesResponse {
  success: boolean;
  preferences: NotificationPreferences;
}

const followAPI = {
  /**
   * Check current follow status and preferences
   * GET /api/agendas/{id}/follow/
   */
  async getFollowStatus(agendaId: string): Promise<FollowStatusResponse> {
    const response = await axiosInstance.get(`/api/agendas/${agendaId}/follow/`);
    return response.data;
  },

  /**
   * Toggle follow status for an agenda
   * POST /api/agendas/{id}/follow/
   */
  async toggleFollow(agendaId: string): Promise<ToggleFollowResponse> {
    const response = await axiosInstance.post(`/api/agendas/${agendaId}/follow/`);
    return response.data;
  },

  /**
   * Update notification preferences for followed agenda
   * PATCH /api/agendas/{id}/follow/
   */
  async updatePreferences(
    agendaId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<UpdatePreferencesResponse> {
    const response = await axiosInstance.patch(`/api/agendas/${agendaId}/follow/`, preferences);
    return response.data;
  },
};

export default followAPI;
