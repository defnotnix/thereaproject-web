"use client";

import { Icon } from "@phosphor-icons/react";
import { create } from "zustand";

export interface SubTab {
  id: string;
  label: string;
}

export interface Tab {
  id: string;
  label: string;
  icon: Icon;
  subTabs?: SubTab[];
}

interface ExploreState {
  tabs: Tab[];
  activeTabId: string | null;
  activeSubTabId: string | null;
  setTabs: (tabs: Tab[]) => void;
  setActiveTab: (tabId: string) => void;
  setActiveSubTab: (subTabId: string) => void;
  getActiveTab: () => Tab | undefined;
  getActiveSubTab: () => SubTab | undefined;
}

export const useExploreStore = create<ExploreState>((set, get) => ({
  tabs: [],
  activeTabId: null,
  activeSubTabId: null,

  setTabs: (tabs) => set({ tabs, activeTabId: tabs[0]?.id || null }),

  setActiveTab: (tabId) => {
    const state = get();
    const tab = state.tabs.find((t) => t.id === tabId);
    // Reset sub-tab when switching tabs
    set({
      activeTabId: tabId,
      activeSubTabId: tab?.subTabs?.[0]?.id || null,
    });
  },

  setActiveSubTab: (subTabId) => set({ activeSubTabId: subTabId }),

  getActiveTab: () => {
    const state = get();
    return state.tabs.find((t) => t.id === state.activeTabId);
  },

  getActiveSubTab: () => {
    const state = get();
    const activeTab = state.tabs.find((t) => t.id === state.activeTabId);
    return activeTab?.subTabs?.find((st) => st.id === state.activeSubTabId);
  },
}));

// Selectors
export const useExploreTabs = () => useExploreStore((state) => state.tabs);
export const useActiveTabId = () =>
  useExploreStore((state) => state.activeTabId);
export const useActiveSubTabId = () =>
  useExploreStore((state) => state.activeSubTabId);
export const useSetExploreTabs = () =>
  useExploreStore((state) => state.setTabs);
export const useSetActiveTab = () =>
  useExploreStore((state) => state.setActiveTab);
export const useSetActiveSubTab = () =>
  useExploreStore((state) => state.setActiveSubTab);
export const useGetActiveTab = () =>
  useExploreStore((state) => state.getActiveTab);
export const useGetActiveSubTab = () =>
  useExploreStore((state) => state.getActiveSubTab);
