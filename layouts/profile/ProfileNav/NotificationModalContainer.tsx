"use client";

import { memo, useCallback } from "react";
import { notifications } from "@mantine/notifications";
import { NotificationPreferencesModal } from "@/modules/app/agenda-explore/components/NotificationPreferencesModal";

interface NotificationModalContainerProps {
  agendaId: string | null;
  opened: boolean;
  onClose: () => void;
}

/**
 * NotificationModalContainer - Isolated modal component
 *
 * This component is memoized to prevent re-renders from affecting the parent.
 * Internal state changes in the modal stay contained within this component.
 * Handles all notifications for follow/preference changes via notifications.show()
 *
 * Callback functions are memoized to maintain stable references and prevent
 * unnecessary re-renders of child components.
 */
export const NotificationModalContainer = memo(function NotificationModalContainer({
  agendaId,
  opened,
  onClose,
}: NotificationModalContainerProps) {
  const handleFollowSuccess = useCallback((isFollowing: boolean) => {
    notifications.show({
      title: isFollowing ? "Following" : "Unfollowed",
      message: isFollowing
        ? "You are now following this agenda"
        : "You have unfollowed this agenda",
      color: "blue",
      autoClose: 3000,
    });
  }, []);

  const handlePreferencesUpdate = useCallback(() => {
    notifications.show({
      title: "Preferences Updated",
      message: "Your notification preferences have been saved",
      color: "green",
      autoClose: 3000,
    });
  }, []);

  return (
    <NotificationPreferencesModal
      agendaId={agendaId}
      opened={opened}
      onClose={onClose}
      isFollowing={false}
      onFollowSuccess={handleFollowSuccess}
      onPreferencesUpdate={handlePreferencesUpdate}
    />
  );
});

NotificationModalContainer.displayName = "NotificationModalContainer";
