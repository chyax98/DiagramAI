/** Prompt配置统一导出 - DIAGRAM_PROMPTS对象+getGeneratePrompt辅助函数 */

import type { RenderLanguage, DiagramType } from "@/lib/constants/diagram-types";
import { mermaidPrompts } from "./mermaid";
import { plantumlPrompts } from "./plantuml";
import { d2Prompts } from "./d2";
import { graphvizPrompts } from "./graphviz";
import { wavedromPrompts } from "./wavedrom";
import { nomnomlPrompts } from "./nomnoml";
import { excalidrawPrompts } from "./excalidraw";
import { c4plantumlPrompts } from "./c4plantuml";
import { vegalitePrompts } from "./vegalite";
import { dbmlPrompts } from "./dbml";
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
