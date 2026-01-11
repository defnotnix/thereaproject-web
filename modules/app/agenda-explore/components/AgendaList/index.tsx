"use client";

import { useEffect, useMemo } from "react";
import { useAgendasEnhanced, useAgendaDetail, useDistricts } from "../../hooks";
import { useActiveSubTabId } from "@/store/explore.store";
import { useSetSelectedAgendaId, useSelectedDistrictId, useSelectedAgendaId, useSetSelectedDistrictId } from "@/store/agenda-explore.store";
import { Container } from "@mantine/core";
import { AgendaCarousel } from "../AgendaCarousel";
import { EnhancedAgenda, GetAgendasParams } from "../../explore.api";

/**
 * AgendaList Component
 *
 * Displays a list of all agendas filtered by selected district and category
 *
 * Data Flow:
 * 1. Reads activeSubTabId from explore store (selected filters)
 * 2. Calls useAgendasEnhanced hook with appropriate query parameters
 * 3. Renders loading, error, or list based on query state
 *
 * Props passed to AgendaInfo:
 * - None directly (context/store manages selection)
 *
 * @returns React component rendering agenda list with filtered data
 */
export function AgendaList() {
  // * DEFINITIONS
  const activeSubTabId = useActiveSubTabId();
  const selectedDistrictId = useSelectedDistrictId();
  const setSelectedDistrictId = useSetSelectedDistrictId();

  // * STORE x CONTEXTS
  // Memoize query params to ensure React Query properly detects changes
  // This is crucial because React Query uses object reference equality for cache keys
  const queryParams = useMemo<GetAgendasParams>(() => {
    // IMPORTANT: If a district is selected from AgendaInfo menu, use ONLY that district
    // This prevents mixing filters and ensures list resets when changing districts
    if (selectedDistrictId) {
      return { district: selectedDistrictId };
    }

    // If activeSubTabId is set, extract scope/district/category from it
    if (activeSubTabId) {
      const [filterType, ...filterValueParts] = activeSubTabId.split("_");
      const filterValue = filterValueParts.join("_"); // Handle IDs with underscores

      if (filterType === "scope") {
        return { scope: filterValue as 'rastriya' | 'district' };
      } else if (filterType === "district") {
        return { district: filterValue };
      } else if (filterType === "category") {
        return { category: filterValue };
      }
    }

    return {};
  }, [selectedDistrictId, activeSubTabId]);
  const setSelectedAgendaId = useSetSelectedAgendaId();

  // * PRELOADING & DATA FETCHING
  const { data, isLoading, error, isError } = useAgendasEnhanced(queryParams);
  const selectedAgendaId = useSelectedAgendaId();
  const { data: districts } = useDistricts();
  const { isLoading: isDetailLoading } = useAgendaDetail(
    selectedAgendaId || "",
    Boolean(selectedAgendaId)
  );

  // Get the selected district name for the empty message
  const selectedDistrictName = selectedDistrictId && districts
    ? districts.find(d => d.id.toString() === selectedDistrictId)?.name
    : null;

  // * EFFECTS
  // Auto-select first district only on initial mount when districts first load
  useEffect(() => {
    // Auto-select first district on app load ONLY if:
    // 1. selectedDistrictId is null (not set)
    // 2. districts are available
    // 3. user hasn't selected a tab filter
    if (selectedDistrictId === null && districts && districts.length > 0 && !activeSubTabId) {
      setSelectedDistrictId(districts[0].id.toString());
    }
    // Only run when districts list first loads, not when selectedDistrictId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districts?.length]);

  // Auto-select first agenda when data changes
  // This handles: initial load, district changes, filter changes
  useEffect(() => {
    if (data?.results && data.results.length > 0) {
      setSelectedAgendaId(data.results[0].id);
    } else if (!data?.results || data.results.length === 0) {
      setSelectedAgendaId(null);
    }
  }, [data?.results]);

  // * FUNCTIONS
  const handleAgendaSelect = (agenda: EnhancedAgenda) => {
    setSelectedAgendaId(agenda.id);
  };

  // Determine empty message based on context
  const getEmptyMessage = () => {
    if (selectedDistrictId && selectedDistrictName) {
      return `Currently no agenda under this district: ${selectedDistrictName}`;
    }
    return "No agendas found for this selection.";
  };

  // * COMPONENTS
  if (isError) {
    return <div>Error loading agendas: {error?.message}</div>;
  }

  return (
    <Container>
      <AgendaCarousel
        agendas={data?.results}
        isLoading={isLoading}
        selectedAgendaId={selectedAgendaId ?? undefined}
        onAgendaSelect={handleAgendaSelect}
        isDetailLoading={isDetailLoading}
        emptyMessage={getEmptyMessage()}
      />
    </Container>
  );
}
