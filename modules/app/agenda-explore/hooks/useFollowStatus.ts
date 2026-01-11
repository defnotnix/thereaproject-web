import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import followAPI, { NotificationPreferences } from "../follow.api";
import { useIsAuthenticated } from "@/modules/auth/auth.store";

/**
 * Hook to fetch current follow status and preferences
 * Automatically disabled when user is not authenticated
 */
export function useFollowStatus(agendaId: string | null) {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: ["follow-status", agendaId],
    queryFn: () => followAPI.getFollowStatus(agendaId!),
    enabled: Boolean(agendaId) && isAuthenticated,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to toggle follow status
 * Returns mutations for following/unfollowing
 */
export function useToggleFollow(agendaId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => followAPI.toggleFollow(agendaId!),
    onSuccess: () => {
      // Invalidate follow status query to refetch
      queryClient.invalidateQueries({
        queryKey: ["follow-status", agendaId],
      });
    },
  });
}

/**
 * Hook to update notification preferences
 */
export function useUpdatePreferences(agendaId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: Partial<NotificationPreferences>) =>
      followAPI.updatePreferences(agendaId!, preferences),
    onSuccess: () => {
      // Invalidate follow status query to refetch updated preferences
      queryClient.invalidateQueries({
        queryKey: ["follow-status", agendaId],
      });
    },
  });
}
