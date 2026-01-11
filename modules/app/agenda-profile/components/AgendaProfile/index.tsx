"use client";

import { useSelectedAgendaId } from "@/store/agenda-explore.store";
import { useAgendaDetail } from "../../hooks";
import {
  Box,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Skeleton,
  Badge,
} from "@mantine/core";
import { DistrictText } from "@/components/DistrictText";

export function AgendaDetails() {
  const selectedAgendaId = useSelectedAgendaId();

  const {
    data: agenda,
    isLoading,
    error,
  } = useAgendaDetail(selectedAgendaId || "", Boolean(selectedAgendaId));

  if (isLoading) {
    return (
      <Stack gap="xl">
        <Skeleton height={20} />
        <Skeleton height={40} />
        <Skeleton height={80} />
        <Divider />
        <Skeleton height={60} />
      </Stack>
    );
  }

  if (error) {
    return (
      <div>
        <Text size="sm" c="red">
          Failed to load agenda details
        </Text>
        <Text size="xs" c="red" opacity={0.7}>
          {error instanceof Error ? error.message : String(error)}
        </Text>
      </div>
    );
  }

  if (!agenda) {
    return (
      <Text size="sm" c="dimmed">
        No agenda data available
      </Text>
    );
  }

  const createdDate = new Date(agenda.created_at);
  const formattedDate = createdDate
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    .toUpperCase();

  return (
    <Stack gap="lg">
      <Group>
        <Text size="xs" tt="uppercase">
          {agenda.scope_display}
        </Text>
        <Text size="xs" tt="uppercase">
          {agenda.status}
        </Text>
        <Text size="xs" c="dimmed">
          {formattedDate}
        </Text>
      </Group>

      <Text size="4rem" fw={700}>
        {agenda.title}
      </Text>

      <Text size="sm" c="dimmed">
        {agenda.description}
      </Text>

      <Divider opacity={0.5} />

      <Stack>
        <SimpleGrid cols={3}>
          <Box>
            <Text c="dimmed" size="xs">
              Messages
            </Text>
            <Text size="lg" fw={600}>
              {agenda.message_count}
            </Text>
          </Box>
          <Box>
            <Text c="dimmed" size="xs">
              Solutions
            </Text>
            <Text size="lg" fw={600}>
              {agenda.solution_count}
            </Text>
          </Box>
          <Box>
            <Text c="dimmed" size="xs">
              Views
            </Text>
            <Text size="lg" fw={600}>
              {agenda.view_count}
            </Text>
          </Box>
        </SimpleGrid>
      </Stack>

      <Divider opacity={0.5} />

      <Group>
        <Box>
          <Text c="dimmed" size="xs" mb="xs">
            Posted by
          </Text>
          <Text size="sm">{agenda.submitted_by.full_name}</Text>
          <Text size="xs" c="dimmed">
            {agenda.submitted_by.email}
          </Text>
        </Box>

        {agenda.district && (
          <Box>
            <Text c="dimmed" size="xs" mb="xs">
              District
            </Text>
            <DistrictText
              districtName={agenda.district.name}
              districtDescription={agenda.district.name}
              size="sm"
              fw={400}
            />
          </Box>
        )}
      </Group>
    </Stack>
  );
}
