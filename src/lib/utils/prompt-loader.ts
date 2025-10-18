/**
 * Prompt 三层加载工具
 *
 * 用途: 从数据库加载 L1/L2/L3 三层 Prompt 内容
 * 职责:
 * 1. 从数据库加载激活的 Prompt 版本
 * 2. 返回 Prompt ID 用于失败日志记录
 * 3. L1 和 L3 必须存在，L2 可选
 *
 * 注意: 系统初始化时会将所有默认提示词导入数据库，因此不需要文件系统兜底
 */

import { getDatabaseInstance } from "@/lib/db/client";
import { PromptRepository } from "@/lib/repositories/PromptRepository";
import type { PromptLoadResult } from "@/types/prompt";
import type { RenderLanguage } from "@/lib/constants/diagram-types";

/**
 * 加载指定语言和类型的 Prompt 内容
 *
 * 加载策略:
 * - L1: 从数据库加载（必须存在）
 * - L2: 从数据库加载（可选）
 * - L3: 从数据库加载（必须存在）
 *
 * @param renderLanguage - 渲染语言 (如 mermaid, plantuml)
 * @param diagramType - 图表类型 (如 flowchart, sequence)
 * @returns PromptLoadResult - 三层 Prompt 内容 + 版本信息 + Prompt IDs
 * @throws Error - 如果 L1 或 L3 不存在
 */
export async function loadPrompt(
  renderLanguage: RenderLanguage,
  diagramType: string
): Promise<PromptLoadResult> {
  try {
    const db = getDatabaseInstance();
    const promptRepo = new PromptRepository(db);

    // ========================================================================
    // L1: 通用提示词（必须存在）
    // ========================================================================
    const l1 = promptRepo.findActive(1);
    if (!l1) {
      throw new Error("L1 通用提示词不存在，请检查数据库初始化");
    }

    const l1_content = l1.content;
    const l1_version = l1.version;
    const l1_id = l1.id;

    // ========================================================================
    // L2: 语言级提示词（可选）
    // ========================================================================
    const l2 = promptRepo.findActive(2, renderLanguage);
    
    const l2_content = l2?.content || null;
    const l2_version = l2?.version;
    const l2_id = l2?.id;

    // ========================================================================
    // L3: 类型级提示词（必须存在）
    // ========================================================================
    const l3 = promptRepo.findActive(3, renderLanguage, diagramType);
    if (!l3) {
      throw new Error(
        `L3 提示词不存在: ${renderLanguage}/${diagramType}，请检查数据库初始化`
      );
    }

    const l3_content = l3.content;
    const l3_version = l3.version;
    const l3_id = l3.id;

    // ========================================================================
    // 组合最终 Prompt
    // ========================================================================
    const parts: string[] = [];
    if (l1_content) parts.push(l1_content);
    if (l2_content) parts.push(l2_content);
    if (l3_content) parts.push(l3_content);

    const final_prompt = parts.join("\n\n---\n\n");

    // ========================================================================
    // 返回结果
    // ========================================================================
    return {
      l1_content,
      l2_content,
      l3_content,
      final_prompt,
      versions: {
        l1_version,
        l2_version,
        l3_version,
      },
      prompt_ids: {
        l1_id,
        l2_id,
        l3_id,
      },
    };
  } catch (error) {
    throw new Error(
      `Failed to load prompts for ${renderLanguage}/${diagramType}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
