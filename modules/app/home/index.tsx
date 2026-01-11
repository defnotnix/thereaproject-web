"use client";

import { MapRender } from "@/components/DynamicMap";
import { getTranslation } from "@/lib/content";
import { useLanguage } from "@/store/language.store";
import styles from "./home.module.css";
import {
  Button,
  Container,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export function ModuleAppHome() {
  // * STORE
  const language = useLanguage();
  const Router = useRouter();

  return (
    <>
      <div className={styles.mapContainer}>
        <MapRender />
      </div>

      <Container
        onClick={() => {
          Router.push("/explore");
        }}
      >
        <Grid>
          <Grid.Col
            h={"calc(100vh - 90px)"}
            style={{
              display: "flex",
              alignItems: "flex-end",
            }}
            span={{ base: 12, lg: 6 }}
          >
            <Stack gap="xl">
              <Text opacity={0.5} size="sm">
                {getTranslation(language, "initial.subtitle")}
              </Text>
              <Text size="4rem" visibleFrom="lg">
                {getTranslation(language, "initial.title")}
              </Text>
              <Text size="2rem" hiddenFrom="lg">
                {getTranslation(language, "initial.title")}
              </Text>
              <SimpleGrid cols={2}>
                <Text size="xs" opacity={0.6}>
                  {getTranslation(language, "initial.description1")}
                </Text>
                <Text size="xs" opacity={0.6}>
                  {getTranslation(language, "initial.description2")}
                </Text>
              </SimpleGrid>

              <Group mt={80} visibleFrom="lg">
                <Text size="xl" tt="capitalize">
                  {getTranslation(language, "initial.cta")}
                </Text>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>

      <div
        style={{
          position: "fixed",
          top: 160,
          right: 0,
          width: "100%",
          pointerEvents: "none",
        }}
      >
        <Container pos="relative" visibleFrom="lg">
          <Group justify="flex-end">
            <div>
              <Stack gap={4}>
                <Paper
                  px="lg"
                  py="xl"
                  radius="md"
                  bg="#EEECE7"
                  style={{
                    backdropFilter: "blur(16px)",
                    transform: "rotate(-2deg)",
                  }}
                  shadow="xl"
                >
                  <Stack>
                    <Text size="xs" c="dark.9" ta="right" opacity={0.5}>
                      Every participation counts.
                    </Text>

                    <Text c="black" ta="right" size="lg" lh="110%" fw={800}>
                      Join{" "}
                      <span
                        style={{
                          color: "var(--mantine-color-brand-6)",
                        }}
                      >
                        our mission
                      </span>{" "}
                      <span style={{ opacity: 0.6 }}>
                        <br /> to build a better nation,
                        <br />
                      </span>{" "}
                      <span
                        style={{
                          color: "#0d53bbff",
                        }}
                      >
                        representing all 77 districts.
                      </span>
                    </Text>

                    <Button
                      size="xs"
                      fullWidth
                      justify="flex-end"
                      variant="subtle"
                      c="brand.6"
                      rightSection={<ArrowUpRightIcon />}
                      style={{
                        pointerEvents: "all",
                      }}
                      fw={700}
                      tt="uppercase"
                      //   onClick={() => setOverlayState("signin")}
                    >
                      Join Today
                    </Button>
                  </Stack>
                </Paper>
                <Paper
                  px="lg"
                  py="xl"
                  radius="md"
                  bg="#EEECE7"
                  shadow="xl"
                  mt="md"
                  style={{
                    backdropFilter: "blur(16px)",
                    transform: "rotate(4deg) ",
                  }}
                >
                  <Text c="black" ta="right" size="lg" lh="110%" fw={800}>
                    - Active Agendas
                    <br />{" "}
                    <span
                      style={{
                        color: "var(--mantine-color-brand-6)",
                      }}
                    >
                      - Conversations
                    </span>
                  </Text>
                </Paper>
              </Stack>
            </div>
          </Group>
        </Container>
      </div>
    </>
  );
}
