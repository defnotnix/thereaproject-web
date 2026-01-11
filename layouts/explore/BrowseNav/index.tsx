"use client";

import {
  Button,
  Container,
  Group,
  SimpleGrid,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useEffect } from "react";
//styles
import cx from "clsx";
import classes from "./browsenav.module.css";
import {
  useExploreTabs,
  useActiveTabId,
  useSetActiveTab,
  useSetExploreTabs,
} from "@/store/explore.store";
import {
  MegaphoneSimpleIcon,
  NewspaperIcon,
  ScrollIcon,
} from "@phosphor-icons/react";

export function BrowseNav() {
  // * DEFINITIONS

  // * STORE x CONTEXTS
  const tabs = useExploreTabs();
  const activeTabId = useActiveTabId();
  const setActiveTab = useSetActiveTab();
  const setExploreTabs = useSetExploreTabs();

  // * STATES

  // * PRELOADING
  useEffect(() => {
    // Initialize tabs if not already set
    if (tabs.length === 0) {
      const defaultTabs = [
        { id: "agenda-view", label: "Agenda", icon: ScrollIcon },
        {
          id: "announcements",
          label: "Announcements",
          icon: MegaphoneSimpleIcon,
        },
        { id: "fake-news", label: "Fake-News", icon: NewspaperIcon },
      ];
      setExploreTabs(defaultTabs);
    }
  }, []);

  // * FUNCTIONS

  // * COMPONENTS

  return (
    <>
      <nav className={classes.root}>
        <Container className={classes.container}>
          <SimpleGrid spacing={0} cols={{ base: 1, lg: 3 }}>
            <Group h={40} visibleFrom="lg">
              <Text c="dimmed" size="xs">
                Currently on Agenda-Browse
              </Text>
            </Group>

            <Group h={40} gap={0} justify="center">
              {tabs.map((tab) => (
                <UnstyledButton
                  className={cx(classes.tab, {
                    [classes.tab_active]: tab.id === activeTabId,
                  })}
                  size="xs"
                  h={40}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Group gap={"xs"}>
                    <tab.icon size={14} weight={"fill"} />
                    {tab.label}
                  </Group>
                </UnstyledButton>
              ))}
            </Group>

            <Group h={40} justify="flex-end" visibleFrom="lg">
              <Text c="dimmed" size="xs">
                Featured Agendas
              </Text>
            </Group>
          </SimpleGrid>
        </Container>
      </nav>
    </>
  );
}
