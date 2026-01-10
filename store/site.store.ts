"use client";

import { create } from "zustand";
import { districtAPI, type DistrictsResponse } from "@/lib/api/districts";

interface SiteState {
  sideContentStatus: boolean;
  loadingStatus: boolean;
  districts: DistrictsResponse | null;
  districtsLoading: boolean;
  districtsError: string | null;
  setSideContentStatus: (status: boolean) => void;
  setLoadingStatus: (status: boolean) => void;
  getDistricts: () => Promise<DistrictsResponse>;
}

export const useSiteStore = create<SiteState>((set, get) => ({
  sideContentStatus: false,
  loadingStatus: false,
  districts: null,
  districtsLoading: false,
  districtsError: null,
  setSideContentStatus: (status) => set({ sideContentStatus: status }),
  setLoadingStatus: (status) => set({ loadingStatus: status }),
  getDistricts: async () => {
    const state = get();
    // Return cached districts if already loaded
    if (state.districts) {
      return state.districts;
    }

    set({ districtsLoading: true, districtsError: null });
    try {
      const data = await districtAPI.getDistricts();
      set({ districts: data, districtsLoading: false });
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch districts";
      set({
        districtsLoading: false,
        districtsError: errorMessage,
      });
      throw error;
    }
  },
}));

// Selectors
export const useSideContentStatus = () =>
  useSiteStore((state) => state.sideContentStatus);
export const useLoadingStatus = () =>
  useSiteStore((state) => state.loadingStatus);
export const useSetSideContentStatus = () =>
  useSiteStore((state) => state.setSideContentStatus);
export const useSetLoadingStatus = () =>
  useSiteStore((state) => state.setLoadingStatus);
export const useDistricts = () =>
  useSiteStore((state) => state.districts);
export const useDistrictsLoading = () =>
  useSiteStore((state) => state.districtsLoading);
export const useDistrictsError = () =>
  useSiteStore((state) => state.districtsError);
export const useGetDistricts = () =>
  useSiteStore((state) => state.getDistricts);
