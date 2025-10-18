/**
 * Prompt 管理页面导航栏
 * 提供返回主页和标题功能
 */

"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PromptHeader() {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-2 shadow-sm">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToHome}
          className="gap-2"
          title="返回主页"
        >
          <ArrowLeft className="h-4 w-4" />
          返回主页
        </Button>
        <div className="h-4 w-px bg-border" />
        <h1 className="text-lg font-semibold text-card-foreground">提示词管理</h1>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>L1 通用规范</span>
        <span className="text-muted-foreground/50">•</span>
        <span>L2 语言规范</span>
        <span className="text-muted-foreground/50">•</span>
        <span>L3 类型规范</span>
      </div>
    </header>
  );
}
