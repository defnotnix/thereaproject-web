"use client";

import { useState } from "react";
import {
  Stack,
  Text,
  Paper,
  Badge,
  Group,
  Button,
  Loader,
  Alert,
  Textarea,
  Divider,
  ThemeIcon,
  CheckIcon,
  RingProgress,
  Center,
  ActionIcon,
} from "@mantine/core";
import {
  WarningIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowCircleDownIcon,
} from "@phosphor-icons/react";
import {
  checkContent,
  type TrustScore,
  type Penalty,
  type CanPostResponse,
  type ContentCheckResponse,
} from "@/modules/moderation/moderation.api";

interface ProfanityTabProps {
  trustScore: TrustScore | null;
  penalties: Penalty[];
  canPostStatus: CanPostResponse | null;
  contentCheckResult: ContentCheckResponse | null;
  checkContentText: string;
  loading: boolean;
  checking: boolean;
  error: string | null;
  accessToken: string | null;
  onCheckContentTextChange: (text: string) => void;
  onLoadProfanityData: () => void;
}

export function ProfanityTab({
  trustScore,
  penalties,
  canPostStatus,
  contentCheckResult,
  checkContentText,
  loading,
  checking,
  error,
  accessToken,
  onCheckContentTextChange,
  onLoadProfanityData,
}: ProfanityTabProps) {
  const [contentCheckError, setContentCheckError] = useState<string | null>(
    null
  );
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<ContentCheckResponse | null>(
    contentCheckResult
  );

  const handleCheckContent = async () => {
    if (!checkContentText.trim() || !accessToken) return;

    setIsChecking(true);
    setContentCheckError(null);
    try {
      const checkResult = await checkContent(checkContentText, accessToken);
      setResult(checkResult);
    } catch (err) {
      setContentCheckError(
        err instanceof Error ? err.message : "Failed to check content"
      );
    } finally {
      setIsChecking(false);
    }
  };

  const getTrustLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "trusted":
      case "excellent":
        return "green";
      case "standard":
      case "normal":
        return "blue";
      case "restricted":
      case "warning":
        return "orange";
      case "banned":
      case "critical":
        return "red";
      default:
        return "gray";
    }
  };

  const getTrustCardColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "trusted":
      case "excellent":
        return "green.9";
      case "standard":
      case "normal":
        return "blue.9";
      case "restricted":
      case "warning":
        return "orange.9";
      case "banned":
      case "critical":
        return "red.9";
      default:
        return "gray.9";
    }
  };

  const getTrustCardRingColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "trusted":
      case "excellent":
        return "green";
      case "standard":
      case "normal":
        return "blue";
      case "restricted":
      case "warning":
        return "orange";
      case "banned":
      case "critical":
        return "red";
      default:
        return "gray";
    }
  };

  const getTrustCardMessage = (level: string, score: number) => {
    switch (level?.toLowerCase()) {
      case "trusted":
      case "excellent":
        return "Your account is in excellent standing";
      case "standard":
      case "normal":
        return "Your account is in good standing";
      case "restricted":
      case "warning":
        return "Your account has restrictions";
      case "banned":
      case "critical":
        return "Your account is banned";
      default:
        return "Your account status is unknown";
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "yellow";
      default:
        return "gray";
    }
  };

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
          {trustScore && (
            <Paper
              radius={0}
              bg={getTrustCardColor(trustScore.trust_level)}
              p="lg"
            >
              <Group wrap="nowrap">
                <RingProgress
                  size={48}
                  thickness={4}
                  sections={[
                    {
                      value: trustScore.score,
                      color: getTrustCardRingColor(trustScore.trust_level),
                    },
                  ]}
                  label={
                    <Center>
                      <ActionIcon
                        color={getTrustCardRingColor(trustScore.trust_level)}
                        variant="light"
                        radius="xl"
                        size="xl"
                      >
                        <CheckIcon size={12} />
                      </ActionIcon>
                    </Center>
                  }
                />

                <div>
                  <Text size="sm">
                    {getTrustCardMessage(
                      trustScore.trust_level,
                      trustScore.score
                    )}
                  </Text>
                  <Text size="xs" c="gray.4">
                    You can use this account to use all features in this
                    platform.
                  </Text>
                </div>
              </Group>
            </Paper>
          )}

          {/* Trust Score Section */}
          {trustScore && (
            <Paper bg="none" px="md" radius="md">
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="xs" c="dimmed">
                    Total Flags Submitted:
                  </Text>
                  <Text size="sm" fw={500}>
                    {trustScore.total_flags_submitted}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="xs" c="dimmed">
                    Valid Flags:
                  </Text>
                  <Text size="sm" fw={500}>
                    {trustScore.valid_flags_count}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="xs" c="dimmed">
                    Invalid Flags:
                  </Text>
                  <Text size="sm" fw={500}>
                    {trustScore.invalid_flags_count}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="xs" c="dimmed">
                    Content Flagged:
                  </Text>
                  <Text size="sm" fw={500}>
                    {trustScore.content_flagged_count}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="xs" c="dimmed">
                    Violations:
                  </Text>
                  <Text size="sm" fw={500}>
                    {trustScore.violations_count}
                  </Text>
                </Group>
              </Stack>
            </Paper>
          )}

          <Divider />

          {/* Posting Status Section */}
          {canPostStatus && (
            <Paper bg="none" px="md" radius={0}>
              <Group justify="space-between" mb="md">
                <Text fw={600} size="xs">
                  Posting Status
                </Text>
                {canPostStatus.can_post ? (
                  <Badge color="teal" variant="dot">
                    Can Post
                  </Badge>
                ) : (
                  <Badge
                    color="red"
                    variant="filled"
                    leftSection={<XCircleIcon />}
                  >
                    Cannot Post
                  </Badge>
                )}
              </Group>

              {!canPostStatus.can_post && canPostStatus.reason && (
                <Stack gap="xs">
                  <Alert icon={<WarningIcon />} color="orange">
                    {canPostStatus.reason}
                  </Alert>
                  {canPostStatus.expires_at && (
                    <Group gap="xs">
                      <ClockIcon size={16} />
                      <Text size="sm">
                        Restriction expires:{" "}
                        {new Date(canPostStatus.expires_at).toLocaleString()}
                      </Text>
                    </Group>
                  )}
                </Stack>
              )}
            </Paper>
          )}

          {/* Penalties Section */}
          {penalties.length > 0 && (
            <Paper p="md" radius="md" withBorder>
              <Text fw={600} size="sm" mb="md">
                Active Penalties ({penalties.length})
              </Text>
              <Stack gap="sm">
                {penalties.map((penalty) => (
                  <Paper
                    key={penalty.id}
                    p="sm"
                    radius="md"
                    style={{
                      backgroundColor: "var(--mantine-color-gray-0)",
                      border: "1px solid var(--mantine-color-gray-2)",
                    }}
                  >
                    <Group justify="space-between" mb="xs">
                      <Text fw={500} size="sm">
                        {penalty.reason}
                      </Text>
                      <Badge
                        color={getSeverityColor(penalty.severity)}
                        size="sm"
                        variant="light"
                      >
                        {penalty.severity}
                      </Badge>
                    </Group>
                    <Text size="xs" c="dimmed">
                      Created:{" "}
                      {new Date(penalty.created_at).toLocaleDateString()}
                    </Text>
                    {penalty.expires_at && (
                      <Text size="xs" c="dimmed">
                        Expires:{" "}
                        {new Date(penalty.expires_at).toLocaleDateString()}
                      </Text>
                    )}
                  </Paper>
                ))}
              </Stack>
            </Paper>
          )}

          <Divider />

          {/* Content Checker Section
          <Paper p="md" radius="md" withBorder>
            <Text fw={600} size="sm" mb="md">
              Check Content Before Posting
            </Text>
            <Stack gap="md">
              <Textarea
                label="Enter your content"
                placeholder="Type or paste your message here..."
                minRows={4}
                value={checkContentText}
                onChange={(e) =>
                  onCheckContentTextChange(e.currentTarget.value)
                }
                disabled={isChecking}
              />
              <Button
                onClick={handleCheckContent}
                loading={isChecking}
                disabled={!checkContentText.trim()}
              >
                Check Content
              </Button>

              {contentCheckError && (
                <Alert icon={<WarningIcon />} color="red">
                  {contentCheckError}
                </Alert>
              )}

              {result && (
                <Alert
                  icon={result.is_clean ? <CheckCircleIcon /> : <XCircleIcon />}
                  color={result.is_clean ? "green" : "red"}
                >
                  <Stack gap="xs">
                    <Text fw={500}>
                      {result.is_clean
                        ? "Content is clean"
                        : result.warning || "Content contains issues"}
                    </Text>

                    {!result.is_clean && (
                      <>
                        {result.flagged_words &&
                          result.flagged_words.length > 0 && (
                            <Stack gap="xs">
                              <Text size="sm" fw={500}>
                                Flagged words:
                              </Text>
                              <Group gap="xs">
                                {result.flagged_words.map((word) => (
                                  <Badge
                                    key={word}
                                    color={getSeverityColor(result.severity)}
                                    variant="light"
                                  >
                                    {word}
                                  </Badge>
                                ))}
                              </Group>
                            </Stack>
                          )}
                        {result.severity && (
                          <Group gap="xs">
                            <Text size="sm">Severity:</Text>
                            <Badge color={getSeverityColor(result.severity)}>
                              {result.severity}
                            </Badge>
                          </Group>
                        )}
                      </>
                    )}
                  </Stack>
                </Alert>
              )}
            </Stack>
          </Paper> */}

          {/* Refresh Button */}
          <Button
            radius={0}
            color="teal"
            variant="light"
            onClick={onLoadProfanityData}
            leftSection={<ArrowCircleDownIcon />}
          >
            Refresh Profile
          </Button>
        </Stack>
      )}
    </>
  );
}
