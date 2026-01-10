"use client";

import { useState } from "react";
import {
  Container,
  Group,
  Text,
  Button,
  Menu,
  Avatar,
  Burger,
  Select,
} from "@mantine/core";
import {
  ArrowUpRightIcon,
  CaretDownIcon,
  DoorIcon,
  MailboxIcon,
  UserIcon,
  XIcon,
} from "@phosphor-icons/react";
//store
import { useAuthStore } from "@/modules/auth";
import { useLanguage } from "@/store/language.store";
//lib
import { getTranslation } from "@/lib/content";
//styles
import classes from "./sitenav.module.css";

export function SiteNav() {
  // * DEFINITIONS
  const [overlayState, setOverlayState] = useState<string | null>(null);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [profileDrawerOpened, setProfileDrawerOpened] = useState(false);

  // * STORE

  const { isAuthenticated, user, logout } = useAuthStore();
  const language = useLanguage();

  // * HANDLERS
  const onSetOverlayState = (state: string | null) => setOverlayState(state);
  const onNavDrawerToggle = () => setNavDrawerOpen(!navDrawerOpen);

  return (
    <>
      <nav className={classes.root}>
        <Container>
          <Group h={50} justify="space-between">
            <Group
              style={{
                cursor: "pointer",
              }}
              onClick={() => {}}
            >
              <Text size="xs">{getTranslation(language, "nav.campaign")}</Text>
              <Text visibleFrom="md" size="xs" opacity={0.3}>
                {getTranslation(language, "nav.tagline")}
              </Text>
            </Group>

            <Group gap={"xs"} visibleFrom="md">
              <Button
                size="xs"
                variant="subtle"
                onClick={() => onSetOverlayState(null)}
                rightSection={<ArrowUpRightIcon weight="bold" />}
              >
                Submit your Agenda.
              </Button>

              {overlayState ? (
                <Button
                  size="xs"
                  variant="subtle"
                  onClick={() => onSetOverlayState(null)}
                  leftSection={<XIcon weight="bold" />}
                >
                  Back to App
                </Button>
              ) : (
                <>
                  {isAuthenticated && user ? (
                    <Menu position="bottom-end">
                      <Menu.Target>
                        <Button
                          size="xs"
                          variant="light"
                          leftSection={
                            <Avatar
                              size="xs"
                              name={user.full_name}
                              color="brand"
                              variant="filled"
                            />
                          }
                          rightSection={<CaretDownIcon />}
                        >
                          {user.full_name}
                        </Button>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<MailboxIcon />} disabled>
                          {user.email}
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<UserIcon />}
                          onClick={() => setProfileDrawerOpened(true)}
                        >
                          {getTranslation(language, "nav.profile")}
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                          leftSection={<DoorIcon />}
                          onClick={() => logout()}
                        >
                          {getTranslation(language, "nav.logout")}
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  ) : (
                    <Button
                      size="xs"
                      onClick={() => onSetOverlayState("signin")}
                    >
                      {getTranslation(language, "nav.signIn")}
                    </Button>
                  )}
                </>
              )}

              <Select
                w={{ base: "auto", lg: 50 }}
                data={[
                  { value: "en", label: "EN" },
                  { value: "np", label: "नेपा" },
                ]}
                value={language}
                onChange={(value) => {
                  if (value === "en" || value === "np") {
                    // Handle language change here
                  }
                }}
                size="xs"
                searchable={false}
                clearable={false}
                style={{ minWidth: 60 }}
                suppressHydrationWarning
              />
            </Group>

            <Burger
              opened={navDrawerOpen}
              onClick={onNavDrawerToggle}
              size="sm"
              hiddenFrom="md"
            />
          </Group>
        </Container>
      </nav>
    </>
  );
}
