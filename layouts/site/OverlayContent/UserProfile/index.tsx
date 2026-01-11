"use client";

import { useEffect, useState } from "react";
import {
  Stack,
  Text,
  Divider,
  Avatar,
  Group,
  Button,
  Center,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  CaretRightIcon,
  CaretLeftIcon,
  LightbulbIcon,
  StarIcon,
  GearSixIcon,
  FlagPennantIcon,
  FileTextIcon,
  ShieldCheckIcon,
  WarningIcon as WarningCircleIcon,
  ChatTeardropIcon,
  GlobeIcon,
  DoorIcon,
} from "@phosphor-icons/react";
import { useAuthStore } from "@/modules/auth/auth.store";
import {
  getTrustScore,
  getPenalties,
  canPost,
  getModeratorApplications,
  withdrawModeratorApplication,
  type TrustScore,
  type Penalty,
  type CanPostResponse,
  type ContentCheckResponse,
  type ModeratorApplication,
} from "@/modules/moderation/moderation.api";
import {
  getCurrentUser,
  type CurrentUserResponse,
} from "@/modules/auth/auth.api";
import {
  agendasAPI,
  type Agenda,
} from "@/modules/app/agendas/agendas.api";
import { ProfanityTab, ModeratorTab, PreferencesTab } from "./tabs";
import classes from "../site.module.css";

interface ProfileOverlayProps {
  onClose: () => void;
}

export function ProfileOverlay({ onClose }: ProfileOverlayProps) {
  const { user: authUser, accessToken, logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // User details state
  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);

  // Profanity tab state
  const [trustScore, setTrustScore] = useState<TrustScore | null>(null);
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [canPostStatus, setCanPostStatus] = useState<CanPostResponse | null>(
    null
  );
  const [contentCheckResult, setContentCheckResult] =
    useState<ContentCheckResponse | null>(null);
  const [checkContentText, setCheckContentText] = useState("");

  // Moderator tab state
  const [applications, setApplications] = useState<ModeratorApplication[]>([]);
  const [withdrawing, setWithdrawing] = useState<string | null>(null);

  // Followed agendas state
  const [followedAgendas, setFollowedAgendas] = useState<Agenda[]>([]);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user details when overlay mounts
  useEffect(() => {
    if (!accessToken) return;

    const loadUserData = async () => {
      setLoadingUser(true);
      try {
        const userData = await getCurrentUser(accessToken);
        setUser(userData);
      } catch (err) {
        // Silently fail - use auth store user as fallback
        console.error("Failed to load user details:", err);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUserData();
  }, [accessToken]);

  // Fetch profanity data when overlay mounts
  useEffect(() => {
    if (!accessToken) return;
    loadProfanityData();
  }, [accessToken]);

  // Load followed agendas when section is selected
  useEffect(() => {
    if (activeSection === "followed-agendas" && accessToken) {
      loadFollowedAgendas();
    }
  }, [activeSection, accessToken]);

  const loadProfanityData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [score, penaltiesList, postStatus] = await Promise.all([
        getTrustScore(accessToken!),
        getPenalties(accessToken!),
        canPost(accessToken!),
      ]);

      setTrustScore(score);
      setPenalties(penaltiesList);
      setCanPostStatus(postStatus);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load profanity data";
      setError(errorMessage);
      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadModeratorData = async () => {
    setLoading(true);
    setError(null);
    try {
      const apps = await getModeratorApplications(accessToken!);
      setApplications(apps);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load moderator applications";
      setError(errorMessage);
      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFollowedAgendas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await agendasAPI.getFollowedAgendas(accessToken!);
      setFollowedAgendas(data.results);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load followed agendas";
      setError(errorMessage);
      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawApplication = async (applicationId: string) => {
    if (!accessToken) return;

    setWithdrawing(applicationId);
    setError(null);
    try {
      await withdrawModeratorApplication(applicationId, accessToken);
      // Remove the withdrawn application from the list
      setApplications((prev) => prev.filter((app) => app.id !== applicationId));
      notifications.show({
        title: "Application Withdrawn",
        message: "Your moderator application has been successfully withdrawn.",
        color: "green",
        autoClose: 3000,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to withdraw application";
      setError(errorMessage);
      notifications.show({
        title: "Withdrawal Failed",
        message: errorMessage,
        color: "red",
        autoClose: 3000,
      });
    } finally {
      setWithdrawing(null);
    }
  };

  const handleApplicationSubmitted = () => {
    notifications.show({
      title: "Application Submitted",
      message: "Your moderator application has been successfully submitted.",
      color: "green",
      autoClose: 3000,
    });
    // Reload the moderator applications list
    loadModeratorData();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const menuItems = [
    { id: "account-status", label: "Account Status", icon: LightbulbIcon },
    { id: "followed-agendas", label: "Followed Agendas", icon: StarIcon },
    {
      id: "moderator-settings",
      label: "Moderator Settings",
      icon: FlagPennantIcon,
    },
    { id: "preferences", label: "Preferences", icon: GearSixIcon },
    { id: "terms-of-service", label: "Terms of Service", icon: FileTextIcon },
    { id: "privacy-policy", label: "Privacy Policy", icon: ShieldCheckIcon },

    { id: "feedback", label: "Feedback", icon: ChatTeardropIcon },
    { id: "language", label: "Language", icon: GlobeIcon },
    {
      id: "account-management",
      label: "Deactivate / Delete Account",
      icon: WarningCircleIcon,
    },
  ];

  const getSectionTitle = (sectionId: string | null) => {
    const item = menuItems.find((m) => m.id === sectionId);
    return item?.label || "";
  };

  return (
    <Stack gap={0} style={{ height: "100%" }}>
      {/* Always Visible: Personal Info Section */}
      {(user || authUser) && (
        <>
          <Stack p="lg" pb="md" gap="md">
            <Center>
              <Avatar
                size="xl"
                name={user?.full_name || authUser?.full_name}
                color="brand"
                variant="filled"
              />
            </Center>
            <Stack gap={0}>
              <Text ta="center" fw={600} size="sm">
                {user?.full_name || authUser?.full_name}
              </Text>
              <Text ta="center" size="xs" c="dimmed">
                {user?.email || authUser?.email}
              </Text>
            </Stack>
          </Stack>

          <Divider opacity={0.5} />
        </>
      )}

      {/* Main Content - Either Menu or Section Content */}
      {activeSection === null ? (
        // Menu View
        <Stack gap={0} py="xl">
          {menuItems.map((item, index) => (
            <div key={item.id}>
              <Button
                color="gray"
                variant="subtle"
                justify="space-between"
                fullWidth
                onClick={() => setActiveSection(item.id)}
                rightSection={<CaretRightIcon size={16} />}
                p="xs"
                h="auto"
                radius={0}
              >
                <Group gap="xs">
                  <item.icon weight="fill" size={16} />
                  <Text size="xs" fw={500}>
                    {item.label}
                  </Text>
                </Group>
              </Button>
              {item.id === "preferences" && <Divider opacity={0.3} />}
              {item.id === "language" && <Divider opacity={0.3} />}
            </div>
          ))}

          <Divider opacity={0.3} />
          <Button
            color="gray"
            variant="subtle"
            justify="flex-start"
            fullWidth
            onClick={handleLogout}
            p="xs"
            h="auto"
            radius={0}
          >
            <Group gap="xs">
              <DoorIcon weight="fill" size={16} />
              <Text size="xs" fw={500}>
                Logout
              </Text>
            </Group>
          </Button>
        </Stack>
      ) : (
        // Section Content View
        <Stack gap={0} style={{ flex: 1, overflow: "auto" }}>
          {/* Back Button and Title */}
          <Group
            justify="space-between"
            pr="lg"
            gap="md"
            align="center"
            bg="rgba(255,255,255,.1)"
          >
            <Button
              radius={0}
              variant="subtle"
              size="md"
              leftSection={<CaretLeftIcon size={16} />}
              onClick={() => setActiveSection(null)}
              c="dimmed"
            >
              Back
            </Button>
            <Text fw={600} size="xs">
              {getSectionTitle(activeSection)}
            </Text>
          </Group>

          {/* Section Content */}
          <Stack gap="lg">
            {activeSection === "account-status" && (
              <ProfanityTab
                trustScore={trustScore}
                penalties={penalties}
                canPostStatus={canPostStatus}
                contentCheckResult={contentCheckResult}
                checkContentText={checkContentText}
                loading={loading}
                checking={false}
                error={error}
                accessToken={accessToken}
                onCheckContentTextChange={setCheckContentText}
                onLoadProfanityData={loadProfanityData}
              />
            )}

            {activeSection === "followed-agendas" && (
              <Stack gap="md" p="lg">
                {followedAgendas.length === 0 ? (
                  <Center py="xl">
                    <Stack align="center" gap="sm">
                      <StarIcon size={32} weight="fill" />
                      <Text c="dimmed" ta="center" size="sm">
                        You have not followed any agendas yet.
                      </Text>
                      <Text c="dimmed" ta="center" size="xs">
                        Start following agendas from the explore section to track them here.
                      </Text>
                    </Stack>
                  </Center>
                ) : (
                  <Stack gap="md">
                    {followedAgendas.map((agenda: Agenda) => (
                      <Stack
                        key={agenda.id}
                        gap="xs"
                        p="md"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.05)",
                          borderRadius: "8px",
                        }}
                      >
                        <Text fw={600} size="sm">
                          {agenda.title}
                        </Text>
                        <Text size="xs" c="dimmed" lineClamp={2}>
                          {agenda.description}
                        </Text>
                        <Group justify="space-between" gap="xs">
                          <Text size="xs" c="dimmed">
                            {agenda.district?.name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {new Date(agenda.created_at).toLocaleDateString()}
                          </Text>
                        </Group>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Stack>
            )}

            {activeSection === "moderator-settings" && (
              <ModeratorTab
                applications={applications}
                loading={loading}
                error={error}
                withdrawing={withdrawing}
                onWithdrawApplication={handleWithdrawApplication}
                onLoadModeratorData={loadModeratorData}
                onOpenApplyModal={handleApplicationSubmitted}
              />
            )}

            {activeSection === "preferences" && <PreferencesTab />}

            {activeSection === "terms-of-service" && (
              <Stack gap="md">
                <Text c="dimmed">Terms of Service content coming soon</Text>
              </Stack>
            )}

            {activeSection === "privacy-policy" && (
              <Stack gap="md">
                <Text c="dimmed">Privacy Policy content coming soon</Text>
              </Stack>
            )}

            {activeSection === "account-management" && (
              <Stack gap="md">
                <Text c="dimmed">Account management options coming soon</Text>
              </Stack>
            )}

            {activeSection === "feedback" && (
              <Stack gap="md">
                <Text c="dimmed">Feedback form coming soon</Text>
              </Stack>
            )}

            {activeSection === "language" && (
              <Stack gap="md">
                <Text c="dimmed">Language settings coming soon</Text>
              </Stack>
            )}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
