/** 用户菜单 - 显示用户信息和操作菜单 */

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Moon, Sun, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

import { logger } from "@/lib/utils/logger";

export function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { setTheme, isDark } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleLogout = async () => {
    try {
      const { apiClient } = await import("@/lib/utils/api-client");
      await apiClient.post("/api/auth/logout");
    } catch (error) {
      logger.error("Logout API error:", error);
    } finally {
      logout();
      router.push("/login");
      router.refresh(); // 刷新页面状态
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleThemeToggle}
        className="h-9 w-9"
        aria-label="切换主题"
      >
        {!mounted ? (
          <div className="h-4 w-4" />
        ) : isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>

      <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">{user?.username || "未登录"}</span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        className="h-9 w-9 hover:text-destructive transition-colors"
        aria-label="登出"
        title="登出"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
