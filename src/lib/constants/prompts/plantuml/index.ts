/**
 * PlantUML 提示词导出入口
 *
 * 包含 PlantUML 语言规范和所有图表类型的提示词
 */

// L2: PlantUML 语言规范
export { PLANTUML_LANGUAGE_PROMPT } from './common';

// L3: PlantUML 图表类型提示词
export { PLANTUML_SEQUENCE_PROMPT } from './sequence';
export { PLANTUML_CLASS_PROMPT } from './class';
export { PLANTUML_ACTIVITY_PROMPT } from './activity';
export { PLANTUML_USECASE_PROMPT } from './usecase';
export { PLANTUML_COMPONENT_PROMPT } from './component';
export { PLANTUML_STATE_PROMPT } from './state';
export { PLANTUML_OBJECT_PROMPT } from './object';
export { PLANTUML_DEPLOYMENT_PROMPT } from './deployment';

// ============================================
// PromptConfig 导出（供主 index.ts 使用）
// ============================================

import type { DiagramType } from "@/lib/constants/diagram-types";
import type { PromptConfig } from "../types";
import { UNIVERSAL_PROMPT } from "../common";
import { PLANTUML_LANGUAGE_PROMPT } from "./common";
import { PLANTUML_SEQUENCE_PROMPT } from "./sequence";
import { PLANTUML_CLASS_PROMPT } from "./class";
import { PLANTUML_ACTIVITY_PROMPT } from "./activity";
import { PLANTUML_COMPONENT_PROMPT } from "./component";
import { PLANTUML_STATE_PROMPT } from "./state";
import { PLANTUML_USECASE_PROMPT } from "./usecase";
import { PLANTUML_OBJECT_PROMPT } from "./object";
import { PLANTUML_DEPLOYMENT_PROMPT } from "./deployment";

/**
 * 获取 PlantUML 图表的完整提示词（L1 + L2 + L3）
 */
function getPlantUMLPrompt(diagramType: DiagramType): string {
  const l1 = UNIVERSAL_PROMPT;
  const l2 = PLANTUML_LANGUAGE_PROMPT;
  
  const promptMap: Record<string, string> = {
    sequence: PLANTUML_SEQUENCE_PROMPT,
    class: PLANTUML_CLASS_PROMPT,
    activity: PLANTUML_ACTIVITY_PROMPT,
    usecase: PLANTUML_USECASE_PROMPT,
    component: PLANTUML_COMPONENT_PROMPT,
    state: PLANTUML_STATE_PROMPT,
    object: PLANTUML_OBJECT_PROMPT,
    deployment: PLANTUML_DEPLOYMENT_PROMPT,
  };
  
  const l3 = promptMap[diagramType] || PLANTUML_SEQUENCE_PROMPT;
  
  return [l1, l2, l3]
    .filter((p) => p.length > 0)
    .join("\n\n---\n\n");
}

/**
 * PlantUML Prompts 配置对象
 * 
 * 实现 PromptConfig<"plantuml"> 接口，供 DIAGRAM_PROMPTS 使用
 */
export const plantumlPrompts: PromptConfig<"plantuml"> = {
  generate: (diagramType) => {
    return getPlantUMLPrompt(diagramType);
  },
};

