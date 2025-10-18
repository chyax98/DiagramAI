/** 主题管理 - light/dark/system 主题切换和持久化 */

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";

import { logger } from "@/lib/utils/logger";

export type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  effectiveTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export { ThemeContext };

const THEME_STORAGE_KEY = "diagramai-theme";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch (error) {
    logger.error("读取主题偏好失败:", error);
  }

  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return getStoredTheme();
  });

  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    return getSystemTheme();
  });

  const effectiveTheme = theme === "system" ? systemTheme : theme;
  const isDark = effectiveTheme === "dark";

  useEffect(() => {
    const appliedTheme = theme === "system" ? systemTheme : theme;

    if (appliedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, systemTheme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? "dark" : "light";
      setSystemTheme(newSystemTheme);

      if (theme === "system") {
        document.documentElement.classList.toggle("dark", newSystemTheme === "dark");
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);

      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch (error) {
        logger.error("保存主题偏好失败:", error);
      }

      const appliedTheme = newTheme === "system" ? systemTheme : newTheme;
      document.documentElement.classList.toggle("dark", appliedTheme === "dark");
    },
    [systemTheme]
  );

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      isDark,
      effectiveTheme,
    }),
    [theme, setTheme, isDark, effectiveTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** useTheme Hook - 获取主题状态 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
