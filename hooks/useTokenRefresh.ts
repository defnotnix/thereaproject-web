import { useEffect } from "react";
import { notifications } from "@mantine/notifications";

/**
 * Hook to handle token expiry events
 * Listens for auth:token-expired event and shows notification
 */
export function useTokenRefresh() {
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
}
