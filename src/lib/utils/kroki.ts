/** Kroki 渲染工具 - POST 方式,通过后端代理访问 */

import { type RenderLanguage } from "@/lib/constants/diagram-types";

// 类型定义
export type KrokiDiagramType = RenderLanguage;
export type KrokiOutputFormat = "svg" | "png" | "pdf" | "jpeg";

/**
 * 渲染 Kroki 图表 (POST 方式,通过后端代理)
 *
 * 优势:
 * - ⚡ 无 URL 长度限制,支持大型图表
 * - 🚀 无需编码/解码,性能更好
 * - 🧹 代码更简洁,移除 pako 依赖
 * - 🔒 后端代理统一访问,避免 CORS
 *
 * @param code - 图表代码
 * @param diagramType - 图表类型 (mermaid, plantuml, etc.)
 * @param outputFormat - 输出格式 (svg, png, pdf, jpeg)
 * @returns Blob URL (用于图片显示)
 *
 * @example
 * const url = await renderKrokiDiagram("graph TD\n  A-->B", "mermaid", "svg")
 * // => "blob:http://localhost:3000/..."
 */
export async function renderKrokiDiagram(
  code: string,
  diagramType: KrokiDiagramType,
  outputFormat: KrokiOutputFormat = "svg"
): Promise<string> {
  // 通过后端代理访问 Kroki
  const response = await fetch(`/api/kroki/${diagramType}/${outputFormat}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      language: diagramType,
      type: outputFormat,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Kroki 渲染失败: ${errorText}`);
  }

  // 创建 Blob URL 用于图片显示
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
