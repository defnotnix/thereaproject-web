import { useEffect } from "react";
import { notifications } from "@mantine/notifications";

/**
 * Hook to handle token refresh and expiry events
 * - Proactively refreshes tokens before they expire
 * - Listens for auth:token-expired event and shows notification
 */
export function useTokenRefresh() {
  // Listen for token expiry events
  useEffect(() => {
    const handleTokenExpired = (event: Event) => {
      const customEvent = event as CustomEvent;
      const message =
        customEvent.detail?.message ||
        "Your session has expired. Please log in again.";

      // Show notification
      notifications.show({
        title: "Session Expired",
        message,
        color: "red",
        autoClose: false,
      });
    };

    window.addEventListener("auth:token-expired", handleTokenExpired);

    return () => {
      window.removeEventListener("auth:token-expired", handleTokenExpired);
    };
  }, []);

  // Proactively refresh token before it expires
  useEffect(() => {
    const refreshTokenProactively = async () => {
      try {
        const refreshToken = sessionStorage.getItem("rea_refresh");
        const accessToken = sessionStorage.getItem("rea_access");

        // Only refresh if we have a refresh token and access token exists
        if (!refreshToken || !accessToken) {
          return;
        }

        const { axiosInstance } = await import("@/lib/axios");

        // Attempt to refresh the token
        const response = await axiosInstance.post<{
          access: string;
          refresh: string;
        }>("/api/auth/token/refresh/", {
          refresh: refreshToken,
        });

        if (response.data) {
          const { access: newAccessToken, refresh: newRefreshToken } =
            response.data;

          // Update tokens in storage
          sessionStorage.setItem("rea_access", newAccessToken);
          sessionStorage.setItem("rea_refresh", newRefreshToken);

          // Update auth store
          const { useAuthStore } = await import("@/modules/auth");
          useAuthStore.setState({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
        }
      } catch (error) {
        // If refresh fails, the axios interceptor will handle it on next request
        console.error("Proactive token refresh failed:", error);
      }
    };

    // Refresh token every 4 minutes (240000ms)
    // Most JWT tokens expire after 5 minutes, so this ensures we refresh before expiry
    const intervalId = setInterval(() => {
      refreshTokenProactively();
    }, 240000);

    // Also try to refresh immediately on mount if we have tokens
    refreshTokenProactively();

    return () => {
      clearInterval(intervalId);
    };
  }, []);
}
