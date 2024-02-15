import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import resources from "./translations";
import { Language } from "@/utils/keys";

i18n.use(initReactI18next).init({
  resources,
  lng: Language.ru,
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
  // fallbackLng: "ru",
});

export default i18n;
