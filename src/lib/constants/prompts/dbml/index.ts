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
