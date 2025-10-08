/**
 * PlantUML Prompt v4.0 - 基于 DEPTH 方法论的三层架构
 *
 * 架构:
 * L1: 通用规范 (common.ts) - DEPTH 框架，所有图表共享
 * L2: PlantUML 语言规范 (plantuml/common.ts) - PlantUML 通用语法
 * L3: 图表生成要求 (plantuml/*.ts) - 各图表类型的专用提示词
 *
 * 改进:
 * 1. 采用 DEPTH 方法论（定义多重视角、成功标准、上下文、任务分解、反馈循环）
 * 2. 三层清晰分离，易于维护和扩展
 * 3. Token 优化，精简高效
 * 4. 高质量示例和常见错误说明
 */

import { type PromptConfig } from "./types";
import { UNIVERSAL_PROMPT } from "./common";
import {
  PLANTUML_LANGUAGE_PROMPT,
  PLANTUML_SEQUENCE_PROMPT,
  PLANTUML_CLASS_PROMPT,
  PLANTUML_ACTIVITY_PROMPT,
  PLANTUML_USECASE_PROMPT,
  PLANTUML_COMPONENT_PROMPT,
  PLANTUML_STATE_PROMPT,
  PLANTUML_OBJECT_PROMPT,
  PLANTUML_DEPLOYMENT_PROMPT,
} from "./plantuml/index";

/**
 * 获取特定图表类型的 L3 提示词
 */
function getDiagramPrompt(diagramType: string): string {
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

  return promptMap[diagramType] || PLANTUML_SEQUENCE_PROMPT;
}

/**
 * PlantUML 提示词配置
 * 
 * 架构: L1 (通用规范) + L2 (PlantUML 语言规范) + L3 (图表要求)
 */
export const plantumlPrompts: PromptConfig<"plantuml"> = {
  generate: (diagramType) => {
    // L1: 通用规范（所有图表共享）
    const l1 = UNIVERSAL_PROMPT;

    // L2: PlantUML 语言规范
    const l2 = PLANTUML_LANGUAGE_PROMPT;

    // L3: 图表要求（根据图表类型选择）
    const l3 = getDiagramPrompt(diagramType);

    // 组合三层提示词
    return [l1, l2, l3]
      .filter((p) => p.length > 0)
      .join("\n\n---\n\n");
  },
};
