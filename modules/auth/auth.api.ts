import { axiosInstance } from "@/lib/axios";

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    full_name: string;
    phone_number?: string;
    is_active: boolean;
    is_verified: boolean;
    profile_completed?: boolean;
  };
  access: string;
  refresh: string;
}

export interface SignUpResponse {
  user: {
    id: string;
    email: string;
    full_name: string;
    phone_number?: string;
    district?: string;
    profession?: string;
    is_active: boolean;
    is_verified: boolean;
    profile_completed?: boolean;
  };
  access: string;
  refresh: string;
}

export interface SignUpPayload {
  username: string;
  email: string;
  full_name: string;
  password1: string;
  password2: string;
  phone_number: string;
  district: string; // Must be a valid UUID
  profession: string;
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await axiosInstance.post<LoginResponse>("/api/auth/login/", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as any).response?.data?.message || "Login failed. Please try again."
      );
    }
    throw error;
  }
}

export async function signUpUser(payload: SignUpPayload): Promise<SignUpResponse> {
  try {
    const response = await axiosInstance.post<SignUpResponse>(
      "/api/auth/registration/",
      payload
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as any).response?.data?.message || "Sign up failed. Please try again."
      );
    }
    throw error;
  }
}

export async function logoutUser(accessToken: string): Promise<void> {
  try {
    await axiosInstance.post(
      "/api/auth/logout/",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error) {
    // Silent error handling for logout
  }
}

export async function verifyToken(accessToken: string): Promise<boolean> {
  try {
    const response = await axiosInstance.get("/api/auth/verify/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

export interface RefreshTokenResponse {
  access: string;
  refresh: string;
}

export async function refreshTokens(refreshToken: string): Promise<RefreshTokenResponse> {
  try {
    const response = await axiosInstance.post<RefreshTokenResponse>(
      "/api/auth/token/refresh/",
      {
        refresh: refreshToken,
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as any).response?.data?.message || "Token refresh failed. Please log in again."
      );
    }
    throw error;
  }
}

export interface GoogleAuthPayload {
  access_token: string;
}

export async function googleSignInUser(payload: GoogleAuthPayload): Promise<LoginResponse> {
  try {
    const response = await axiosInstance.post<LoginResponse>(
      "/api/auth/google/",
      payload
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as any).response?.data?.message || "Google sign in failed. Please try again."
      );
    }
    throw error;
  }
}

export async function googleSignUpUser(payload: GoogleAuthPayload): Promise<SignUpResponse> {
  try {
    const response = await axiosInstance.post<SignUpResponse>(
      "/api/auth/google/registration/",
      payload
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as any).response?.data?.message || "Google sign up failed. Please try again."
      );
    }
    throw error;
  }
}

export interface OTPResponse {
  success: boolean;
  message: string;
  access?: string;
  refresh?: string;
}

export async function requestOTP(identifier: string): Promise<OTPResponse> {
  try {
    const response = await axiosInstance.post<OTPResponse>("/api/auth/otp/request/", {
      identifier,
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as any).response?.data?.message || "Failed to request OTP. Please try again."
      );
    }
    throw error;
  }
}

export async function verifyOTP(identifier: string, otp: string): Promise<OTPResponse> {
  try {
    const response = await axiosInstance.post<OTPResponse>("/api/auth/otp/verify/", {
      identifier,
      otp,
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as any).response?.data?.message || "OTP verification failed. Please try again."
      );
    }
    throw error;
  }
}

export async function resendOTP(identifier: string): Promise<OTPResponse> {
  try {
    const response = await axiosInstance.post<OTPResponse>("/api/auth/otp/resend/", {
      identifier,
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as any).response?.data?.message || "Failed to resend OTP. Please try again."
      );
    }
    throw error;
  }
}

export interface CompleteProfilePayload {
  phone_number: string;
  district: string;
  profession?: string;
}

export interface CompleteProfileResponse {
  user: {
    id: string;
    email: string;
    full_name: string;
    phone_number: string;
    district: string;
    profession?: string;
    profile_completed: boolean;
  };
}

export async function completeProfile(
  payload: CompleteProfilePayload,
  accessToken: string
): Promise<CompleteProfileResponse> {
  try {
    const response = await axiosInstance.post<CompleteProfileResponse>(
      "/api/users/complete_profile/",
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as any).response?.data?.message || "Failed to complete profile. Please try again."
      );
    }
    throw error;
  }
}

export interface CurrentUserResponse {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  district?: {
    id: string;
    name: string;
    code: string;
  };
  profile_completed: boolean;
  is_verified: boolean;
  role: string;
  auth_provider: string;
  created_at: string;
}

export async function getCurrentUser(accessToken: string): Promise<CurrentUserResponse> {
  try {
    const response = await axiosInstance.get<CurrentUserResponse>(
      "/api/users/me/",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as any).response?.data?.message || "Failed to fetch user details. Please try again."
      );
    }
    throw error;
  }
}
