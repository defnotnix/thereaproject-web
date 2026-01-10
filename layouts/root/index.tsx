"use client";

import { configThemeMantine } from "@/config/theme";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//hooks
import { useTokenRefresh } from "@/hooks/useTokenRefresh";
//mantine-styles
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";

import "@/public/styles/global.css";

const queryClient = new QueryClient();

function TokenRefreshListener() {
  useTokenRefresh();
  return null;
}

export function LayoutRoot({ children }: PropsWithChildren) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Rastra Ekikaran Abhiyan</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Stack+Sans+Headline:wght@200..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <MantineProvider forceColorScheme="dark" theme={configThemeMantine}>
          <TokenRefreshListener />
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
