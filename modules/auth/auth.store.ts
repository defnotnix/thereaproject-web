"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { loginUser, logoutUser, signUpUser, googleSignInUser, googleSignUpUser, requestOTP as requestOTPAPI, verifyOTP as verifyOTPAPI, resendOTP as resendOTPAPI, completeProfile as completeProfileAPI, type LoginResponse, type SignUpResponse, type SignUpPayload, type CompleteProfilePayload } from "./auth.api";

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  district?: string;
  profession?: string;
  is_active: boolean;
  is_verified: boolean;
  profile_completed?: boolean;
}

export interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isHydrated: boolean;

  // Actions
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  login: (email: string, password: string) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<void>;
  googleSignIn: (token: string) => Promise<void>;
  googleSignUp: (token: string) => Promise<void>;
  completeProfile: (payload: CompleteProfilePayload) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  reset: () => void;

  // OTP Actions
  requestOTP: (identifier: string) => Promise<void>;
  verifyOTP: (identifier: string, otp: string) => Promise<void>;
  resendOTP: (identifier: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        isHydrated: false,

        // Set user
        setUser: (user) =>
          set({
            user,
            isAuthenticated: true,
            error: null,
          }),

        // Set tokens
        setTokens: (accessToken, refreshToken) =>
          set({
            accessToken,
            refreshToken,
            error: null,
          }),

        // Set loading
        setLoading: (loading) => set({ loading }),

        // Set error
        setError: (error) => set({ error }),

        // Clear error
        clearError: () => set({ error: null }),

        // Login
        login: async (email, password) => {
          set({ loading: true, error: null });
          try {
            const response: LoginResponse = await loginUser(email, password);
            // Store tokens in sessionStorage
            if (typeof window !== "undefined") {
              sessionStorage.setItem("rea_access", response.access);
              sessionStorage.setItem("rea_refresh", response.refresh);
            }
            set({
              user: {
                id: response.user.id,
                email: response.user.email,
                full_name: response.user.full_name,
                phone_number: response.user.phone_number,
                is_active: response.user.is_active,
                is_verified: response.user.is_verified,
              },
              accessToken: response.access,
              refreshToken: response.refresh,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Login failed",
              loading: false,
            });
            throw error;
          }
        },

        // Sign Up
        signUp: async (payload) => {
          set({ loading: true, error: null });
          try {
            const response: SignUpResponse = await signUpUser(payload);
            // Store tokens in sessionStorage
            if (typeof window !== "undefined") {
              sessionStorage.setItem("rea_access", response.access);
              sessionStorage.setItem("rea_refresh", response.refresh);
            }
            set({
              user: {
                id: response.user.id,
                email: response.user.email,
                full_name: response.user.full_name,
                phone_number: response.user.phone_number,
                district: response.user.district,
                profession: response.user.profession,
                is_active: response.user.is_active,
                is_verified: response.user.is_verified,
              },
              accessToken: response.access,
              refreshToken: response.refresh,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Sign up failed",
              loading: false,
            });
            throw error;
          }
        },

        // Google Sign In
        googleSignIn: async (token) => {
          set({ loading: true, error: null });
          try {
            const response: LoginResponse = await googleSignInUser({ access_token: token });
            // Store tokens in sessionStorage
            if (typeof window !== "undefined") {
              sessionStorage.setItem("rea_access", response.access);
              sessionStorage.setItem("rea_refresh", response.refresh);
            }
            set({
              user: {
                id: response.user.id,
                email: response.user.email,
                full_name: response.user.full_name,
                phone_number: response.user.phone_number,
                is_active: response.user.is_active,
                is_verified: response.user.is_verified,
                profile_completed: response.user.profile_completed,
              },
              accessToken: response.access,
              refreshToken: response.refresh,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Google sign in failed",
              loading: false,
            });
            throw error;
          }
        },

        // Google Sign Up
        googleSignUp: async (token) => {
          set({ loading: true, error: null });
          try {
            const response: SignUpResponse = await googleSignUpUser({ access_token: token });
            // Store tokens in sessionStorage
            if (typeof window !== "undefined") {
              sessionStorage.setItem("rea_access", response.access);
              sessionStorage.setItem("rea_refresh", response.refresh);
            }
            set({
              user: {
                id: response.user.id,
                email: response.user.email,
                full_name: response.user.full_name,
                phone_number: response.user.phone_number,
                district: response.user.district,
                profession: response.user.profession,
                is_active: response.user.is_active,
                is_verified: response.user.is_verified,
                profile_completed: response.user.profile_completed,
              },
              accessToken: response.access,
              refreshToken: response.refresh,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Google sign up failed",
              loading: false,
            });
            throw error;
          }
        },

        // Request OTP
        requestOTP: async (identifier) => {
          set({ loading: true, error: null });
          try {
            await requestOTPAPI(identifier);
            set({ loading: false, error: null });
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to request OTP",
              loading: false,
            });
            throw error;
          }
        },

        // Verify OTP
        verifyOTP: async (identifier, otp) => {
          set({ loading: true, error: null });
          try {
            const response = await verifyOTPAPI(identifier, otp);
            // If backend returns tokens, store them
            if (response.access && response.refresh) {
              if (typeof window !== "undefined") {
                sessionStorage.setItem("rea_access", response.access);
                sessionStorage.setItem("rea_refresh", response.refresh);
              }
              // Note: User data should be fetched from backend after verification
              set({
                accessToken: response.access,
                refreshToken: response.refresh,
                loading: false,
                error: null,
              });
            } else {
              set({ loading: false, error: null });
            }
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "OTP verification failed",
              loading: false,
            });
            throw error;
          }
        },

        // Resend OTP
        resendOTP: async (identifier) => {
          set({ loading: true, error: null });
          try {
            await resendOTPAPI(identifier);
            set({ loading: false, error: null });
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to resend OTP",
              loading: false,
            });
            throw error;
          }
        },

        // Complete Profile
        completeProfile: async (payload) => {
          set({ loading: true, error: null });
          const state = get();
          if (!state.accessToken) {
            throw new Error("No access token available");
          }
          try {
            const response = await completeProfileAPI(payload, state.accessToken);
            // Handle both response formats: { user: {...} } and {...}
            const userData = response.user || response;

            set({
              user: state.user
                ? {
                    ...state.user,
                    phone_number: userData.phone_number,
                    district: userData.district,
                    profession: userData.profession,
                    profile_completed: userData.profile_completed,
                  }
                : null,
              loading: false,
              error: null,
            });
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to complete profile",
              loading: false,
            });
            throw error;
          }
        },

        // Logout
        logout: () => {
          const accessToken = get().accessToken;
          if (accessToken) {
            logoutUser(accessToken); // Fire and forget
          }
          // Clear tokens from sessionStorage
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("rea_access");
            sessionStorage.removeItem("rea_refresh");
          }
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            loading: false,
            error: null,
            isHydrated: true,
          });
        },

        // Reset
        reset: () =>
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            loading: false,
            error: null,
            isHydrated: true,
          }),
      }),
      {
        name: "auth-store", // localStorage key
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.isHydrated = true;
          }
        },
      }
    ),
    { name: "AuthStore" }
  )
);

// Selectors
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.loading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useRefreshToken = () => useAuthStore((state) => state.refreshToken);
export const useIsHydrated = () => useAuthStore((state) => state.isHydrated);
