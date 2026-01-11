"use client";

import { useState, useEffect } from "react";
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
import { useLanguage, useSetLanguage } from "@/store/language.store";
import {
  useSideContentStatus,
  useSetSideContentStatus,
} from "@/store/site.store";
//lib
import { getTranslation } from "@/lib/content";
//styles
import classes from "./sitenav.module.css";
import { useRouter } from "next/navigation";

export function SiteNav() {
  // * DEFINITIONS
  const Router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // * EFFECTS
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // * STORE

  const { isAuthenticated, user, logout } = useAuthStore();
  const language = useLanguage();
  const setLanguage = useSetLanguage();
  const overlayState = useSideContentStatus();
  const setOverlayState = useSetSideContentStatus();

  // * HANDLERS
  const onNavDrawerToggle = () => {
    if (isAuthenticated) {
      setOverlayState("user-profile");
    } else {
      setOverlayState("signin");
    }
  };

  return (
    <>
      <nav className={classes.root}>
        <Container className={classes.container}>
          <Group h={50} justify="space-between">
            <Group
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                Router.push("/");
              }}
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
                onClick={() => setOverlayState("submit-agenda")}
                rightSection={<ArrowUpRightIcon weight="bold" />}
              >
                {getTranslation(language, "nav.submitAgenda")}
              </Button>

              {overlayState ? (
                <Button
                  size="xs"
                  variant="subtle"
                  onClick={() => setOverlayState(null)}
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
                          onClick={() => setOverlayState("user-profile")}
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
                    <Button size="xs" onClick={() => setOverlayState("signin")}>
                      {getTranslation(language, "nav.signIn")}
                    </Button>
                  )}
                </>
              )}

              {isMounted && (
                <Select
                  id="language-select"
                  w={{ base: "auto", lg: 50 }}
                  data={[
                    { value: "en", label: "EN" },
                    { value: "np", label: "नेपा" },
                  ]}
                  value={language}
                  onChange={(value) => {
                    if (value === "en" || value === "np") {
                      setLanguage(value);
                    }
                  }}
                  size="xs"
                  searchable={false}
                  clearable={false}
                  style={{ minWidth: 60 }}
                />
              )}
            </Group>

            <Burger
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
