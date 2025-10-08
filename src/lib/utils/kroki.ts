/** Kroki URL 生成工具 - deflate + base64url 编码 */

import pako from "pako";
import { KROKI_URL } from "@/lib/constants/env";
import { type RenderLanguage } from "@/lib/constants/diagram-types";

// 类型定义
export type KrokiDiagramType = RenderLanguage;
export type KrokiOutputFormat = "svg" | "png" | "pdf" | "jpeg";

/**
 * Base64 URL Safe 编码
 */
function base64UrlEncode(data: Uint8Array): string {
  const base64 = Buffer.from(data).toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * 生成 Kroki URL
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
