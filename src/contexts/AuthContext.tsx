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

export interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  getCurrentUser: () => User | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export { AuthContext };

/** 认证 Provider - JWT 状态管理和持久化 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const parts = token.split(".");
        if (parts[1]) {
          const payload = JSON.parse(atob(parts[1]));

          // 检查 token 是否过期 (exp 是秒级时间戳)
          if (payload.exp && Date.now() > payload.exp * 1000) {
            logger.warn("Token 已过期,清除并重定向");
            localStorage.removeItem("token");
            setIsLoading(false);
            return;
          }

          setUser({
            id: payload.userId,
            username: payload.username,
          });
        } else {
          throw new Error("Invalid token format");
        }
      } catch (error) {
        logger.error("Failed to parse token:", error);
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((token: string, user: User) => {
    localStorage.setItem("token", token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const getCurrentUser = useCallback(() => {
    return user;
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
      getCurrentUser,
    }),
    [user, isLoading, login, logout, getCurrentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** useAuth Hook - 获取认证状态 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
