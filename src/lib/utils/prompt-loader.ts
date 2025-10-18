/**
 * Prompt 三层加载工具
 *
 * 用途: 加载 L1/L2/L3 三层 Prompt 内容 (自定义版本优先,Fallback 到文件系统)
 * 职责:
 * 1. 从数据库加载激活的自定义版本
 * 2. Fallback 到文件系统的默认 Prompt
 * 3. 返回 Prompt ID 用于失败日志记录
 */

import { readFile } from "fs/promises";
import { join } from "path";
import { PROMPTS_DIR } from "@/lib/constants/env";
import { getDatabaseInstance } from "@/lib/db/client";
import { PromptRepository } from "@/lib/repositories/PromptRepository";
import type { PromptLoadResult } from "@/types/prompt";
import type { RenderLanguage } from "@/lib/constants/diagram-types";

/**
 * 加载指定语言和类型的 Prompt 内容
 *
 * 加载策略:
 * - L1: 自定义版本 > data/prompts/universal.txt
 * - L2: 自定义版本 > data/prompts/{language}/common.txt (可选)
 * - L3: 自定义版本 > data/prompts/{language}/{type}.txt
 *
 * @param renderLanguage - 渲染语言 (如 mermaid, plantuml)
 * @param diagramType - 图表类型 (如 flowchart, sequence)
 * @returns PromptLoadResult - 三层 Prompt 内容 + 版本信息 + Prompt IDs
 */
export async function loadPrompt(
  renderLanguage: RenderLanguage,
  diagramType: string
): Promise<PromptLoadResult> {
  try {
    const db = getDatabaseInstance();
    const promptRepo = new PromptRepository(db);

    // ========================================================================
    // L1: 通用提示词
    // ========================================================================
    let l1_content: string | null = null;
    let l1_version: string | undefined = undefined;
    let l1_id: number | undefined = undefined;

    const l1Custom = promptRepo.findActive(1);
    if (l1Custom) {
      l1_content = l1Custom.content;
      l1_version = l1Custom.version;
      l1_id = l1Custom.id;
    } else {
      // Fallback 到文件系统
      const universalPath = join(PROMPTS_DIR, "universal.txt");
      try {
        l1_content = await readFile(universalPath, "utf-8");
        l1_version = "system-default";
      } catch (_error) {
        l1_content = null;
      }
    }

    // ========================================================================
    // L2: 语言级提示词 (可选)
    // ========================================================================
    let l2_content: string | null = null;
    let l2_version: string | undefined = undefined;
    let l2_id: number | undefined = undefined;

    const l2Custom = promptRepo.findActive(2, renderLanguage);
    if (l2Custom) {
      l2_content = l2Custom.content;
      l2_version = l2Custom.version;
      l2_id = l2Custom.id;
    } else {
      // Fallback 到文件系统
      const languagePath = join(PROMPTS_DIR, renderLanguage, "common.txt");
      try {
        l2_content = await readFile(languagePath, "utf-8");
        l2_version = "system-default";
      } catch (_error) {
        l2_content = null; // L2 可选,不存在不报错
      }
    }

    // ========================================================================
    // L3: 类型级提示词 (必需)
    // ========================================================================
    let l3_content: string | null = null;
    let l3_version: string | undefined = undefined;
    let l3_id: number | undefined = undefined;

    const l3Custom = promptRepo.findActive(3, renderLanguage, diagramType);
    if (l3Custom) {
      l3_content = l3Custom.content;
      l3_version = l3Custom.version;
      l3_id = l3Custom.id;
    } else {
      // Fallback 到文件系统
      const typePath = join(PROMPTS_DIR, renderLanguage, `${diagramType}.txt`);
      l3_content = await readFile(typePath, "utf-8");
      l3_version = "system-default";
    }

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
