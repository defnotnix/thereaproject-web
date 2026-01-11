import { create } from "zustand";

// ============================================================================
// TYPES
// ============================================================================

interface AgendaProfileState {
  // Selected thread state
  selectedThreadId: string | null;
  setSelectedThreadId: (threadId: string | null) => void;

  // Last sync timestamp for message polling
  lastSyncTimestamp: string | null;
  setLastSyncTimestamp: (timestamp: string) => void;

  // Polling active flag
  isPollingActive: boolean;
  setIsPollingActive: (active: boolean) => void;
}

// ============================================================================
// STORE
// ============================================================================

export const useAgendaProfileStore = create<AgendaProfileState>((set) => ({
  selectedThreadId: null,
  setSelectedThreadId: (threadId) => set({ selectedThreadId: threadId }),

  lastSyncTimestamp: null,
  setLastSyncTimestamp: (timestamp) => set({ lastSyncTimestamp: timestamp }),

  isPollingActive: false,
  setIsPollingActive: (active) => set({ isPollingActive: active }),
}));

// ============================================================================
// SELECTOR HOOKS
// ============================================================================

export function useSelectedThreadId() {
  return useAgendaProfileStore((state) => state.selectedThreadId);
}

export function useSetSelectedThreadId() {
  return useAgendaProfileStore((state) => state.setSelectedThreadId);
}

export function useLastSyncTimestamp() {
  return useAgendaProfileStore((state) => state.lastSyncTimestamp);
}

export function useSetLastSyncTimestamp() {
  return useAgendaProfileStore((state) => state.setLastSyncTimestamp);
}

export function useIsPollingActive() {
  return useAgendaProfileStore((state) => state.isPollingActive);
}

export function useSetIsPollingActive() {
  return useAgendaProfileStore((state) => state.setIsPollingActive);
}
