/**
 * Promote-V4 TOML Prompt 加载器
 *
 * 用途: 从 Promote-V4 的 TOML 文件加载三层 Prompt 并拼接成最终 System Prompt
 * 架构:
 * - L1: universal.toml (通用规范)
 * - L2: {language}.toml (语言特定规范)
 * - L3: {language}/{type}.toml (类型特定规范)
 *
 * 任务指令分离:
 * - System Prompt: 从 TOML 加载 (能力定义)
 * - Task Instructions: 由前端在用户消息中注入 (GENERATE/ADJUST/FIX)
 */

import * as TOML from "@iarna/toml";
import * as fs from "fs/promises";
import * as path from "path";
import type { RenderLanguage } from "@/lib/constants/diagram-types";

/**
 * TOML Prompt 结构定义
 */
interface PromptTOML {
  meta: {
    level: "L1" | "L2" | "L3";
    version: string;
    description: string;
    author: string;
    created_at: string;
    updated_at: string;
    language?: string; // L2, L3
    diagram_type?: string; // L3
  };
  D_role: {
    target_task?: string; // L1
    base_roles?: string[]; // L1
    additional_roles?: string[]; // L2, L3
  };
  E_constraints: {
    items: string[];
  };
  P_process: {
    items: string[];
  };
  H_quality: {
    items: string[];
  };
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
 * TOML 文件路径配置
 */
const TOML_BASE_DIR = path.join(process.cwd(), "Promote-V4", "data");

/**
 * 读取并解析 TOML 文件
 */
async function loadTOMLFile(filePath: string): Promise<PromptTOML> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return TOML.parse(content) as unknown as PromptTOML;
  } catch (error) {
    throw new Error(
      `Failed to load TOML file ${filePath}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * 将 TOML 结构转换为文本 Prompt
 *
 * 转换规则:
 * - [D_role] → "## 角色定义"
 * - [E_constraints] → "## 约束条件"
 * - [P_process] → "## 执行流程"
 * - [H_quality] → "## 质量标准"
 */
function tomlToPrompt(toml: PromptTOML): string {
  const sections: string[] = [];

  // D_role: 角色定义
  const roles: string[] = [];
  if (toml.D_role.target_task) {
    roles.push(toml.D_role.target_task.trim());
  }
  if (toml.D_role.base_roles && toml.D_role.base_roles.length > 0) {
    roles.push("**基础角色**:");
    roles.push(...toml.D_role.base_roles.map((r) => `- ${r.trim()}`));
  }
  if (toml.D_role.additional_roles && toml.D_role.additional_roles.length > 0) {
    roles.push("**附加角色**:");
    roles.push(...toml.D_role.additional_roles.map((r) => `- ${r.trim()}`));
  }
  if (roles.length > 0) {
    sections.push("## 角色定义\n\n" + roles.join("\n"));
  }

  // E_constraints: 约束条件
  if (toml.E_constraints.items.length > 0) {
    sections.push(
      "## 约束条件\n\n" +
        toml.E_constraints.items.map((item) => item.trim()).join("\n\n")
    );
  }

  // P_process: 执行流程
  if (toml.P_process.items.length > 0) {
    sections.push(
      "## 执行流程\n\n" + toml.P_process.items.map((item) => item.trim()).join("\n\n")
    );
  }

  // H_quality: 质量标准
  if (toml.H_quality.items.length > 0) {
    sections.push(
      "## 质量标准\n\n" + toml.H_quality.items.map((item) => item.trim()).join("\n\n")
    );
  }

  return sections.join("\n\n---\n\n");
}

/**
 * 加载三层 Prompt 并拼接为最终 System Prompt
 *
 * @param renderLanguage - 渲染语言 (如 mermaid, plantuml)
 * @param diagramType - 图表类型 (如 flowchart, sequence)
 * @returns PromptTOMLLoadResult - 三层 Prompt 内容 + 最终 System Prompt + 版本信息
 * @throws Error - 如果 L1 或 L3 文件不存在
 */
export async function loadPromptTOML(
  renderLanguage: RenderLanguage,
  diagramType: string
): Promise<PromptTOMLLoadResult> {
  try {
    // ========================================================================
    // L1: 通用层 (必须存在)
    // ========================================================================
    const l1Path = path.join(TOML_BASE_DIR, "L1", "universal.toml");
    const l1TOML = await loadTOMLFile(l1Path);
    const l1_content = tomlToPrompt(l1TOML);
    const l1_version = l1TOML.meta.version;

    // ========================================================================
    // L2: 语言层 (可选)
    // ========================================================================
    const l2Path = path.join(TOML_BASE_DIR, "L2", `${renderLanguage}.toml`);
    let l2_content: string | null = null;
    let l2_version: string | undefined = undefined;

    try {
      const l2TOML = await loadTOMLFile(l2Path);
      l2_content = tomlToPrompt(l2TOML);
      l2_version = l2TOML.meta.version;
    } catch (error) {
      // L2 可选，不存在时使用 null
      console.warn(`L2 not found for ${renderLanguage}, using null`);
    }

    // ========================================================================
    // L3: 类型层 (必须存在)
    // ========================================================================
    const l3Path = path.join(TOML_BASE_DIR, "L3", renderLanguage, `${diagramType}.toml`);
    const l3TOML = await loadTOMLFile(l3Path);
    const l3_content = tomlToPrompt(l3TOML);
    const l3_version = l3TOML.meta.version;

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

    const final_system_prompt = parts.join("\n\n═══════════════════════════════════════════════════════════════\n\n");

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
      `Failed to load TOML prompts for ${renderLanguage}/${diagramType}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
