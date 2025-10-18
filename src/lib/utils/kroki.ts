/** Kroki 工具 - 支持 POST 和 GET 两种方式 */

import pako from "pako";
import { KROKI_URL } from "@/lib/constants/env";
import { type RenderLanguage } from "@/lib/constants/diagram-types";

// 类型定义
export type KrokiDiagramType = RenderLanguage;
export type KrokiOutputFormat = "svg" | "png" | "pdf" | "jpeg";

/**
 * Base64 URL Safe 编码 (用于 GET 请求)
 */
function base64UrlEncode(data: Uint8Array): string {
  const base64 = Buffer.from(data).toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * 生成 Kroki GET URL (编码方式,有长度限制)
 *
 * @deprecated 推荐使用 renderKrokiDiagram (POST 方式) 以支持大型图表
 *
 * @param code - 图表代码
 * @param diagramType - 图表类型 (mermaid, plantuml, etc.)
 * @param outputFormat - 输出格式 (svg, png, pdf, jpeg)
 * @returns Kroki API URL
 *
 * @example
 * generateKrokiURL("graph TD\n  A-->B", "mermaid", "svg")
 * // => "/api/kroki/mermaid/svg/eNpL..."
 */
export function generateKrokiURL(
  code: string,
  diagramType: KrokiDiagramType,
  outputFormat: KrokiOutputFormat = "svg"
): string {
  const compressed = pako.deflate(code, { level: 9 });
  const encoded = base64UrlEncode(compressed);
  return `${KROKI_URL}/${diagramType}/${outputFormat}/${encoded}`;
}

/**
 * 渲染 Kroki 图表 (推荐使用 POST 方式)
 *
 * 优势:
 * - 无 URL 长度限制,支持大型图表
 * - 无需编码/解码,性能更好
 * - 代码更简洁
 *
 * @param code - 图表代码
 * @param diagramType - 图表类型
 * @param outputFormat - 输出格式
 * @returns 图表 URL (blob URL)
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
  const response = await fetch(`${KROKI_URL}/${diagramType}/${outputFormat}`, {
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
