"use client";

import { configThemeMantine } from "@/config/theme";
import { MantineProvider } from "@mantine/core";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useTokenRefresh } from "@/hooks/useTokenRefresh";

const queryClient = new QueryClient();

function TokenRefreshListener() {
  useTokenRefresh();
  return null;
}

export function RootClient({ children }: PropsWithChildren) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <MantineProvider forceColorScheme="dark" theme={configThemeMantine} withStaticClasses>
        <TokenRefreshListener />
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MantineProvider>
    </GoogleOAuthProvider>
  );
}
