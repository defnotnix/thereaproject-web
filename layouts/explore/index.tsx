"use client";

import { BrowseNav } from "./BrowseNav";

export function LayoutAgendaBrowse({ children }: any) {
  return (
    <>
      <BrowseNav />
      <main> {children}</main>
    </>
  );
}
