/**
 * 提示词管理页面
 * 提供三栏布局和版本管理功能
 */

import { PromptManager } from "@/components/prompts/PromptManager";
import { PromptHeader } from "@/components/prompts/PromptHeader";

// 禁用静态生成 - 此页面需要认证
export const dynamic = "force-dynamic";

export default function PromptsPage() {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* 导航栏 */}
      <PromptHeader />

      {/* 主内容区 */}
      <div className="flex-1 overflow-hidden">
        <PromptManager />
      </div>
    </div>
  );
}
