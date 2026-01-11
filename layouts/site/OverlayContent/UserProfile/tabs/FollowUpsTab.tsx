"use client";

import { Stack, Alert } from "@mantine/core";
import { WarningIcon } from "@phosphor-icons/react";

export function FollowUpsTab() {
  return (
    <Stack gap="lg">
      <Alert icon={<WarningIcon />} color="blue">
        Follow-up content coming soon
      </Alert>
    </Stack>
  );
}
