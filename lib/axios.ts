import axios, { AxiosError } from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// List of public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  "/api/districts/",
  "/api/auth/login/",
  "/api/auth/registration/",
  "/api/auth/google/",
  "/api/auth/google/registration/",
  "/api/auth/otp/",
  "/api/auth/token/refresh/",
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
  const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) =>
    config.url?.startsWith(endpoint)
  );

  if (!isPublicEndpoint) {
    const token = sessionStorage.getItem("rea_access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
          handleTokenExpiry();
          return Promise.reject(error);
        }

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

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
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
