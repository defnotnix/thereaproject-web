"use client";

import { Stack, Alert } from "@mantine/core";
import { WarningIcon } from "@phosphor-icons/react";

export function PreferencesTab() {
  return (
    <Stack gap="lg">
      <Alert icon={<WarningIcon />} color="blue">
        Preferences content coming soon
      </Alert>
    </Stack>
  );
}
