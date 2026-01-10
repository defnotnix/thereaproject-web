"use client";

import { SiteNav } from "./SiteNav";
import { useSideContentStatus } from "@/store/site.store";

export function LayoutSite({ children }: any) {
  // * STORE

  const sideContentStatus = useSideContentStatus();

  return (
    <>
      <SiteNav />

      <main>{children}</main>

      {sideContentStatus && <section>{/* Side content goes here */}</section>}
    </>
  );
}
