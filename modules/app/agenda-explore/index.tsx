"use client";

import { MapRender } from "@/components/DynamicMap";
import { AgendaInfo } from "./components/AgendaInfo";
import { AgendaList } from "./components/AgendaList";
import {
  useSelectedDistrictId,
  useSetSelectedDistrictId,
} from "@/store/agenda-explore.store";
import classes from "./explore.module.css";

/**
 * ModuleAppAgendaExplore
 *
 * Main agenda exploration module that orchestrates the data flow:
 *
 * Data Flow Architecture:
 * ========================
 * 1. Tab Selection (explore.store):
 *    - User selects a district or category from tabs/subtabs
 *    - This updates activeSubTabId in explore.store
 *
 * 2. AgendaList Component:
 *    - Reads activeSubTabId from explore.store
 *    - Extracts district/category filters from activeSubTabId
 *    - Calls useAgendasEnhanced hook with filters
 *    - React Query fetches from GET /api/agendas/enhanced/
 *    - Displays list of agendas with loading/error states
 *    - When user clicks an agenda, calls setSelectedAgendaId
 *
 * 3. Selection Storage (agenda-explore.store):
 *    - When agenda is selected, selectedAgendaId is stored
 *    - This state is reactive and triggers re-renders
 *
 * 4. AgendaInfo Component:
 *    - Reads selectedAgendaId from agenda-explore.store
 *    - Calls useAgendaDetail hook with the selected ID
 *    - React Query fetches from GET /api/agendas/<id>/enhanced/
 *    - Displays full agenda detail with loading/error states
 *
 * State Management:
 * =================
 * explore.store (global):
 *   - Manages tabs, activeTabId, activeSubTabId
 *   - Controls filter state for the entire explore page
 *
 * agenda-explore.store (local to module):
 *   - Manages selectedAgendaId
 *   - Tracks which agenda is being viewed in detail
 *
 * Caching Strategy:
 * =================
 * - React Query automatically caches both list and detail queries
 * - Cache keys: ["agendas-enhanced", params] and ["agenda-detail", id]
 * - Stale time: 5 minutes
 * - GC time: 10 minutes
 * - Auto-refetch on window focus
 *
 * @returns React component with full agenda exploration interface
 */
export function ModuleAppAgendaExplore() {
  // * DEFINITIONS
  // This component is primarily a layout/orchestrator
  // All state is managed through stores and React Query

  // * STORE x CONTEXTS
  // - explore.store: provides activeSubTabId for filtering
  // - agenda-explore.store: provides selectedAgendaId and selectedDistrictId
  // - React Query: handles API caching and synchronization

  // * STATES
  const selectedDistrictId = useSelectedDistrictId();
  const setSelectedDistrictId = useSetSelectedDistrictId();

  // * PRELOADING
  // Data preloading is handled automatically by React Query hooks
  // in AgendaList (useAgendasEnhanced) and AgendaInfo (useAgendaDetail)

  // * FUNCTIONS
  const handleDistrictSelect = (districtId: string | null) => {
    setSelectedDistrictId(districtId);
  };

  // * COMPONENTS
  return (
    <>
      <section
        className={classes.top}
        style={{
          position: "fixed",
          zIndex: 20,
          top: 120,
          pointerEvents: "none",
        }}
      >
        <AgendaInfo />
      </section>

      <section
        style={{
          height: "calc(100vh - 100px)",
          width: "100vw",
          overflowX: "hidden",
          position: "relative",
          zIndex: 5,
        }}
      >
        <MapRender
          activeDistrict={
            selectedDistrictId ? parseInt(selectedDistrictId) : null
          }
          onDistrictSelect={(districtId) =>
            handleDistrictSelect(districtId ? districtId.toString() : null)
          }
        />
      </section>

      <section
        style={{
          position: "fixed",
          width: "100%",
          bottom: 0,
          zIndex: 10,
        }}
      >
        <AgendaList />
      </section>
    </>
  );
}
