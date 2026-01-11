"use client";

import {
  Modal,
  Stack,
  Text,
  Divider,
  Paper,
  Timeline,
  Select,
  Group,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  ChatIcon,
  LightningIcon,
  LockIcon,
  NoteIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

const patchNotesByDate = [
  {
    date: new Date(2026, 0, 1),
    version: "0.1.1",
    updates: [
      {
        bullet: LightningIcon,
        title: "Performance improvements",
        description:
          "Various performance optimizations were applied to improve load times and overall application responsiveness.",
      },
      {
        bullet: ChatIcon,
        title: "Chat rate limiting enabled",
        description:
          "A 30-second slow mode has been implemented for chat to ensure fair usage and reduce spam.",
      },
    ],
  },
  {
    date: new Date(2026, 0, 11),
    version: "0.1.5",
    updates: [
      {
        bullet: LightningIcon,
        title: "Page breakdown for better performance",
        description:
          "The page has been broken down into individual pages for better performance loading.",
      },
      {
        bullet: NoteIcon,
        title: "UI/UX Fixes & Layout Updates",
        description:
          "Various UI/UX improvements and layout updates have been added to enhance the user experience.",
      },
      {
        bullet: LightningIcon,
        title: "Performance Upgrades",
        description:
          "Additional performance upgrades have been implemented to further improve application speed and responsiveness.",
      },
      {
        bullet: ChatIcon,
        title: "Chat Upvote/Downvote Feature",
        description:
          "Added upvote and downvote functionality for chat messages, allowing users to provide feedback on contributions.",
      },
    ],
  },
  {
    date: new Date(2026, 0, 12),
    version: "0.1.6",
    updates: [
      {
        bullet: NoteIcon,
        title: "UI Updates",
        description:
          "UI has been updated across the application for a more consistent and polished user experience.",
      },
      {
        bullet: LightningIcon,
        title: "Responsive Updates",
        description:
          "Enhanced responsive design to provide better support across all device sizes and screen resolutions.",
      },
      {
        bullet: ChatIcon,
        title: "Chat UI Updated",
        description:
          "The chat interface has been redesigned to improve usability and visual appeal.",
      },
      {
        bullet: UserIcon,
        title: "Notification Subscriptions",
        description:
          "Users can now subscribe to notifications specific to agendas and receive updates when agendas are modified.",
      },
      {
        bullet: NoteIcon,
        title: "Local Agenda Submission",
        description:
          "Local agendas can now be submitted through the Submit my Agenda feature. This feature is temporarily disabled for a few days until rastra agendas are stabilized.",
      },
      {
        bullet: ChatIcon,
        title: "UpVote & Downvote System",
        description:
          "A voting system has been added to chat messages, allowing users to upvote or downvote contributions based on their relevance and quality.",
      },
    ],
  },
  {
    date: new Date(2026, 0, 2),
    version: "0.1.2",
    updates: [
      {
        bullet: LockIcon,
        title: "API privacy vulnerability fixed",
        description:
          "An API access control issue was addressed, and security measures were strengthened to prevent unintended exposure of user data.",
      },
      {
        bullet: NoteIcon,
        title: "Agendas added for discussion",
        description:
          "Discussion agendas have been added. Note: The chat feature was not live at the time of this update and was enabled in a subsequent patch.",
      },
      {
        bullet: UserIcon,
        title: "Sign-up flow improved",
        description:
          "The user registration flow has been corrected to provide a smoother onboarding experience.",
      },
    ],
  },
  {
    date: new Date(2026, 0, 3),
    version: "0.1.3",
    updates: [
      {
        bullet: LockIcon,
        title: "Sign-in issues resolved",
        description:
          "Authentication-related issues have been fixed to ensure a stable and reliable sign-in experience.",
      },
      {
        bullet: ChatIcon,
        title: "Chat feature properly enabled",
        description:
          "The chat feature has been enabled, allowing ufPsers to communicate and discuss agendas.",
      },
      {
        bullet: ChatIcon,
        title: "Feature enabled to load older chat history",
        description:
          "The chat feature has been enabled to load older chat history, allowing users to access their previous conversations.",
      },
    ],
  },
  {
    date: new Date(2026, 0, 4),
    version: "0.1.4",
    updates: [
      {
        bullet: NoteIcon,
        title: "Modified UI to browse agenda",
        description:
          "No more is active agenda shown separately. The UI has been updated to provide a cleaner browsing experience.",
      },
      {
        bullet: LockIcon,
        title: "Fixed UI clashing bugs",
        description:
          "Fixed bugs where UI elements were clashing with each other. If you encounter more issues, please report them to the given email.",
      },
      {
        bullet: ChatIcon,
        title: "Added responsive support for mobile devices",
        description:
          "Added more responsive support for mobile devices. Table support is coming next.",
      },
      {
        bullet: LightningIcon,
        title: "Performance Updates",
        description:
          "Various performance improvements have been implemented to enhance overall application speed and responsiveness.",
      },
    ],
  },
];

export function ModalNotice() {
  const [opened, handlers] = useDisclosure(true);
  const [selectedDateIndex, setSelectedDateIndex] = useState(
    patchNotesByDate.length - 1
  );

  const dateOptions = patchNotesByDate.map((item, index) => ({
    value: index.toString(),
    label: `v${item.version} - ${item.date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
  }));

  const currentUpdates = patchNotesByDate[selectedDateIndex].updates;

  return (
    <Modal
      size="lg"
      title={
        <Text size="sm" fw={600}>
          Updates & Notices
        </Text>
      }
      opened={opened}
      onClose={handlers.close}
      top={100}
      styles={{
        header: {
          background: "var(--mantine-color-dark-9)",
        },
      }}
    >
      <Stack gap="xs" py="md">
        {/* Notice Section */}
        <div>
          <Stack gap="xs">
            <Paper withBorder p="md">
              <Stack gap="sm">
                <Text size="xs" fw={600} mb="sm">
                  📢 Important Notice
                </Text>

                <Text size="sm" c="dimmed">
                  This is an early prototype. You may encounter bugs or
                  unexpected behavior.
                  <br />
                  We're actively improving the platform with your feedback.
                </Text>

                <Text size="sm" fw={500}>
                  स्वागत छ! यो एपको प्रारम्भिक संस्करण हो।
                  <br />
                  तपाईंको धैर्य र प्रतिक्रिया हाम्रोलागि महत्वपूर्ण छ।
                </Text>
              </Stack>
            </Paper>
          </Stack>
        </div>

        <Paper withBorder p="md">
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" fw={600}>
                  ✨ Patch Updates ({" "}
                  {patchNotesByDate[selectedDateIndex].version})
                </Text>
              </div>
              <Select
                size="xs"
                data={dateOptions}
                value={selectedDateIndex.toString()}
                onChange={(value) => setSelectedDateIndex(Number(value))}
                searchable
              />
            </Group>
            <Timeline active={-1} bulletSize={24} lineWidth={2}>
              {currentUpdates.map((update, index) => (
                <Timeline.Item
                  key={index}
                  bullet={<update.bullet size={12} weight="fill" />}
                  title={
                    <Text fw={600} size="xs">
                      {update.title}
                    </Text>
                  }
                >
                  <Text c="dimmed" size="xs" mt={4}>
                    {update.description}
                  </Text>
                </Timeline.Item>
              ))}
            </Timeline>
          </Stack>
        </Paper>
        {/* <Divider />
        <Text size="xs" c="dimmed">
          If you experience any issues with signing in or signing up, please
          refresh the page and try again. If the problem persists, report it
          using the email address below.
        </Text>
        <Divider /> */}

        {/* Feedback Section */}
        {/* <div>
          <Text size="sm" fw={600} mb="sm">
            💬 Your Feedback Matters
          </Text>
          <Text size="xs" c="dimmed">
            Report issues or share suggestions at{" "}
            <Anchor href="mailto:rea.movement@gmail.com" target="_blank">
              rea.movement@gmail.com
            </Anchor>
          </Text>
        </div> */}

        <Paper withBorder p="md">
          <Stack gap="sm">
            <Text size="sm">
              Please pass your feedbacks to us at{" "}
              <span style={{ color: "var(--mantine-color-brand-4)" }}>
                rea.movement@gmail.com
              </span>
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Modal>
  );
}
