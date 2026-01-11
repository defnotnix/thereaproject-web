"use client";

import {
  Stack,
  Text,
  Paper,
  Badge,
  Group,
  Button,
  Loader,
  Alert,
} from "@mantine/core";
import { WarningIcon } from "@phosphor-icons/react";
import { type ModeratorApplication } from "@/modules/moderation/moderation.api";

interface ModeratorTabProps {
  applications: ModeratorApplication[];
  loading: boolean;
  error: string | null;
  withdrawing: string | null;
  onWithdrawApplication: (applicationId: string) => void;
  onLoadModeratorData: () => void;
  onOpenApplyModal: () => void;
}

export function ModeratorTab({
  applications,
  loading,
  error,
  withdrawing,
  onWithdrawApplication,
  onLoadModeratorData,
  onOpenApplyModal,
}: ModeratorTabProps) {
  return (
    <>
      {error && (
        <Alert icon={<WarningIcon />} color="red" mb="md">
          {error}
        </Alert>
      )}

      {loading ? (
        <Group justify="center" py="xl">
          <Loader size="sm" />
        </Group>
      ) : (
        <Stack gap="lg">
          {applications.length === 0 ? (
            <Stack gap="md">
              <Alert icon={<WarningIcon />} color="blue">
                You have no moderator applications.
              </Alert>
              <Button onClick={onOpenApplyModal}>Apply as Moderator</Button>
            </Stack>
          ) : (
            <Stack gap="sm">
              <Text fw={600} size="sm">
                My Applications ({applications.length})
              </Text>
              {applications.map((application) => (
                <Paper
                  key={application.id}
                  p="md"
                  radius="md"
                  withBorder
                  style={{
                    backgroundColor: "var(--mantine-color-gray-0)",
                  }}
                >
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="sm" mb="xs">
                        Application ID: {application.id}
                      </Text>
                      <Badge
                        color={
                          application.status === "approved"
                            ? "green"
                            : application.status === "rejected"
                            ? "red"
                            : application.status === "pending"
                            ? "yellow"
                            : "gray"
                        }
                        variant="light"
                      >
                        {application.status}
                      </Badge>
                    </div>
                    {application.status === "pending" && (
                      <Button
                        size="sm"
                        color="red"
                        variant="light"
                        onClick={() => onWithdrawApplication(application.id)}
                        loading={withdrawing === application.id}
                        disabled={withdrawing !== null}
                      >
                        Withdraw
                      </Button>
                    )}
                  </Group>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                      Created:{" "}
                      {new Date(application.created_at).toLocaleString()}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Updated:{" "}
                      {new Date(application.updated_at).toLocaleString()}
                    </Text>
                  </Group>
                </Paper>
              ))}
            </Stack>
          )}

          <Group>
            <Button variant="light" onClick={onLoadModeratorData}>
              Refresh Applications
            </Button>
            {applications.length > 0 && (
              <Button onClick={onOpenApplyModal}>Submit New Application</Button>
            )}
          </Group>
        </Stack>
      )}
    </>
  );
}
