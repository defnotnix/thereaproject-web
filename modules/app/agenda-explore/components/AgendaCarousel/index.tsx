import { memo } from "react";
import {
  Card,
  Group,
  Stack,
  Text,
  Loader,
  Center,
  useMantineTheme,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { EnhancedAgenda } from "../../explore.api";
import classes from "./AgendaCarousel.module.css";
import classesCarousel from "./carousell.module.css";
import { useMediaQuery } from "@mantine/hooks";

interface AgendaCarouselProps {
  agendas: EnhancedAgenda[] | undefined;
  isLoading: boolean;
  selectedAgendaId: string | undefined;
  onAgendaSelect: (agenda: EnhancedAgenda) => void;
  isDetailLoading?: boolean;
  emptyMessage?: string;
}

export const AgendaCarousel = memo(function AgendaCarousel({
  agendas,
  isLoading,
  selectedAgendaId,
  onAgendaSelect,
  isDetailLoading = false,
  emptyMessage,
}: AgendaCarouselProps) {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  if (isLoading || !agendas) {
    return (
      <Center py="xl">
        <Group>
          <Loader size="xs" />
          <Text size="xs">Loading agendas...</Text>
        </Group>
      </Center>
    );
  }

  if (agendas.length === 0) {
    return (
      <Center py="xl">
        <Text ta="center" size="sm" c="dimmed">
          {emptyMessage || "No agendas found for this selection."}
        </Text>
      </Center>
    );
  }

  return (
    <>
      <Carousel
        classNames={classesCarousel}
        slideGap={4}
        slideSize={{ base: "100%", lg: "25%" }}
        emblaOptions={{
          loop: true,
          dragFree: false,
          align: "start",
          slidesToScroll: mobile ? 1 : 4,
        }}
      >
        {agendas?.map((agenda) => (
          <Carousel.Slide key={agenda.id}>
            <Card
              radius="md"
              p="xl"
              className={`${classes.agendaCard} ${
                selectedAgendaId === agenda.id ? classes.agendaCardActive : ""
              }`}
              onClick={() => !isDetailLoading && onAgendaSelect(agenda)}
              style={{ cursor: isDetailLoading ? "not-allowed" : "pointer", opacity: isDetailLoading ? 0.6 : 1 }}
            >
              <Stack gap="xs">
                <Text size="md" h={42}>
                  {agenda.title}
                </Text>

                {agenda.submitted_by && (
                  <Text size="xs" c="dimmed">
                    by {agenda.submitted_by.name}
                  </Text>
                )}

                <Group>
                  {agenda.extension?.phase_display && (
                    <Text size="10px" c="blue.6" fw={800}>
                      {agenda.extension.phase_display}
                    </Text>
                  )}
                  <Text size="10px">
                    {new Date(agenda.created_at).toLocaleDateString()}
                  </Text>
                </Group>
              </Stack>
            </Card>
          </Carousel.Slide>
        ))}
      </Carousel>
    </>
  );
});
