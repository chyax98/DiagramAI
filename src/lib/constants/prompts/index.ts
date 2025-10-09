/** Prompt配置统一导出 - DIAGRAM_PROMPTS对象+getGeneratePrompt辅助函数 */

import type { RenderLanguage, DiagramType } from "@/lib/constants/diagram-types";
// 从新版本的子目录导入（使用三层架构）
import { mermaidPrompts } from "./mermaid/index";
import { plantumlPrompts } from "./plantuml/index";
import { d2Prompts } from "./d2/index";
import { graphvizPrompts } from "./graphviz/index";
import { wavedromPrompts } from "./wavedrom/index";
import { nomnomlPrompts } from "./nomnoml/index";
import { excalidrawPrompts } from "./excalidraw/index";
import { c4plantumlPrompts } from "./plantuml/c4/index";
import { vegalitePrompts } from "./vegalite/index";
import { dbmlPrompts } from "./dbml/index";
import { getAutoSelectPrompt } from "./auto-select";

export * from "./types";
export { getAutoSelectPrompt };

export const DIAGRAM_PROMPTS = {
  mermaid: mermaidPrompts,
  plantuml: plantumlPrompts,
  d2: d2Prompts,
  graphviz: graphvizPrompts,
  wavedrom: wavedromPrompts,
  nomnoml: nomnomlPrompts,
  excalidraw: excalidrawPrompts,
  c4plantuml: c4plantumlPrompts,
  vegalite: vegalitePrompts,
  dbml: dbmlPrompts,
} as const;

export function getGeneratePrompt(
  renderLanguage: RenderLanguage,
  diagramType: DiagramType
): string {
  const prompts = DIAGRAM_PROMPTS[renderLanguage];
  return prompts.generate(diagramType as any);
}
