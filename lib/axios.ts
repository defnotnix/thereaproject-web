import axios, { AxiosError } from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// List of public endpoints that don't require authentication
// These are generally list/detail endpoints that are readable without auth
const PUBLIC_ENDPOINTS = [
  "/api/districts/",
  "/api/threads/",  // Note: Reading threads is public, but replying requires auth
  "/api/auth/login/",
  "/api/auth/registration/",
  "/api/auth/google/",
  "/api/auth/google/registration/",
  "/api/auth/otp/",
  "/api/auth/token/refresh/",
];

// Protected endpoints that require authentication (higher priority than PUBLIC_ENDPOINTS)
// These are operations like POST, PATCH, DELETE, or reading protected data
const PROTECTED_ENDPOINTS = [
  "/api/messages/",
  "/api/messages/sync/",
  "/api/agendas/",  // Agenda follow/unfollow, voting, and other mutations
  "/api/moderators/",  // Moderator applications and management
  "/api/moderation/",  // Moderation features (trust score, penalties, etc)
  "/api/users/",  // User profile and settings
];

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  isRefreshing = false;
  failedQueue = [];
};

// Add request interceptor to automatically attach auth token to protected endpoints
axiosInstance.interceptors.request.use((config) => {
  // Check if it's a public endpoint FIRST (and don't attach token)
  const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) =>
    config.url?.startsWith(endpoint)
  );

  if (isPublicEndpoint) {
    return config;
  }

  // Check if it's a protected endpoint
  const isProtectedEndpoint = PROTECTED_ENDPOINTS.some((endpoint) =>
    config.url?.startsWith(endpoint)
  );

  // Attach token if it's a protected endpoint OR not a public endpoint
  const requiresAuth = isProtectedEndpoint || !isPublicEndpoint;

  if (requiresAuth) {
    const token = sessionStorage.getItem("rea_access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Debug log
      if (typeof window !== "undefined") {
        console.log(`[Axios] Attached token to ${config.url}: ${token.substring(0, 20)}...`);
      }
    } else {
      console.warn(`[Axios] No token found for protected endpoint: ${config.url}`);
    }
  }

  return config;
});

// Add response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Don't retry if it's a refresh token request
    if (originalRequest?.url?.includes("/api/auth/token/refresh/")) {
      // Refresh failed, logout user
      handleTokenExpiry();
      return Promise.reject(error);
    }

    // Retry only on 401 unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = sessionStorage.getItem("rea_refresh");
        if (!refreshToken) {
          console.error("[Axios] No refresh token available");
          handleTokenExpiry();
          return Promise.reject(error);
        }

        console.log("[Axios] Attempting to refresh token...");
        const response = await axiosInstance.post<{
          access: string;
          refresh: string;
        }>("/api/auth/token/refresh/", {
          refresh: refreshToken,
        });

        const { access: newAccessToken, refresh: newRefreshToken } =
          response.data;

        // Update tokens in storage and auth store
        sessionStorage.setItem("rea_access", newAccessToken);
        sessionStorage.setItem("rea_refresh", newRefreshToken);

        // Update auth store
        const { useAuthStore } = await import("@/modules/auth");
        useAuthStore.setState({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });

        console.log("[Axios] Token refreshed successfully");
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("[Axios] Token refresh failed:", refreshError);
        processQueue(refreshError as AxiosError, null);
        handleTokenExpiry();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Handle token expiry
function handleTokenExpiry() {
  const { useAuthStore } = require("@/modules/auth");

  // Clear tokens
  sessionStorage.removeItem("rea_access");
  sessionStorage.removeItem("rea_refresh");

  // Logout user
  useAuthStore.getState().logout();

  // Show toast notification
  if (typeof window !== "undefined") {
    // Dispatch custom event for logout notification
    window.dispatchEvent(
      new CustomEvent("auth:token-expired", {
        detail: { message: "Your session has expired. Please log in again." },
      })
    );
  }
}
