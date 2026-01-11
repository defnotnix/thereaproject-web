import { axiosInstance } from "@/lib/axios";

export interface Agenda {
  id: number;
  title: string;
  description: string;
  district: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    full_name: string;
    email: string;
  };
  created_at: string;
  status: string;
  [key: string]: any;
}

export interface FollowedAgendasResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Agenda[];
}

export const agendasAPI = {
  getFollowedAgendas: async (
    accessToken: string,
    pageSize: number = 20
  ): Promise<FollowedAgendasResponse> => {
    const response = await axiosInstance.get<FollowedAgendasResponse>(
      "/api/agendas/following/",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page_size: pageSize,
        },
      }
    );
    return response.data;
  },
};
