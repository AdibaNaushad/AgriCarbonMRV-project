import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type LangCode = "hi" | "bn" | "ta" | "en";

export const LANG_LABELS: Record<LangCode, string> = {
  hi: "हिंदी",
  bn: "বাংলা",
  ta: "தமிழ்",
  en: "English",
};

interface LanguageContextValue {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  autoDetect: () => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

// Rough bounding boxes for demo auto-detection
function detectLangByCoords(lat: number, lon: number): LangCode {
  // West Bengal
  if (lat >= 21.5 && lat <= 27.5 && lon >= 86.5 && lon <= 89.9) return "bn";
  // Tamil Nadu
  if (lat >= 8 && lat <= 13.5 && lon >= 76 && lon <= 80.5) return "ta";
  // Uttar Pradesh
  if (lat >= 24 && lat <= 30 && lon >= 77 && lon <= 84.5) return "hi";
  return "hi"; // default Hindi
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    const saved = localStorage.getItem("agrimrv.lang") as LangCode | null;
    return saved ?? "hi";
  });

  const setLang = (l: LangCode) => {
    setLangState(l);
    localStorage.setItem("agrimrv.lang", l);
  };

  const autoDetect = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const l = detectLangByCoords(latitude, longitude);
        setLang(l);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  useEffect(() => {
    // first load auto-detect if no saved
    const saved = localStorage.getItem("agrimrv.lang");
    if (!saved) autoDetect();
  }, []);

  const value = useMemo(() => ({ lang, setLang, autoDetect }), [lang]);
  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
