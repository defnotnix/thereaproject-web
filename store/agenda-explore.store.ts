"use client";

import { create } from "zustand";

interface AgendaExploreState {
  selectedAgendaId: string | null;
  setSelectedAgendaId: (id: string | null) => void;
  selectedDistrictId: string | null;
  setSelectedDistrictId: (id: string | null) => void;
}

/**
 * Store for managing selected agenda in the explore module
 *
 * This store tracks which agenda is currently selected for viewing details.
 * When a user clicks an agenda from the list, its ID is stored here and
 * the AgendaInfo component uses this to fetch and display its details.
 */
export const useAgendaExploreStore = create<AgendaExploreState>((set) => ({
  selectedAgendaId: null,
  setSelectedAgendaId: (id) => set({ selectedAgendaId: id }),
  selectedDistrictId: null,
  setSelectedDistrictId: (id) => set({ selectedDistrictId: id }),
}));

// Selectors
export const useSelectedAgendaId = () =>
  useAgendaExploreStore((state) => state.selectedAgendaId);
export const useSetSelectedAgendaId = () =>
  useAgendaExploreStore((state) => state.setSelectedAgendaId);
export const useSelectedDistrictId = () =>
  useAgendaExploreStore((state) => state.selectedDistrictId);
export const useSetSelectedDistrictId = () =>
  useAgendaExploreStore((state) => state.setSelectedDistrictId);
