"use client";

import { usePathname } from "next/navigation";
import { Text, Tooltip } from "@mantine/core";

interface DistrictTextProps {
  districtName?: string;
  districtDescription?: string;
  size?: string;
  fw?: number;
  c?: string;
}

export function DistrictText({
  districtName = "DISTRICT",
  districtDescription = "District",
  size = "xs",
  fw = 800,
  c = "unset",
}: DistrictTextProps) {
  const pathname = usePathname();
  const isExplorePage = pathname === "/explore";

  const textElement = (
    <Text size={size} fw={fw} c={c}>
      {districtName}
    </Text>
  );

  // Only show tooltip on explore page
  if (isExplorePage) {
    return (
      <Tooltip
        label={districtDescription}
        style={{
          fontSize: "var(--mantine-font-size-xs)",
          fontWeight: 600,
        }}
      >
        {textElement}
      </Tooltip>
    );
  }

  return textElement;
}
