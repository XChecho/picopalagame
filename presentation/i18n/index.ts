// src/i18n/index.ts
import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { SecureStorageAdapter } from "@/core/adapters/secure-storage.adapter";

import en from "./en.json";
import es from "./es.json";
import fr from "./fr.json";
import pt from "./pt.json";

const LANGUAGE_KEY = "appLanguage";

export const resources = {
  en: { translation: en },
  es: { translation: es },
  pt: { translation: pt },
  fr: { translation: fr },
} as const;

async function getSavedLanguage(): Promise<string> {
  const storedLang = await SecureStorageAdapter.getItem(LANGUAGE_KEY);

  if (storedLang) {
    return storedLang;
  }

  const locales = getLocales();
  const deviceLang =
    locales && locales.length > 0 ? locales[0].languageCode : "en";

  if (
    deviceLang === "en" ||
    deviceLang === "es" ||
    deviceLang === "pt" ||
    deviceLang === "fr"
  ) {
    await SecureStorageAdapter.setItem(LANGUAGE_KEY, deviceLang);
    return deviceLang;
  }

  return "en";
}

export async function initI18n() {
  const language = await getSavedLanguage();
  await i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    lng: language,
    fallbackLng: "en",
    resources,
    interpolation: {
      escapeValue: false,
    },
  });
}

export async function changeAppLanguage(lang: string) {
  await i18n.changeLanguage(lang);
  await SecureStorageAdapter.setItem(LANGUAGE_KEY, lang);
}

export default i18n;
