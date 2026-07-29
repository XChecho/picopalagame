import { create } from "zustand";

import { changeAppLanguage } from "@/presentation/i18n";

export type languageType = "en" | "es" | "pt" | "fr";

interface MainState {
  language: languageType;

  setLanguage: (
    language: languageType,
  ) => Promise<{ ok: boolean; msg: string }>;
  getLanguage: () => Promise<languageType>;
}

export const useMainStore = create<MainState>((set) => ({
  language: "en",

  setLanguage: async (language) => {
    await changeAppLanguage(language);
    set({ language });
    return { ok: true, msg: "Language changed" };
  },
  getLanguage: async () => {
    return "en";
  },
}));
