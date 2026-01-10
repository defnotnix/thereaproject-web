import { axiosInstance } from "@/lib/axios";

export interface District {
  id: number;
  name: string;
  [key: string]: any;
}

export interface DistrictsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: District[];
}

export const districtAPI = {
  getDistricts: async (pageSize: number = 100): Promise<DistrictsResponse> => {
    const response = await axiosInstance.get<DistrictsResponse>(
      "/api/districts/",
      {
        params: {
          page_size: pageSize,
        },
      }
    );
    return response.data;
  },
};
