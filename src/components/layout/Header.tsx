"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle"; // T106: 主题切换
import { IconUser, IconLogout, IconLogin, IconSparkles } from "@/components/icons";

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // 登出处理
  const handleLogout = () => {
    logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo 和应用名称 */}
          <Link
            href="/"
            className="flex items-center gap-2 group transition-all duration-200 hover:scale-105"
          >
            <div className="relative">
              <IconSparkles className="w-7 h-7 text-indigo-600 dark:text-indigo-400 transition-transform duration-300 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              DiagramAI
            </span>
          </Link>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-3">
            {/* T106: 主题切换按钮 */}
            <ThemeToggle />

            {/* 用户信息和登出按钮 */}
            {user ? (
              <>
                {/* 用户名 */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <IconUser className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {user.username}
                  </span>
                </div>

                {/* 登出按钮 */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium
                           text-slate-700 dark:text-slate-300
                           hover:text-slate-900 dark:hover:text-white
                           hover:bg-slate-100 dark:hover:bg-slate-800
                           rounded-lg transition-all duration-200
                           active:scale-95"
                >
                  <IconLogout className="w-4 h-4" />
                  <span>登出</span>
                </button>
              </>
            ) : (
              /* 未登录时显示登录按钮 */
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium
                         bg-gradient-to-r from-indigo-600 to-violet-600
                         hover:from-indigo-700 hover:to-violet-700
                         text-white rounded-lg shadow-lg shadow-indigo-500/25
                         hover:shadow-xl hover:shadow-indigo-500/40
                         transition-all duration-200 active:scale-95"
              >
                <IconLogin className="w-4 h-4" />
                <span>登录</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
