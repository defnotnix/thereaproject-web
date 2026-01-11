import { useState } from "react";
import classes from "./map.module.css";
import { districts } from "./map.districts";

import { Center, Container, Text } from "@mantine/core";
import { useDistricts } from "@/store/site.store";

interface DynamicMapProps {
  activeDistrict?: number | null;
  onDistrictSelect?: (districtId: number | null) => void;
  siteState?: "default" | "initial";
}

export function MapRender({
  activeDistrict = null,
  onDistrictSelect = () => {},
  siteState = "default",
}: DynamicMapProps) {
  const districtsData = useDistricts();
  const apiDistricts = districtsData?.results || [];
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [activeSvgDistrictCode, setActiveSvgDistrictCode] = useState<string | null>(null);

  const getDistrictName = (districtCode: string | undefined) => {
    return districts.find((d) => d.code === districtCode)?.name || "";
  };

  // Map SVG district ID to API district ID by matching names
  const mapSvgDistrictToApiId = (
    svgDistrictName: string | undefined
  ): number | null => {
    if (!svgDistrictName) return null;

    // Find matching API district by name (case-insensitive, trimmed)
    const normalizedSvgName = svgDistrictName.toLowerCase().trim();
    const matchedApiDistrict = apiDistricts.find(
      (d) => {
        const normalizedApiName = d.name.toLowerCase().trim();
        return normalizedApiName === normalizedSvgName;
      }
    );

    if (!matchedApiDistrict) {
      console.warn(`No API district found for SVG name: "${svgDistrictName}"`);
      console.warn("Available API districts:", apiDistricts.map(d => ({ id: d.id, name: d.name })));
    }

    if (!matchedApiDistrict?.id) return null;

    // Convert to number if string
    return typeof matchedApiDistrict.id === 'string'
      ? parseInt(matchedApiDistrict.id)
      : matchedApiDistrict.id;
  };

  // Find SVG district code by API district ID
  const getSvgDistrictCodeByApiId = (
    apiDistrictId: number | null
  ): string | undefined => {
    if (!apiDistrictId) return undefined;

    // Match district ID (handle both string and number comparisons)
    const apiDistrict = apiDistricts.find((d) => {
      const districtId = typeof d.id === 'string' ? parseInt(d.id) : d.id;
      return districtId === apiDistrictId;
    });
    if (!apiDistrict) return undefined;

    const svgDistrict = districts.find(
      (d) => d.name?.toLowerCase() === apiDistrict.name.toLowerCase()
    );
    return svgDistrict?.code;
  };

  const handleDistrictClick = (svgDistrictCode: string | undefined) => {
    const svgDistrictName = getDistrictName(svgDistrictCode);
    const apiDistrictId = mapSvgDistrictToApiId(svgDistrictName);

    console.log("District Click:", {
      svgDistrictCode,
      svgDistrictName,
      apiDistrictId,
      activeDistrict,
      apiDistricts: apiDistricts.map(d => ({ id: d.id, name: d.name }))
    });

    if (activeDistrict === apiDistrictId && activeSvgDistrictCode === svgDistrictCode) {
      onDistrictSelect(null);
      setActiveSvgDistrictCode(null);
    } else {
      onDistrictSelect(apiDistrictId);
      setActiveSvgDistrictCode(svgDistrictCode || null);
    }
  };

  const BackDrop = () => {
    return (
      <div
        style={{
          top: "calc(50vh - 150px)",
          position: "absolute",
          background: "#1061DA",
          display: "block",
          height: 300,
          width: 1000,
          filter: "blur(100px)",
          transform: "rotate(-20deg)",
          zIndex: -1,
          opacity: 0.1,
        }}
      />
    );
  };

  return (
    <>
      <Container
        py={100}
        size="xl"
        style={{
          transition: ".5s ease-in-out",
          overflow: "visible",
          pointerEvents: "none",
          position: "relative",
          zIndex: siteState !== "default" ? -1 : 1,
        }}
      >
        <Center
          h="100%"
          pos="relative"
          style={{
            transition: ".5s ease-in-out",
            pointerEvents: "none",
            transform:
              siteState == "initial"
                ? "scale(1.5) translateX(30%) translateY(100px)"
                : "",
          }}
        >
          <Text
            size="xs"
            w="100%"
            ta="center"
            pos="absolute"
            bottom={32}
            style={{ pointerEvents: "none" }}
            visibleFrom="lg"
          >
            {hoveredDistrict
              ? getDistrictName(hoveredDistrict)
              : activeDistrict
              ? getDistrictName(getSvgDistrictCodeByApiId(activeDistrict))
              : "Hover over a district"}
          </Text>

          <svg
            viewBox="0 0 1839 929"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ pointerEvents: "auto" }}
            className={classes.svg}
          >
            <g clipPath="url(#clip0_285_2)">
              {districts.map((district, index) => {
                const isActive =
                  activeSvgDistrictCode === district.code ||
                  getSvgDistrictCodeByApiId(activeDistrict) === district.code;
                return (
                  <path
                    key={index}
                    d={district.d}
                    className={`${classes.path} ${
                      isActive ? classes.active : ""
                    } ${
                      hoveredDistrict === district.code ? classes.hovered : ""
                    }`}
                    onClick={() => handleDistrictClick(district.code)}
                    onMouseEnter={() =>
                      setHoveredDistrict(district.code || null)
                    }
                    onMouseLeave={() => setHoveredDistrict(null)}
                    style={{ cursor: "pointer" }}
                  />
                );
              })}
            </g>
          </svg>
        </Center>

        <BackDrop />
      </Container>
    </>
  );
}
