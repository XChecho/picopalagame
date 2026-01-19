import { create } from "zustand";

//Actions

//Adapters
import { SecureStorageAdapter } from "@/core/adapters/secure-storage.adapter";

export type languageType = "en" | "es" | "pt" | "fr";

interface MainState {
  language: languageType;

  setLanguage: (
    language: languageType,
  ) => Promise<{ ok: boolean; msg: string }>;
  getLanguage: () => Promise<languageType>;
}

const LANGUAGE_KEY = "appLanguage";

export const useMainStore = create<MainState>((set) => ({
  language: "en",

  setLanguage: async (language) => {
    set({ language });
    await SecureStorageAdapter.setItem(LANGUAGE_KEY, language);
    // await i18n.changeLanguage(language);
    // const data = await changeLanguage(language)
    // return data
    return { ok: true, msg: "Language changed" };
  },
  getLanguage: async () => {
    try {
      const language = await SecureStorageAdapter.getItem(LANGUAGE_KEY);
      if (language) {
        set({ language } as any);
        return language as languageType;
      }
      return "en";
    } catch (error) {
      console.error("Error to get language:", error);
      return "en";
    }
  },
}));
