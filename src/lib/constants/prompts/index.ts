/**
 * Prompt 配置统一导出
 *
 * 所有 prompt 从数据库加载,支持用户自定义和系统默认
 */

import type { RenderLanguage, DiagramType } from "@/lib/constants/diagram-types";
import { getDatabaseInstance } from "@/lib/db/client";
import { PromptRepository } from "@/lib/repositories/PromptRepository";

export * from "./types";

/**
 * 获取生成 prompt
 *
 * 返回完整的 prompt: L1 + L2 + L3
 * 不包含用户输入（用户输入由 AI 服务单独传递）
 *
 * @param renderLanguage - 渲染语言
 * @param diagramType - 图表类型
 * @returns 完整的 prompt 文本
 */
export function getGeneratePrompt(
  renderLanguage: RenderLanguage,
  diagramType: DiagramType
): string {
  const db = getDatabaseInstance();
  const repo = new PromptRepository(db);

  // 全局共享 Prompt (所有用户使用相同的激活版本)

  // 1. L1: 通用规范 (所有图表共享)
  const l1 = repo.findActive(1);

  // 2. L2: 语言规范 (如 Mermaid 通用规范)
  const l2 = repo.findActive(2, renderLanguage);

  // 3. L3: 类型规范 (如 Flowchart 特定要求)
  const l3 = repo.findActive(3, renderLanguage, diagramType);

  // 组合所有层级的 prompt
  const parts: string[] = [];
  if (l1) parts.push(l1.content);
  if (l2) parts.push(l2.content);
  if (l3) parts.push(l3.content);

  if (parts.length === 0) {
    throw new Error(`未找到提示词: renderLanguage=${renderLanguage}, diagramType=${diagramType}`);
  }

  return parts.join("\n\n---\n\n");
}
