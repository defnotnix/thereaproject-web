import { axiosInstance } from "@/lib/axios";

export interface TrustScore {
  score: number;
  trust_level: string;
  can_flag_content: boolean;
  total_flags_submitted: number;
  valid_flags_count: number;
  invalid_flags_count: number;
  content_flagged_count: number;
  violations_count: number;
}

export interface Penalty {
  id: string;
  reason: string;
  severity: string;
  created_at: string;
  expires_at?: string;
}

export interface CanPostResponse {
  can_post: boolean;
  reason: string | null;
  expires_at?: string;
}

export interface ContentCheckResponse {
  is_clean: boolean;
  severity?: string;
  flagged_words?: string[];
  warning?: string;
}

export interface FlagContentPayload {
  message_id: string;
  reason: string;
}

export interface FlagContentResponse {
  success: boolean;
  message: string;
}

export interface ModeratorApplication {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface WithdrawApplicationResponse {
  success: boolean;
  message: string;
}

export interface District {
  id: string;
  name: string;
  [key: string]: any;
}

export interface SubmitApplicationPayload {
  district: string;
  motivation: string;
  motivation_ne: string;
  experience: string;
  availability_hours: number;
  languages: string[];
}

export interface SubmitApplicationResponse {
  id: string;
  district: District;
  status: string;
  motivation: string;
  created_at: string;
}

/**
 * Get the current user's trust score
 */
export async function getTrustScore(accessToken: string): Promise<TrustScore> {
  try {
    const response = await axiosInstance.get<TrustScore>(
      "/api/moderation/my-trust-score/",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as any).response?.data?.message || "Failed to fetch trust score"
      );
    }
    throw error;
  }
}

/**
 * Get the current user's penalties
 */
export async function getPenalties(accessToken: string): Promise<Penalty[]> {
  try {
    const response = await axiosInstance.get<Penalty[]>(
      "/api/moderation/my-penalties/",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as any).response?.data?.message || "Failed to fetch penalties"
      );
    }
    throw error;
  }
}

/**
 * Check if the current user can post
 */
export async function canPost(accessToken: string): Promise<CanPostResponse> {
  try {
    const response = await axiosInstance.get<CanPostResponse>(
      "/api/moderation/can-post/",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as any).response?.data?.message || "Failed to check posting status"
      );
    }
    throw error;
  }
}

/**
 * Check content for profanity before posting
 */
export async function checkContent(
  content: string,
  accessToken: string
): Promise<ContentCheckResponse> {
  try {
    const response = await axiosInstance.post<ContentCheckResponse>(
      "/api/moderation/check-content/",
      { content },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as any).response?.data?.message || "Failed to check content"
      );
    }
    throw error;
  }
}

/**
 * Flag content for review
 */
export async function flagContent(
  payload: FlagContentPayload,
  accessToken: string
): Promise<FlagContentResponse> {
  try {
    const response = await axiosInstance.post<FlagContentResponse>(
      "/api/moderation/flag/",
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as any).response?.data?.message || "Failed to flag content"
      );
    }
    throw error;
  }
}

/**
 * Get moderator applications for the current user
 */
export async function getModeratorApplications(
  accessToken: string
): Promise<ModeratorApplication[]> {
  try {
    const response = await axiosInstance.get<ModeratorApplication[]>(
      "/api/moderators/my-applications/",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as any).response?.data?.message || "Failed to fetch moderator applications"
      );
    }
    throw error;
  }
}

/**
 * Withdraw a moderator application
 */
export async function withdrawModeratorApplication(
  applicationId: string,
  accessToken: string
): Promise<WithdrawApplicationResponse> {
  try {
    const response = await axiosInstance.delete<WithdrawApplicationResponse>(
      `/api/moderators/applications/${applicationId}/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as any).response?.data?.message || "Failed to withdraw application"
      );
    }
    throw error;
  }
}

/**
 * Submit a moderator application
 */
export async function submitModeratorApplication(
  payload: SubmitApplicationPayload,
  accessToken: string
): Promise<SubmitApplicationResponse> {
  try {
    const response = await axiosInstance.post<SubmitApplicationResponse>(
      "/api/moderators/apply/",
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as any).response?.data?.message || "Failed to submit application"
      );
    }
    throw error;
  }
}
