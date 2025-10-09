/**
 * DBML Prompts 导出
 * 
 * 根据图表类型返回相应的 L3 专用提示词
 */

import { DBML_LANGUAGE_SPEC } from "./common";
import { DBML_SCHEMA_PROMPT } from "./schema";
import { DBML_SINGLE_TABLE_PROMPT } from "./single-table";
import { DBML_ERD_PROMPT } from "./erd";
import { DBML_MIGRATION_PROMPT } from "./migration";

/**
 * DBML 图表类型
 */
export type DBMLDiagramType = "schema" | "single_table" | "erd" | "migration";

/**
 * 根据图表类型获取 DBML 提示词
 */
export function getDBMLPrompt(diagramType: DBMLDiagramType): string {
  switch (diagramType) {
    case "schema":
      return DBML_SCHEMA_PROMPT;
    case "single_table":
      return DBML_SINGLE_TABLE_PROMPT;
    case "erd":
      return DBML_ERD_PROMPT;
    case "migration":
      return DBML_MIGRATION_PROMPT;
    default:
      // 默认返回完整 Schema prompt
      return DBML_SCHEMA_PROMPT;
  }
}

// 导出所有 prompts
export {
  DBML_LANGUAGE_SPEC,
  DBML_SCHEMA_PROMPT,
  DBML_SINGLE_TABLE_PROMPT,
  DBML_ERD_PROMPT,
  DBML_MIGRATION_PROMPT,
};

// ============================================
// PromptConfig 导出（供主 index.ts 使用）
// ============================================

import type { PromptConfig } from "../types";
import { UNIVERSAL_PROMPT } from "../common";

/**
 * 获取 DBML 图表的完整提示词（L1 + L2 + L3）
 */
function getDBMLPromptComplete(diagramType: DBMLDiagramType): string {
  const l1 = UNIVERSAL_PROMPT;
  const l2 = DBML_LANGUAGE_SPEC;
  const l3 = getDBMLPrompt(diagramType);
  
  return [l1, l2, l3]
    .filter((p) => p.length > 0)
    .join("\n\n---\n\n");
}

/**
 * DBML Prompts 配置对象
 * 
 * 实现 PromptConfig<"dbml"> 接口，供 DIAGRAM_PROMPTS 使用
 */
export const dbmlPrompts: PromptConfig<"dbml"> = {
  generate: (diagramType) => {
    return getDBMLPromptComplete(diagramType as DBMLDiagramType);
  },
};
