"use client";

import { BrowseNav } from "./BrowseNav";

export function LayoutAgendaBrowse({ children }: any) {
  return (
    <>
      <BrowseNav />
      <main
        style={{
          position: "relative",
          height: "calc(100vh - 100px)",
          overflow: "hidden",
        }}
      >
        {" "}
        {children}
      </main>
    </>
  );
}
