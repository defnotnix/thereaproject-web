import { configThemeMantine } from "@/config/theme";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { PropsWithChildren } from "react";
//mantine-styles
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";

import "@/public/styles/global.css";
import { RootClient } from "./root.client";

export function LayoutRoot({ children }: PropsWithChildren) {
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
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <RootClient>{children}</RootClient>
      </body>
    </html>
  );
}
