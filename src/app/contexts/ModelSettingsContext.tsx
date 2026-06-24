import React, { createContext, useContext, useState, useEffect } from "react";
import type { Lang, Theme } from "../types";

export type ModelSettingsContextType = {
  temperature: number; // 0.0 to 2.0
  topP: number; // 0.0 to 1.0
  setTemperature: (t: number) => void;
  setTopP: (p: number) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
};

const ModelSettingsContext = createContext<ModelSettingsContextType | undefined>(undefined);

export function ModelSettingsProvider({ children }: { children: React.ReactNode }) {
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.8);
  const [theme, setTheme] = useState<Theme>("dark");
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
    const savedLang = localStorage.getItem("lang") as Lang;
    if (savedLang === "en" || savedLang === "fr") {
      setLang(savedLang);
    }
    const savedTemp = localStorage.getItem("model_temp");
    if (savedTemp) setTemperature(parseFloat(savedTemp));
    const savedTopP = localStorage.getItem("model_topp");
    if (savedTopP) setTopP(parseFloat(savedTopP));
  }, []);

  const updateTemperature = (t: number) => {
    setTemperature(t);
    localStorage.setItem("model_temp", t.toString());
  };

  const updateTopP = (p: number) => {
    setTopP(p);
    localStorage.setItem("model_topp", p.toString());
  };

  const updateTheme = (t: Theme) => {
    setTheme(t);
    localStorage.setItem("theme", t);
  };

  const updateLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("lang", l);
  };

  return (
    <ModelSettingsContext.Provider
      value={{
        temperature,
        topP,
        setTemperature: updateTemperature,
        setTopP: updateTopP,
        theme,
        setTheme: updateTheme,
        lang,
        setLang: updateLang,
      }}
    >
      {children}
    </ModelSettingsContext.Provider>
  );
}

export function useModelSettings() {
  const context = useContext(ModelSettingsContext);
  if (!context) {
    throw new Error("useModelSettings must be used within a ModelSettingsProvider");
  }
  return context;
}
