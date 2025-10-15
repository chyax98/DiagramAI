/**
 * (app) 路由组布局 - 需要认证的页面
 * 禁用静态生成以确保每次请求都执行认证检查
 */

import type { ReactNode } from "react";

// 强制动态渲染 - 禁用所有子页面的静态生成
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AppLayout({ children }: { children: ReactNode }) {
  return children;
}
