"use client";

import { useChat } from "@/hooks/useChat";
import { useAgendaDetail } from "@/modules/app/agenda-profile/hooks";
import { useAccessToken, useIsAuthenticated, useUser } from "@/modules/auth";
import { ChatMessage as ApiChatMessage } from "@/modules/chat/chat.api";
import { useSelectedAgendaId } from "@/store/agenda-explore.store";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  TextInput,
} from "@mantine/core";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChatIcon,
  PaperclipIcon,
  PlusIcon,
  SmileyIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "@phosphor-icons/react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

interface AgendaDetails {
  district?: { name: string };
  title: string;
  description: string;
  status: string;
  message_count: number;
}

interface ChatRenderProps {
  threadId?: string;
  agendaDetails?: AgendaDetails;
}

interface UIMessage extends ApiChatMessage {
  isLocal?: boolean;
}

const SignInPrompt = memo(() => {
  return (
    <Flex direction="column" h="100%" align="center" justify="center" gap="md">
      <Stack gap="xs" align="center">
        <Text size="lg" fw={500}>
          Sign in to discuss
        </Text>
        <Text size="sm" c="dimmed" ta="center">
          Join the discussion and share your thoughts on this agenda
        </Text>
      </Stack>
    </Flex>
  );
});

interface ChatInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isSending: boolean;
  isOnCooldown: boolean;
  cooldownRemaining: number;
}

const ChatInput = memo(
  ({
    inputValue,
    onInputChange,
    onSendMessage,
    isSending,
    isOnCooldown,
    cooldownRemaining,
  }: ChatInputProps) => {
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onSendMessage();
        }
      },
      [onSendMessage]
    );

    return (
      <Box style={{ borderTop: "1px solid rgba(125,125,125,.1)" }}>
        <TextInput
          size="lg"
          variant="unstyled"
          placeholder={
            isOnCooldown ? `Wait ${cooldownRemaining}s...` : "Message here .."
          }
          value={inputValue}
          onChange={(e) => onInputChange(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending || isOnCooldown}
          leftSection={
            <ActionIcon variant="subtle" size="xs">
              <PlusIcon size={16} />
            </ActionIcon>
          }
          rightSection={
            <ActionIcon
              variant="subtle"
              onClick={onSendMessage}
              size="xs"
              disabled={isSending || isOnCooldown}
            >
              <SmileyIcon size={16} />
            </ActionIcon>
          }
        />
      </Box>
    );
  }
);

export function ChatRender({
  threadId: propThreadId,
  agendaDetails: propAgendaDetails,
}: ChatRenderProps) {
  const [activeTab, setActiveTab] = useState<string | null>("discussion");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const prevThreadIdRef = useRef<string | undefined>(undefined);
  const isUserAtBottomRef = useRef<boolean>(true);
  const prevMessageCountRef = useRef<number>(0);
  const prevScrollHeightRef = useRef<number>(0);

  const isAuthenticated = useIsAuthenticated();
  const user = useUser();
  const accessToken = useAccessToken();

  // Get agendaId from store
  const agendaId = useSelectedAgendaId();

  // Fetch agenda details if we have agendaId
  const { data: fetchedAgendaDetails, isLoading: isLoadingAgendaDetails } =
    useAgendaDetail(agendaId || "", Boolean(agendaId));

  // Use provided threadId/agendaDetails or fetch them
  const threadId = propThreadId || fetchedAgendaDetails?.chat_thread_id;
  const agendaDetails =
    propAgendaDetails ||
    (fetchedAgendaDetails
      ? {
          district: fetchedAgendaDetails.district,
          title: fetchedAgendaDetails.title,
          description: fetchedAgendaDetails.description,
          status: fetchedAgendaDetails.status,
          message_count: fetchedAgendaDetails.extension?.message_count || 0,
        }
      : undefined);

  const {
    messages,
    inputValue,
    setInputValue,
    isSending,
    error,
    setError,
    handleSendMessage,
    cooldownRemaining,
    isOnCooldown,
    loadPreviousMessages,
    hasMore,
    isLoadingMore,
    handleVote,
    votingMessageIds,
  } = useChat(
    threadId,
    isAuthenticated,
    accessToken,
    user?.id || undefined,
    user?.full_name || undefined
  );

  // Compute cooldown message
  const cooldownMessage = isOnCooldown
    ? `You can send a message in ${cooldownRemaining} seconds`
    : null;

  // Show cooldown message or error (prioritize cooldown)
  const displayError = cooldownMessage || error;

  // Scroll to bottom on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (viewportRef.current) {
        viewportRef.current.scrollTo({
          top: viewportRef.current.scrollHeight,
          behavior: "auto",
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Setup scroll tracking to detect if user is at bottom
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateButtonVisibility = () => {
      // Check if user is at the bottom (within 50px threshold)
      const scrollTop = viewport.scrollTop;
      const scrollHeight = viewport.scrollHeight;
      const clientHeight = viewport.clientHeight;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

      isUserAtBottomRef.current = isAtBottom;
      // Show button if user is not at bottom and there's enough content to scroll
      setShowScrollButton(!isAtBottom && scrollHeight > clientHeight);
    };

    const handleScroll = () => {
      updateButtonVisibility();
    };

    // Initial check
    updateButtonVisibility();

    viewport.addEventListener("scroll", handleScroll, { passive: true });

    // Also update on resize to ensure consistency
    const resizeObserver = new ResizeObserver(() => {
      updateButtonVisibility();
    });
    resizeObserver.observe(viewport);

    return () => {
      viewport.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  // Helper function to scroll to bottom
  const scrollToBottom = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: "smooth",
      });
      isUserAtBottomRef.current = true;
      // Hide button after scrolling to bottom
      setShowScrollButton(false);
    }
  };

  // Scroll to bottom when messages load (only on new chat entry)
  useEffect(() => {
    if (threadId && threadId !== prevThreadIdRef.current) {
      prevThreadIdRef.current = threadId;
      isUserAtBottomRef.current = true;
      // Delay scroll to ensure messages are rendered
      const timer = setTimeout(() => {
        if (viewportRef.current) {
          viewportRef.current.scrollTo({
            top: viewportRef.current.scrollHeight,
            behavior: "auto",
          });
          setShowScrollButton(false);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [threadId]);

  // Handle scroll when messages change (older messages loaded vs new messages)
  useEffect(() => {
    if (viewportRef.current && messages.length > 0) {
      const viewport = viewportRef.current;
      const currentScrollHeight = viewport.scrollHeight;
      const messageCountDifference =
        messages.length - prevMessageCountRef.current;

      // Only adjust scroll if message count actually changed
      if (messageCountDifference === 0) {
        return;
      }

      // If older messages were loaded (prepended to array), adjust scroll to maintain view
      if (messageCountDifference > 0 && prevScrollHeightRef.current > 0) {
        const scrollHeightDifference =
          currentScrollHeight - prevScrollHeightRef.current;
        viewport.scrollTop += scrollHeightDifference;
      }
      // If at bottom and new messages arrive, auto-scroll
      else if (messageCountDifference > 0 && isUserAtBottomRef.current) {
        viewport.scrollTop = viewport.scrollHeight;
      }

      prevMessageCountRef.current = messages.length;
      prevScrollHeightRef.current = currentScrollHeight;
    }
  }, [messages.length]);

  // Messages are already ordered with oldest first
  const discussionMessages =
    activeTab === "discussion"
      ? messages || []
      : (messages || []).filter((m) => m.is_solution);

  const isUserMessage = (msg: UIMessage) => msg.author.id === user?.id;

  if (!isAuthenticated) {
    return <SignInPrompt />;
  }

  return (
    <Flex direction="column" style={{ height: "100%" }} styles={{}}>
      {/* Tab Header */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List justify="center">
          {/* <Tabs.Tab value="agenda-details">
            <Text size="xs">Agenda Details</Text>
          </Tabs.Tab> */}
          <Tabs.Tab
            value="discussion"
            leftSection={<ChatIcon weight="duotone" />}
          >
            <Text size="xs">Discussion</Text>
          </Tabs.Tab>
          <Tabs.Tab
            value="pinned"
            leftSection={<PaperclipIcon weight="duotone" />}
          >
            <Text size="xs">Pinned Solutions</Text>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {/* Chat Messages Area */}
      <ScrollArea
        pos="relative"
        h={"calc(100vh - 200px)"}
        viewportRef={viewportRef}
      >
        {/* Error/Cooldown Alert */}
        {displayError && (
          <Box
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
            bg={
              isOnCooldown
                ? "var(--mantine-color-blue-9)"
                : "var(--mantine-color-red-9)"
            }
            p="sm"
          >
            <Text ta="center" size="xs" c={isOnCooldown ? "blue.0" : "red.0"}>
              {displayError}
            </Text>
          </Box>
        )}

        <Box p="md">
          <Stack gap="md">
            {activeTab === "discussion" && hasMore && (
              <Box style={{ textAlign: "center", marginBottom: "md" }}>
                <Button
                  radius={0}
                  fullWidth
                  color="gray"
                  variant="light"
                  size="xs"
                  onClick={loadPreviousMessages}
                  loading={isLoadingMore}
                  disabled={isLoadingMore}
                  rightSection={<ArrowUpIcon size={12} />}
                >
                  {isLoadingMore
                    ? "Loading older messages..."
                    : "Load Older Messages"}
                </Button>
              </Box>
            )}

            {activeTab === "agenda-details" && agendaDetails ? (
              // Agenda Details Tab - Mobile Only
              <Box hiddenFrom="lg">
                <Stack gap="lg">
                  {agendaDetails.district && (
                    <Text size="xs">
                      {agendaDetails.district.name} | Rastriya-Agenda
                    </Text>
                  )}
                  <Text size="2rem" fw={700}>
                    {agendaDetails.title}
                  </Text>

                  <Text size="xs" c="dimmed">
                    {agendaDetails.description}
                  </Text>

                  <Divider />

                  <Text size="xs" fw={500}>
                    Discussion Threads
                  </Text>

                  <Stack>
                    <SimpleGrid cols={3}>
                      <Text c="dimmed" size="xs">
                        Discussion
                      </Text>
                      <Text c="dimmed" size="xs">
                        Stage
                      </Text>
                      <Text c="dimmed" size="xs">
                        Stats
                      </Text>
                    </SimpleGrid>

                    <Paper bg="none">
                      <SimpleGrid cols={3}>
                        <Text size="xs">{agendaDetails.title}</Text>
                        <Text size="xs">{agendaDetails.status}</Text>
                        <Text size="xs">
                          {agendaDetails.message_count} messages
                        </Text>
                      </SimpleGrid>
                    </Paper>
                  </Stack>
                </Stack>
              </Box>
            ) : (
              <>
                {!discussionMessages || discussionMessages.length === 0 ? (
                  <Text size="xs" c="dimmed" ta="center">
                    {activeTab === "pinned"
                      ? "No pinned solutions yet."
                      : "No messages yet"}
                  </Text>
                ) : (
                  discussionMessages.map((msg) => (
                    <Box
                      key={msg.id}
                      style={{
                        display: "flex",
                        justifyContent: isUserMessage(msg)
                          ? "flex-end"
                          : "flex-start",
                      }}
                    >
                      <Box
                        p="sm"
                        style={{
                          maxWidth: "70%",
                          borderRadius: "8px",
                          opacity: msg.isLocal ? 0.7 : 1,
                        }}
                      >
                        <Group wrap="nowrap" align="flex-start" gap="xs">
                          {!isUserMessage(msg) && (
                            <Avatar
                              size="sm"
                              name={msg.author.full_name}
                              color="initials"
                            />
                          )}
                          <Stack gap={4}>
                            <Group
                              gap="xs"
                              justify={
                                isUserMessage(msg) ? "flex-end" : "flex-start"
                              }
                            >
                              <Text size="10px" fw={500} opacity={0.8}>
                                {isUserMessage(msg)
                                  ? "You"
                                  : msg.author.full_name}
                              </Text>

                              <Text c="orange.6" size="10px" fw={500}>
                                {`(Member)`}
                              </Text>

                              <Text size="10px" c="dimmed">
                                {new Date(msg.created_at).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </Text>
                            </Group>

                            <Text size="xs">{msg.message}</Text>

                            {!isUserMessage(msg) && (
                              <Group gap={0}>
                                <Button
                                  size="xs"
                                  h={24}
                                  px={6}
                                  leftSection={<ThumbsUpIcon />}
                                  variant={
                                    msg.user_vote === "upvote"
                                      ? "light"
                                      : "subtle"
                                  }
                                  color={
                                    msg.user_vote === "upvote"
                                      ? "blue"
                                      : undefined
                                  }
                                  onClick={() => handleVote(msg.id, "upvote")}
                                  loading={votingMessageIds.has(msg.id)}
                                  disabled={votingMessageIds.has(msg.id)}
                                >
                                  {msg.upvote_count}
                                </Button>
                                <Button
                                  h={24}
                                  px={6}
                                  size="xs"
                                  leftSection={<ThumbsDownIcon />}
                                  variant={
                                    msg.user_vote === "downvote"
                                      ? "light"
                                      : "subtle"
                                  }
                                  color={
                                    msg.user_vote === "downvote"
                                      ? "red"
                                      : undefined
                                  }
                                  onClick={() => handleVote(msg.id, "downvote")}
                                  loading={votingMessageIds.has(msg.id)}
                                  disabled={votingMessageIds.has(msg.id)}
                                >
                                  {msg.downvote_count}
                                </Button>
                              </Group>
                            )}
                          </Stack>

                          {isUserMessage(msg) && (
                            <Avatar
                              size="sm"
                              name={msg.author.full_name}
                              color="initials"
                            />
                          )}
                        </Group>
                      </Box>
                    </Box>
                  ))
                )}
              </>
            )}
            <div ref={scrollRef} />
          </Stack>
        </Box>
      </ScrollArea>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          size="xs"
          variant="light"
          color="blue"
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            zIndex: 10,
          }}
          leftSection={<ArrowDownIcon size={14} />}
        >
          Scroll to Now
        </Button>
      )}

      {/* Chat Input */}
      <ChatInput
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
        isSending={isSending}
        isOnCooldown={isOnCooldown}
        cooldownRemaining={cooldownRemaining}
      />
    </Flex>
  );
}

// Default export for convenience
export const AgendaChat = ChatRender;
