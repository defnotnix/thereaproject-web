"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Center,
  Container,
  Drawer,
  Grid,
  Group,
  Loader,
  Menu,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  useAgendaDetail,
  useAgendasByDistrict,
  useDistricts,
} from "../../hooks";
import {
  useSelectedAgendaId,
  useSetSelectedAgendaId,
  useSelectedDistrictId,
  useSetSelectedDistrictId,
} from "@/store/agenda-explore.store";
import { EnhancedAgenda } from "../../explore.api";
import {
  ArrowUpRightIcon,
  CaretDownIcon,
  ChatIcon,
  EyeIcon,
  ThumbsUpIcon,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { DistrictText } from "@/components/DistrictText";

/**
 * AgendaInfo Component
 *
 * Displays detailed information about a selected agenda
 *
 * Data Flow:
 * 1. Reads selectedAgendaId from agenda-explore store
 * 2. Calls useAgendaDetail hook with the selected agenda ID
 * 3. Renders loading, error, or detail based on query state
 *
 * Displays:
 * - Agenda title and description
 * - Status, scope, district information
 * - User who submitted it
 * - View count and solution count
 * - Extension data (phase, voting info, categories, etc.)
 * - Following status and follower count
 *
 * @returns React component rendering agenda detail
 */
export function AgendaInfo() {
  // * DEFINITIONS & STORES
  const selectedAgendaId = useSelectedAgendaId();
  const setSelectedAgendaId = useSetSelectedAgendaId();
  const selectedDistrictId = useSelectedDistrictId();
  const setSelectedDistrictId = useSetSelectedDistrictId();

  // * STATES
  const [agendaScope, setAgendaScope] = useState<"rastriya" | "district">(
    "rastriya"
  );
  const [selectedDistrictAgenda, setSelectedDistrictAgenda] =
    useState<EnhancedAgenda | null>(null);
  const [districtDrawerOpen, setDistrictDrawerOpen] = useState(false);

  // * PRELOADING & DATA FETCHING
  // Fetch agenda detail (works for both rastriya and district agendas)
  const { data: agendaDetail } = useAgendaDetail(
    selectedAgendaId || "",
    Boolean(selectedAgendaId)
  );

  const { data: districts } = useDistricts();
  const { data: districtAgendas = [], isLoading: districtAgendasLoading } =
    useAgendasByDistrict(selectedDistrictId);

  // * EFFECTS
  // Auto-switch to district mode and select district agenda when map district is clicked
  useEffect(() => {
    // Only trigger when we have data loaded and it's not empty
    if (
      selectedDistrictId &&
      !districtAgendasLoading &&
      districtAgendas.length > 0
    ) {
      // Auto-select the first agenda from the selected district
      const firstDistrictAgenda = districtAgendas[0];
      setSelectedDistrictAgenda(firstDistrictAgenda);
      setSelectedAgendaId(firstDistrictAgenda.id.toString());
      setAgendaScope("district");
    }
  }, [
    selectedDistrictId,
    districtAgendas,
    districtAgendasLoading,
    setSelectedAgendaId,
  ]);

  // Detect agenda scope from selected agenda and update UI
  // This effect only runs when a rastriya agenda is selected from elsewhere
  useEffect(() => {
    if (selectedAgendaId && agendaDetail && !selectedDistrictId) {
      // Detect scope from the fetched agenda data
      if (agendaDetail.scope === "district") {
        setAgendaScope("district");
        setSelectedDistrictAgenda(agendaDetail);
        // Auto-set the selected district from the agenda's district
        if (agendaDetail.district?.id) {
          setSelectedDistrictId(agendaDetail.district.id.toString());
        }
      } else {
        // It's a rastriya agenda
        setAgendaScope("rastriya");
        setSelectedDistrictAgenda(null);
      }
    }
  }, [
    selectedAgendaId,
    agendaDetail,
    setSelectedDistrictId,
    selectedDistrictId,
  ]);

  // * COMPONENTS

  const RenderDetails = () => {
    const Router = useRouter();
    const isRastriya = agendaScope === "rastriya";
    const data = isRastriya ? agendaDetail : selectedDistrictAgenda;

    // Better loading detection for both rastriya and district agendas
    const isLoading = isRastriya
      ? agendaDetail === undefined && selectedAgendaId
      : selectedDistrictAgenda === undefined;

    if (isLoading) {
      return (
        <Center py="xl">
          <Group>
            <Loader size="xs" />
            <Text size="xs">Loading agenda details...</Text>
          </Group>
        </Center>
      );
    }

    if (!data) {
      return (
        <Center py="xl">
          <Text size="sm" c="dimmed">
            No agenda selected
          </Text>
        </Center>
      );
    }

    const {
      title,
      description,
      scope_display,
      district,
      status_display,
      created_at,
    } = data;

    return (
      <>
        <Stack>
          <Group visibleFrom="lg">
            <Text size="xs" c="dimmed" fw={800}>
              {isRastriya ? "RASTRIYA AGENDA" : "DISTRICT AGENDA"}
            </Text>

            <Text size="xs" c="blue.6" fw={800}>
              {status_display || "STATUS"}
            </Text>

            <Text size="xs" fw={800}>
              {created_at
                ? new Date(created_at)
                    .toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                    .toUpperCase()
                : "DATE"}
            </Text>
          </Group>

          <Group justify="center" hiddenFrom="lg">
            <Text size="xs" c="dimmed" fw={800}>
              {isRastriya ? "RASTRIYA AGENDA" : "DISTRICT AGENDA"}
            </Text>

            <Text size="xs" c="blue.6" fw={800}>
              {status_display || "STATUS"}
            </Text>

            <Text size="xs" fw={800}>
              {created_at
                ? new Date(created_at)
                    .toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                    .toUpperCase()
                : "DATE"}
            </Text>
          </Group>
          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
            <Stack gap="sm">
              <Text size="2rem" visibleFrom="lg">
                {title || "Agenda Title"}
              </Text>
              <Text size="xl" hiddenFrom="lg" ta="center">
                {title || "Agenda Title"}
              </Text>
              <Group>
                <Text size="xs" c="dimmed" fw={800} visibleFrom="lg">
                  {isRastriya ? "NATIONAL SCOPE" : scope_display || "SCOPE"}
                </Text>
                {!isRastriya && (
                  <DistrictText
                    districtName={district?.name || "DISTRICT"}
                    districtDescription={district?.name || "District"}
                    size="xs"
                    fw={800}
                  />
                )}
              </Group>
            </Stack>
            <Stack gap="sm">
              <Text size="xs" c="dimmed" fw={800} visibleFrom="lg">
                {description.substring(0, 160) || "No description available"}
                {description.length > 160 ? "..." : ""}
              </Text>
              <Text ta="center" size="xs" c="dimmed" fw={800} hiddenFrom="lg">
                {description.substring(0, 160) || "No description available"}
                {description.length > 160 ? "..." : ""}
              </Text>
            </Stack>
          </SimpleGrid>

          <Group gap={"xs"}>
            <Button
              variant="light"
              color="brand.7"
              size="xs"
              justify="space-between"
              rightSection={<ArrowUpRightIcon />}
              onClick={() => {
                Router.push("/agenda/" + selectedAgendaId);
              }}
              style={{
                pointerEvents: "all",
              }}
            >
              Join Discussion
            </Button>

            <Tooltip
              label="Total Views"
              style={{
                fontSize: "var(--mantine-font-size-xs)",
                fontWeight: 600,
                pointerEvents: "all",
              }}
            >
              <Button
                color="gray"
                size="xs"
                variant="subtle"
                leftSection={<EyeIcon weight="fill" />}
              >
                8,3K
              </Button>
            </Tooltip>
            <Tooltip
              label="Total Chats"
              style={{
                fontSize: "var(--mantine-font-size-xs)",
                fontWeight: 600,
                pointerEvents: "all",
              }}
            >
              <Button
                size="xs"
                variant="subtle"
                leftSection={<ChatIcon weight="fill" />}
              >
                2.3K
              </Button>
            </Tooltip>

            <Tooltip
              label="Total Solution Pins"
              style={{
                fontSize: "var(--mantine-font-size-xs)",
                fontWeight: 600,
                pointerEvents: "all",
              }}
            >
              <Button
                size="xs"
                variant="subtle"
                leftSection={<ThumbsUpIcon weight="fill" />}
              >
                113
              </Button>
            </Tooltip>
          </Group>
        </Stack>
      </>
    );
  };

  return (
    <>
      <Container>
        <Grid gutter={0}>
          <Grid.Col span={{ base: 12, lg: 7 }}>
            {/* Mobile version - centered */}
            <Group
              gap={0}
              style={{
                pointerEvents: "all",
              }}
              visibleFrom="lg"
            >
              <Button
                variant={agendaScope === "rastriya" ? "light" : "subtle"}
                size="xs"
                onClick={() => {
                  setAgendaScope("rastriya");
                  setSelectedDistrictId(null);
                }}
              >
                Rastriya Agenda
              </Button>
              <Menu withArrow>
                <Menu.Target>
                  <Button
                    variant={agendaScope === "district" ? "light" : "subtle"}
                    size="xs"
                    rightSection={<CaretDownIcon />}
                  >
                    District Agenda{" "}
                    {selectedDistrictId && districts
                      ? `: ${
                          districts.find(
                            (d) => d.id.toString() === selectedDistrictId
                          )?.name || ""
                        }`
                      : ""}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown component={ScrollArea} h={300}>
                  {districts && districts.length > 0 ? (
                    districts.map((district) => (
                      <Menu.Item
                        key={district.id}
                        onClick={() => {
                          setSelectedDistrictId(district.id.toString());
                        }}
                        style={{
                          backgroundColor:
                            selectedDistrictId === district.id.toString()
                              ? "var(--mantine-color-blue-0)"
                              : undefined,
                          fontWeight:
                            selectedDistrictId === district.id.toString()
                              ? 600
                              : 400,
                        }}
                      >
                        {district.name}
                      </Menu.Item>
                    ))
                  ) : (
                    <Text size="xs" c="dimmed" p="sm">
                      No districts available
                    </Text>
                  )}
                </Menu.Dropdown>
              </Menu>
            </Group>

            {/* Mobile version - centered with Drawer */}
            <Group
              gap={0}
              style={{
                pointerEvents: "all",
                justifyContent: "center",
              }}
              hiddenFrom="lg"
            >
              <Button
                variant={agendaScope === "rastriya" ? "light" : "subtle"}
                size="xs"
                onClick={() => {
                  setAgendaScope("rastriya");
                  setSelectedDistrictId(null);
                }}
              >
                Rastriya Agenda
              </Button>
              <Button
                variant={agendaScope === "district" ? "light" : "subtle"}
                size="xs"
                rightSection={<CaretDownIcon />}
                onClick={() => setDistrictDrawerOpen(true)}
              >
                District Agenda{" "}
                {selectedDistrictId && districts
                  ? `: ${
                      districts.find(
                        (d) => d.id.toString() === selectedDistrictId
                      )?.name || ""
                    }`
                  : ""}
              </Button>
            </Group>

            {/* Districts Drawer */}
            <Drawer
              opened={districtDrawerOpen}
              onClose={() => setDistrictDrawerOpen(false)}
              title="Select District"
              position="bottom"
            >
              <Stack gap="xs">
                {districts && districts.length > 0 ? (
                  districts.map((district) => (
                    <Button
                      key={district.id}
                      variant={
                        selectedDistrictId === district.id.toString()
                          ? "light"
                          : "subtle"
                      }
                      justify="flex-start"
                      onClick={() => {
                        setSelectedDistrictId(district.id.toString());
                        setDistrictDrawerOpen(false);
                      }}
                    >
                      {district.name}
                    </Button>
                  ))
                ) : (
                  <Text size="xs" c="dimmed">
                    No districts available
                  </Text>
                )}
              </Stack>
            </Drawer>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 5 }} pt={{ base: "30vh", lg: 100 }}>
            <RenderDetails />
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
