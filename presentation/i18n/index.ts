// src/i18n/index.ts
import { getLocales } from "expo-localization";
import * as SecureStore from "expo-secure-store";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

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

// Función para cargar el idioma almacenado
async function getSavedLanguage(): Promise<string> {
  try {
    const storedLang = await SecureStore.getItemAsync(LANGUAGE_KEY);

    if (storedLang) {
      return storedLang;
    }

    // Usa encadenamiento opcional para evitar el crash
    const locales = getLocales();
    const deviceLang =
      locales && locales.length > 0 ? locales[0].languageCode : "en";

    if (
      deviceLang === "en" ||
      deviceLang === "es" ||
      deviceLang === "pt" ||
      deviceLang === "fr"
    ) {
      await SecureStore.setItemAsync(LANGUAGE_KEY, deviceLang);
      return deviceLang;
    }

    return "en";
  } catch (error) {
    console.error("Error al obtener idioma:", error);
    return "en";
  }
}

// Inicializa i18n
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

// Función para cambiar el idioma y guardarlo
export async function changeAppLanguage(lang: string) {
  await i18n.changeLanguage(lang);
  await SecureStore.setItemAsync(LANGUAGE_KEY, lang);
}

export default i18n;
