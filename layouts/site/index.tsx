"use client";

import cx from "clsx";
import { SiteNav } from "./SiteNav";
import {
  useSideContentStatus,
  useSetSideContentStatus,
} from "@/store/site.store";
import SignIn from "./OverlayContent/SignIn";
import Onboarding from "./OverlayContent/Onboarding";
import SubmitAgenda from "./OverlayContent/SubmitAgenda";
import { ProfileOverlay } from "./OverlayContent/UserProfile";
import { ModalNotice } from "./ModalNotice";
import {
  Container,
  Paper,
  Group,
  ActionIcon,
  Center,
  Text,
} from "@mantine/core";
import { XIcon } from "@phosphor-icons/react";
import { useLanguage } from "@/store/language.store";
import { getTranslation } from "@/lib/content";

import classes from "./site.module.css";

export function LayoutSite({ children }: any) {
  // * STORE

  const sideContentStatus = useSideContentStatus();
  const setSideContentStatus = useSetSideContentStatus();
  const language = useLanguage();

  return (
    <>
      <ModalNotice />
      <SiteNav />

      <main
        className={cx(classes.rootContainer, {
          [classes.contentContainer]: sideContentStatus,
        })}
      >
        {children}
      </main>

      {sideContentStatus && (
        <section className={classes.overlaySection}>
          <Container className={classes.overlayContainer}>
            <Paper
              radius={0}
              bg="none"
              w={{ base: "100%", md: "calc(30% - 32px)" }}
              h="calc(100vh - 60px)"
              className={classes.overlayPaper}
            >
              <Group
                justify="space-between"
                pl="md"
                h={40}
                gap="xs"
                className={classes.tabRoot}
              >
                <Text size="xs">
                  {sideContentStatus === "signin" &&
                    getTranslation(language, "overlay.signIn")}
                  {sideContentStatus === "onboarding" &&
                    "Complete Your Profile"}
                  {sideContentStatus === "submit-agenda" &&
                    getTranslation(language, "overlay.submitAgenda")}
                  {sideContentStatus === "user-profile" && "My Account"}
                </Text>

                <ActionIcon
                  size="sm"
                  variant="subtle"
                  onClick={() => setSideContentStatus(null)}
                >
                  <XIcon />
                </ActionIcon>
              </Group>

              <Center p="md" h="calc(100vh - 100px)">
                {sideContentStatus === "signin" && (
                  <SignIn onClose={() => setSideContentStatus(null)} />
                )}
                {sideContentStatus === "onboarding" && (
                  <Onboarding onClose={() => setSideContentStatus(null)} />
                )}
                {sideContentStatus === "submit-agenda" && (
                  <SubmitAgenda
                    onClose={() => setSideContentStatus(null)}
                    onSignIn={() => setSideContentStatus("signin")}
                  />
                )}

                {sideContentStatus === "user-profile" && (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <ProfileOverlay
                      onClose={() => setSideContentStatus(null)}
                    />
                  </div>
                )}
              </Center>
            </Paper>
          </Container>
        </section>
      )}
    </>
  );
}
