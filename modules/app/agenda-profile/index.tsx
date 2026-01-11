"use client";

import { useEffect } from "react";
import { Container, Grid } from "@mantine/core";
import { useSetSelectedAgendaId } from "@/store/agenda-explore.store";
import { AgendaDetails } from "./components/AgendaProfile";
import { AgendaChat } from "@/components/AgendaChat";
import { MapRender } from "@/components/DynamicMap";

import styles from "./profile.module.css";

interface ModuleAppAgendaProfileProps {
  agendaId: string;
}

export function ModuleAppAgendaProfile({
  agendaId,
}: ModuleAppAgendaProfileProps) {
  const setSelectedAgendaId = useSetSelectedAgendaId();

  // Set the selected agenda ID from the URL parameter
  useEffect(() => {
    setSelectedAgendaId(agendaId);
  }, [agendaId, setSelectedAgendaId]);

  return (
    <>
      <Container pos="relative">
        <div className={styles.mapContainer}>
          <MapRender />
        </div>

        <Grid gutter={0}>
          <Grid.Col span={{ base: 12, lg: 5 }} pt={200} visibleFrom="lg">
            <AgendaDetails />
          </Grid.Col>
          <Grid.Col
            h={"calc(100vh- 90px)"}
            span={{ base: 12, lg: 6 }}
            offset={{ base: 0, lg: 1 }}
            bg="#000000aa"
            style={{
              backdropFilter: "blur(24px)",
            }}
          >
            <AgendaChat />
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
