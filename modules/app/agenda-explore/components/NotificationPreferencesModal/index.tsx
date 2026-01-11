"use client";

import { useState, useEffect, memo, useCallback } from "react";
import {
  Modal,
  Stack,
  Group,
  Switch,
  Button,
  Text,
  Center,
  Loader,
  Alert,
  Divider,
} from "@mantine/core";
import {
  useFollowStatus,
  useToggleFollow,
  useUpdatePreferences,
} from "../../hooks/useFollowStatus";
import { NotificationPreferences } from "../../follow.api";
import { WarningIcon } from "@phosphor-icons/react";

export interface NotificationPreferencesModalProps {
  agendaId: string | null;
  opened: boolean;
  onClose: () => void;
  isFollowing: boolean;
  onFollowSuccess?: (isFollowing: boolean) => void;
  onPreferencesUpdate?: () => void;
}

/**
 * NotificationPreferencesModal Component
 *
 * Modal dialog for managing follow status and notification preferences
 * Displays toggle switches for different notification types
 *
 * Features:
 * - Check current follow status
 * - Toggle follow/unfollow
 * - Update notification preferences
 * - Handles loading and error states
 *
 * Memoized to prevent re-renders from affecting parent components
 */
function NotificationPreferencesModalComponent({
  agendaId,
  opened,
  onClose,
  isFollowing: initialIsFollowing,
  onFollowSuccess,
  onPreferencesUpdate,
}: NotificationPreferencesModalProps) {
  const { data: followStatus, isLoading: statusLoading } =
    useFollowStatus(agendaId);
  const { mutate: toggleFollow, isPending: toggleLoading } =
    useToggleFollow(agendaId);
  const { mutate: updatePreferences, isPending: preferencesLoading } =
    useUpdatePreferences(agendaId);

  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null);

  // Update preferences from API response
  useEffect(() => {
    if (followStatus) {
      setIsFollowing(followStatus.is_following);
      setPreferences(followStatus.preferences);
    } else if (!statusLoading) {
      // If no follow status and not loading, initialize with defaults
      setPreferences({
        notify_new_messages: true,
        notify_new_solutions: true,
        notify_status_change: true,
        notify_voting: true,
        email_notifications: false,
      });
    }
  }, [followStatus, statusLoading]);

  // Handle toggle follow
  const handleToggleFollow = useCallback(() => {
    toggleFollow(undefined, {
      onSuccess: (data) => {
        setIsFollowing(data.is_following);
        onFollowSuccess?.(data.is_following);
      },
    });
  }, [toggleFollow, onFollowSuccess]);

  // Handle preference change
  const handlePreferenceChange = useCallback(
    (key: keyof NotificationPreferences, value: boolean) => {
      setPreferences((prev) => {
        const updatedPreferences = { ...(prev || {}), [key]: value };

        if (isFollowing) {
          updatePreferences(updatedPreferences, {
            onSuccess: () => {
              onPreferencesUpdate?.();
            },
          });
        }

        return updatedPreferences as NotificationPreferences;
      });
    },
    [isFollowing, updatePreferences, onPreferencesUpdate]
  );

  if (statusLoading) {
    return (
      <Modal
        opened={opened}
        onClose={onClose}
        title="Keep Me Notified"
        centered
      >
        <Center py="xl">
          <Group>
            <Loader size="sm" />
            <Text size="sm">Loading preferences...</Text>
          </Group>
        </Center>
      </Modal>
    );
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text size="xs">Follow this agenda.</Text>}
      centered
      size="sm"
    >
      <Stack gap="md">
        {/* Follow Status Section */}
        <Stack gap="sm">
          <Group justify="space-between">
            <Text size="sm">
              {isFollowing
                ? "You are following this agenda"
                : "You are not following this agenda"}
            </Text>
            <Button
              size="xs"
              variant={isFollowing ? "light" : "default"}
              color={isFollowing ? "red" : "blue"}
              onClick={handleToggleFollow}
              loading={toggleLoading}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          </Group>
        </Stack>

        <Divider hidden={!isFollowing} />

        {/* Notification Preferences Section */}
        {isFollowing && (
          <>
            <div />

            <Stack gap="sm">
              <Text size="xs" fw={600} c="dimmed">
                NOTIFICATION PREFERENCES
              </Text>

              <Stack gap="md">
                <Group justify="space-between">
                  <Stack gap={0}>
                    <Text size="xs">New Messages</Text>
                    <Text size="xs" c="dimmed">
                      Notify when someone posts a new message
                    </Text>
                  </Stack>
                  <Switch
                    checked={preferences?.notify_new_messages ?? true}
                    onChange={(e) =>
                      handlePreferenceChange(
                        "notify_new_messages",
                        e.currentTarget.checked
                      )
                    }
                    disabled={preferencesLoading}
                  />
                </Group>

                <Group justify="space-between">
                  <Stack gap={0}>
                    <Text size="xs">New Solutions</Text>
                    <Text size="xs" c="dimmed">
                      Notify when a solution is posted
                    </Text>
                  </Stack>
                  <Switch
                    checked={preferences?.notify_new_solutions ?? true}
                    onChange={(e) =>
                      handlePreferenceChange(
                        "notify_new_solutions",
                        e.currentTarget.checked
                      )
                    }
                    disabled={preferencesLoading}
                  />
                </Group>

                <Group justify="space-between">
                  <Stack gap={0}>
                    <Text size="xs">Status Changes</Text>
                    <Text size="xs" c="dimmed">
                      Notify when agenda status changes
                    </Text>
                  </Stack>
                  <Switch
                    checked={preferences?.notify_status_change ?? true}
                    onChange={(e) =>
                      handlePreferenceChange(
                        "notify_status_change",
                        e.currentTarget.checked
                      )
                    }
                    disabled={preferencesLoading}
                  />
                </Group>

                <Group justify="space-between">
                  <Stack gap={0}>
                    <Text size="xs">Voting Activity</Text>
                    <Text size="xs" c="dimmed">
                      Notify when votes are cast on messages
                    </Text>
                  </Stack>
                  <Switch
                    checked={preferences?.notify_voting ?? true}
                    onChange={(e) =>
                      handlePreferenceChange(
                        "notify_voting",
                        e.currentTarget.checked
                      )
                    }
                    disabled={preferencesLoading}
                  />
                </Group>

                <Group justify="space-between">
                  <Stack gap={0}>
                    <Text size="xs">Email Notifications</Text>
                    <Text size="xs" c="dimmed">
                      Receive notifications via email
                    </Text>
                  </Stack>
                  <Switch
                    checked={preferences?.email_notifications ?? false}
                    onChange={(e) =>
                      handlePreferenceChange(
                        "email_notifications",
                        e.currentTarget.checked
                      )
                    }
                    disabled={preferencesLoading}
                  />
                </Group>
              </Stack>
            </Stack>
          </>
        )}

        {/* Close Button */}
      </Stack>
    </Modal>
  );
}

export const NotificationPreferencesModal = memo(
  NotificationPreferencesModalComponent
);
export default NotificationPreferencesModal;
