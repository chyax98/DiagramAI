/**
 * Promote-V4 数据库 Prompt 加载器
 *
 * 用途: 从 custom_prompts 表加载三层 Prompt 并拼接成最终 System Prompt
 * 架构:
 * - L1: prompt_level=1 (通用规范)
 * - L2: prompt_level=2 (语言特定规范)
 * - L3: prompt_level=3 (类型特定规范)
 *
 * 数据来源: custom_prompts 表 (系统默认 user_id=1)
 */

import Database from "better-sqlite3";
import * as path from "path";
import type { RenderLanguage } from "@/lib/constants/diagram-types";

/**
 * 数据库 Prompt 记录
 */
interface CustomPrompt {
  id: number;
  user_id: number;
  prompt_level: number;
  render_language: string | null;
  diagram_type: string | null;
  version: string;
  version_name: string | null;
  is_active: number;
  content: string;
  meta_info: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 加载结果
 */
export interface PromptTOMLLoadResult {
  l1_content: string;
  l2_content: string | null;
  l3_content: string;
  final_system_prompt: string;
  versions: {
    l1_version: string;
    l2_version?: string;
    l3_version: string;
  };
}

/**
 * 数据库连接
 */
const dbPath = path.join(process.cwd(), "data/diagram-ai.db");
const db = new Database(dbPath);

/**
 * 系统默认 Prompt 的 user_id
 */
const SYSTEM_USER_ID = 1;

/**
 * 从数据库加载 Prompt
 *
 * @param promptLevel - Prompt 层级 (1/2/3)
 * @param renderLanguage - 渲染语言 (L2/L3 需要)
 * @param diagramType - 图表类型 (L3 需要)
 * @returns CustomPrompt 记录或 null
 */
function loadPromptFromDB(
  promptLevel: number,
  renderLanguage?: string,
  diagramType?: string
): CustomPrompt | null {
  try {
    let query = `
      SELECT * FROM custom_prompts
      WHERE user_id = ?
        AND prompt_level = ?
        AND is_active = 1
    `;
    const params: (string | number)[] = [SYSTEM_USER_ID, promptLevel];

    if (promptLevel === 2) {
      // L2: 需要 render_language
      query += " AND render_language = ? AND diagram_type IS NULL";
      params.push(renderLanguage!);
    } else if (promptLevel === 3) {
      // L3: 需要 render_language + diagram_type
      query += " AND render_language = ? AND diagram_type = ?";
      params.push(renderLanguage!, diagramType!);
    } else {
      // L1: 不需要 language 和 type
      query += " AND render_language IS NULL AND diagram_type IS NULL";
    }

    query += " ORDER BY version DESC LIMIT 1"; // 获取最新版本

    const stmt = db.prepare(query);
    const result = stmt.get(...params) as CustomPrompt | undefined;

    return result || null;
  } catch (error) {
    console.error(`Failed to load prompt from DB (L${promptLevel}):`, error);
    return null;
  }
}

/**
 * 加载三层 Prompt 并拼接为最终 System Prompt
 *
 * @param renderLanguage - 渲染语言 (如 mermaid, plantuml)
 * @param diagramType - 图表类型 (如 flowchart, sequence)
 * @returns PromptTOMLLoadResult - 三层 Prompt 内容 + 最终 System Prompt + 版本信息
 * @throws Error - 如果 L1 或 L3 不存在
 */
export async function loadPromptTOML(
  renderLanguage: RenderLanguage,
  diagramType: string
): Promise<PromptTOMLLoadResult> {
  try {
    // ========================================================================
    // L1: 通用层 (必须存在)
    // ========================================================================
    const l1Prompt = loadPromptFromDB(1);
    if (!l1Prompt) {
      throw new Error("L1 universal prompt not found in database");
    }
    const l1_content = l1Prompt.content;
    const l1_version = l1Prompt.version;

    // ========================================================================
    // L2: 语言层 (可选)
    // ========================================================================
    const l2Prompt = loadPromptFromDB(2, renderLanguage);
    const l2_content = l2Prompt ? l2Prompt.content : null;
    const l2_version = l2Prompt ? l2Prompt.version : undefined;

    // ========================================================================
    // L3: 类型层 (必须存在)
    // ========================================================================
    const l3Prompt = loadPromptFromDB(3, renderLanguage, diagramType);
    if (!l3Prompt) {
      throw new Error(
        `L3 prompt not found in database for ${renderLanguage}/${diagramType}`
      );
    }
    const l3_content = l3Prompt.content;
    const l3_version = l3Prompt.version;

    // ========================================================================
    // 拼接最终 System Prompt
    // ========================================================================
    const parts: string[] = [];
    parts.push(`# L1: 通用图表生成规范 (v${l1_version})`);
    parts.push(l1_content);

    if (l2_content) {
      parts.push(`# L2: ${renderLanguage} 语言规范 (v${l2_version})`);
      parts.push(l2_content);
    }

    parts.push(`# L3: ${renderLanguage} - ${diagramType} 类型规范 (v${l3_version})`);
    parts.push(l3_content);

    const final_system_prompt = parts.join(
      "\n\n═══════════════════════════════════════════════════════════════\n\n"
    );

    // ========================================================================
    // 返回结果
    // ========================================================================
    return {
      l1_content,
      l2_content,
      l3_content,
      final_system_prompt,
      versions: {
        l1_version,
        l2_version,
        l3_version,
      },
    };
  } catch (error) {
    throw new Error(
      `Failed to load prompts from database for ${renderLanguage}/${diagramType}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
