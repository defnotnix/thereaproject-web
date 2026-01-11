import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchMessages,
  syncMessages,
  sendMessage,
  castVote,
  ChatMessage as ApiChatMessage,
  SyncMessagesResponse,
} from "@/modules/chat/chat.api";

const SYNC_INTERVAL = 30000; // 30 seconds between syncs
const COOLDOWN_DURATION = 15000; // 15 seconds
const COOLDOWN_STORAGE_KEY = "chat-last-message-timestamp";

interface UIMessage extends ApiChatMessage {
  isLocal?: boolean;
}

interface UseChatReturn {
  messages: UIMessage[];
  inputValue: string;
  setInputValue: (value: string) => void;
  isSending: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  handleSendMessage: () => void;
  cooldownRemaining: number;
  isOnCooldown: boolean;
  loadPreviousMessages: () => Promise<void>;
  hasMore: boolean;
  isLoadingMore: boolean;
  handleVote: (messageId: string, voteType: "upvote" | "downvote") => Promise<void>;
  votingMessageIds: Set<string>;
}

export function useChat(
  threadId: string | undefined,
  isAuthenticated: boolean,
  accessToken: string | null | undefined,
  userId: string | undefined,
  userName: string | undefined
): UseChatReturn {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [votingMessageIds, setVotingMessageIds] = useState<Set<string>>(new Set());

  // Refs to prevent duplicate API calls and manage polling
  const isSyncingRef = useRef(false);
  const lastSyncTimeRef = useRef<string | null>(null);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentPageRef = useRef<number>(1);

  // Helper to calculate remaining cooldown in seconds
  const calculateCooldownRemaining = useCallback((): number => {
    if (typeof window === "undefined") return 0;

    const lastTimestampStr = localStorage.getItem(COOLDOWN_STORAGE_KEY);
    if (!lastTimestampStr) return 0;

    const lastTimestamp = parseInt(lastTimestampStr, 10);
    const elapsed = Date.now() - lastTimestamp;
    const remaining = Math.max(0, COOLDOWN_DURATION - elapsed);

    return Math.ceil(remaining / 1000); // Convert to seconds
  }, []);

  // Helper to merge messages: deduplicate and maintain order
  const mergeMessagesHelper = (
    prev: UIMessage[] | undefined,
    newMessages: ApiChatMessage[]
  ): UIMessage[] => {
    // Ensure prev is an array
    const prevMessages = prev || [];

    const existingIds = new Set(prevMessages.map((m) => m.id));
    const uniqueNewMessages = newMessages.filter((m) => !existingIds.has(m.id));

    // If no new messages, return previous state to avoid re-renders
    if (uniqueNewMessages.length === 0) {
      return prevMessages;
    }

    const localMessages = prevMessages.filter((m) => m.isLocal);
    const confirmedMessages = prevMessages.filter(
      (m) => !m.isLocal && existingIds.has(m.id)
    );

    // Append new messages at end (since messages are stored oldest-first)
    return [...confirmedMessages, ...uniqueNewMessages, ...localMessages];
  };

  // Sync messages with server (for new messages)
  const performSync = useCallback(
    (syncTimestamp: string | null = null) => {
      if (isSyncingRef.current || !threadId) {
        return;
      }

      isSyncingRef.current = true;

      syncMessages(threadId, syncTimestamp || undefined)
        .then((response) => {
          setMessages((prev) => mergeMessagesHelper(prev, response.messages));
          lastSyncTimeRef.current = response.sync_timestamp;
          setError(null);
        })
        .catch(() => {
          setError("Failed to load messages. Please try again.");
        })
        .finally(() => {
          isSyncingRef.current = false;
        });
    },
    [threadId]
  );

  // Load older messages (pagination for scroll-up)
  const loadPreviousMessages = useCallback(async () => {
    if (!threadId || isLoadingMore || !hasMore) {
      return;
    }

    setIsLoadingMore(true);
    try {
      // Load the next page (increment page number)
      const nextPage = currentPageRef.current + 1;

      const response = await fetchMessages(
        threadId,
        50,
        "-created_at", // Descending order (API returns newest first on each page)
        nextPage
      );

      setMessages((prev) => {
        // Prepend older messages to the beginning (reverse and prepend)
        const existingIds = new Set(prev.map((m) => m.id));
        const uniqueOldMessages = response.messages.filter(
          (m) => !existingIds.has(m.id)
        );
        return [...uniqueOldMessages.reverse(), ...prev];
      });

      // Update page reference for next load
      currentPageRef.current = nextPage;
      setHasMore(response.has_more);
    } catch {
      setError("Failed to load older messages. Please try again.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [threadId, hasMore, isLoadingMore]);

  // Setup polling on mount
  useEffect(() => {
    if (!threadId || !isAuthenticated || !accessToken) {
      // Reset state when no threadId
      setMessages([]);
      setHasMore(true);
      setError(null);
      return;
    }

    let intervalId: NodeJS.Timeout | null = null;

    // Reset state for new threadId
    setMessages([]);
    setHasMore(true);
    currentPageRef.current = 1;
    lastSyncTimeRef.current = null;

    // Initial fetch - get first batch of messages
    const initialFetch = async () => {
      try {
        const response = await fetchMessages(threadId, 50, "-created_at");
        setMessages(response.messages.reverse());
        setHasMore(response.has_more);
        lastSyncTimeRef.current = response.sync_timestamp;

        // After initial load, setup polling for new messages
        intervalId = setInterval(() => {
          performSync(lastSyncTimeRef.current);
        }, SYNC_INTERVAL);
      } catch {
        setError("Failed to load messages. Please try again.");
      }
    };

    initialFetch();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [threadId, isAuthenticated, accessToken, performSync]);

  // Initialize and manage cooldown countdown
  useEffect(() => {
    const remaining = calculateCooldownRemaining();
    setCooldownRemaining(remaining);

    if (remaining > 0) {
      cooldownTimerRef.current = setInterval(() => {
        const newRemaining = calculateCooldownRemaining();
        setCooldownRemaining(newRemaining);

        if (newRemaining === 0 && cooldownTimerRef.current) {
          clearInterval(cooldownTimerRef.current);
          cooldownTimerRef.current = null;
          setError(null);
        }
      }, 1000);
    }

    return () => {
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
      }
    };
  }, [calculateCooldownRemaining]);

  const handleSendMessage = useCallback(() => {
    // Check cooldown FIRST
    const cooldown = calculateCooldownRemaining();
    if (cooldown > 0) {
      setError(`You can send a message in ${cooldown} seconds`);
      return;
    }

    if (
      !inputValue.trim() ||
      !threadId ||
      !isAuthenticated ||
      isSending ||
      !userId ||
      !userName
    ) {
      return;
    }

    const messageText = inputValue;
    setInputValue("");

    // Add optimistic message with a pending flag
    const optimisticMessage: UIMessage = {
      id: `temp-${Date.now()}`,
      thread: threadId,
      author: {
        id: userId,
        full_name: userName,
      },
      message: messageText,
      is_solution: false,
      upvote_count: 0,
      downvote_count: 0,
      total_votes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isLocal: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setIsSending(true);
    setError(null);

    sendMessage(threadId, messageText)
      .then(() => {
        // SUCCESS: Set cooldown timestamp
        if (typeof window !== "undefined") {
          localStorage.setItem(COOLDOWN_STORAGE_KEY, Date.now().toString());
        }

        // Start cooldown countdown
        setCooldownRemaining(COOLDOWN_DURATION / 1000); // 15 seconds

        if (cooldownTimerRef.current) {
          clearInterval(cooldownTimerRef.current);
        }

        cooldownTimerRef.current = setInterval(() => {
          const newRemaining = calculateCooldownRemaining();
          setCooldownRemaining(newRemaining);

          if (newRemaining === 0 && cooldownTimerRef.current) {
            clearInterval(cooldownTimerRef.current);
            cooldownTimerRef.current = null;
          }
        }, 1000);

        // Remove optimistic message - it will be fetched in the next sync
        setMessages((prev) =>
          prev.filter((m) => m.id !== optimisticMessage.id)
        );
        // Force immediate sync to get the confirmed message from server
        performSync(lastSyncTimeRef.current);
      })
      .catch(() => {
        setError("Failed to send message. Please try again.");
        // Remove optimistic message on error
        setMessages((prev) =>
          prev.filter((m) => m.id !== optimisticMessage.id)
        );
        setInputValue(messageText); // Restore input
      })
      .finally(() => {
        setIsSending(false);
      });
  }, [
    inputValue,
    threadId,
    isAuthenticated,
    isSending,
    userId,
    userName,
    performSync,
    calculateCooldownRemaining,
  ]);

  // Handle upvote/downvote on messages
  const handleVote = useCallback(
    async (messageId: string, voteType: "upvote" | "downvote") => {
      if (!isAuthenticated) {
        setError("Please sign in to vote");
        return;
      }

      // Prevent duplicate votes
      if (votingMessageIds.has(messageId)) {
        return;
      }

      // Add to voting set
      setVotingMessageIds((prev) => new Set(prev).add(messageId));

      try {
        const updatedMessage = await castVote(messageId, voteType);

        // Update the message with the new vote counts and user's vote status
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  upvote_count: updatedMessage.upvote_count,
                  downvote_count: updatedMessage.downvote_count,
                  user_vote: updatedMessage.user_vote,
                }
              : msg
          )
        );
      } catch {
        setError("Failed to vote. Please try again.");
      } finally {
        // Remove from voting set
        setVotingMessageIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(messageId);
          return newSet;
        });
      }
    },
    [isAuthenticated]
  );

  return {
    messages,
    inputValue,
    setInputValue,
    isSending,
    error,
    setError,
    handleSendMessage,
    cooldownRemaining,
    isOnCooldown: cooldownRemaining > 0,
    loadPreviousMessages,
    hasMore,
    isLoadingMore,
    handleVote,
    votingMessageIds,
  };
}
