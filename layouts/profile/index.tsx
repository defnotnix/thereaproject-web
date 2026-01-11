"use client";

import { ProfileNav } from "./ProfileNav";

export function LayoutAgendaProfile({ children }: any) {
  return (
    <>
      <ProfileNav />

      <main> {children}</main>
    </>
  );
}
