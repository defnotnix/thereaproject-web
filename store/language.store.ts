"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "en" | "np";

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "language-store",
    }
  )
);

// Selectors (following auth store pattern)
export const useLanguage = () => useLanguageStore((state) => state.language);
export const useSetLanguage = () => useLanguageStore((state) => state.setLanguage);
