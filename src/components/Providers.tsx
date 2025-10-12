/**
 * Providers组件 - 集中管理Client-Side Providers
 * 使用命名导出,避免默认导出的模块解析问题
 */

"use client";

import { type ReactNode } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toast";

/** 层级设计: ThemeProvider → AuthProvider → children + Toaster
 * 原因: 主题需最早初始化,AuthProvider依赖主题,Toaster使用Portal渲染到body */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
