"use client";

import { useState } from "react";
import {
  ActionIcon,
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Group,
  SimpleGrid,
  Text,
} from "@mantine/core";
//styles
import classes from "./profilenav.module.css";
import {
  ArrowLeftIcon,
  BellIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { getTranslation } from "@/lib/content";
import { useLanguage } from "@/store/language.store";
import { useSelectedAgendaId } from "@/store/agenda-explore.store";
import { NotificationModalContainer } from "./NotificationModalContainer";

export function ProfileNav() {
  // * DEFINITIONS

  const Router = useRouter();

  // * STORE x CONTEXTS

  const language = useLanguage();
  const selectedAgendaId = useSelectedAgendaId();

  // * STATES
  const [notificationModalOpened, setNotificationModalOpened] = useState(false);

  // * PRELOADING

  // * FUNCTIONS
  const onBackClick = () => {
    Router.push("/explore");
  };

  // * COMPONENTS

  return (
    <>
      <nav className={classes.root}>
        <Container className={classes.container}>
          <SimpleGrid cols={{ base: 2, lg: 3 }}>
            <Group gap="xs" h={40}>
              <ActionIcon onClick={onBackClick} size="sm" variant="subtle">
                <ArrowLeftIcon size={12} weight="bold" />
              </ActionIcon>
              <Breadcrumbs separatorMargin={8}>
                <Text size="xs">RPA</Text>
                <Text size="xs">Agenda Profile</Text>
              </Breadcrumbs>
            </Group>

            <Group h={40} justify="center" visibleFrom="lg">
              <Text size="xs">Agenda Title | Discussion Phase</Text>
            </Group>

            <Group justify="flex-end" gap={0}>
              {/* <Button
                radius={0}
                h={40}
                size="xs"
                leftSection={<ThumbsUpIcon weight="fill" />}
                variant="subtle"
              >
                -
              </Button>
              <Button
                radius={0}
                h={40}
                size="xs"
                leftSection={<ThumbsDownIcon weight="fill" />}
                variant="subtle"
              >
                -
              </Button> */}
              <Divider opacity={0.3} h={40} orientation="vertical" />
              <Button
                color="blue"
                variant="subtle"
                size="xs"
                radius={0}
                h={40}
                leftSection={<BellIcon weight="fill" />}
                onClick={() => setNotificationModalOpened(true)}
              >
                {getTranslation(language, "subnav.keepMeNotified")}
              </Button>
            </Group>
          </SimpleGrid>
        </Container>
      </nav>

      <NotificationModalContainer
        agendaId={selectedAgendaId}
        opened={notificationModalOpened}
        onClose={() => setNotificationModalOpened(false)}
      />
    </>
  );
}
