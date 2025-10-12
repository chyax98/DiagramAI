/**
 * 文件下载工具
 *
 * 设计要点：
 * - 基于 Blob API 和 URL.createObjectURL
 * - 支持文本、SVG、JSON、Base64 图片下载
 * - 自动资源清理
 */

import { logger } from "./logger";

/**
 * 下载 Blob 对象
 */
export function downloadBlob(blob: Blob, filename: string): void {
  try {
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    logger.error("下载文件失败", error);
    throw new Error("下载失败: " + (error instanceof Error ? error.message : "未知错误"));
  }
}

/**
 * 下载文本文件
 */
export function downloadTextFile(
  content: string,
  filename: string,
  mimeType: string = "text/plain"
): void {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(blob, filename);
}

/**
 * 下载 Base64 编码文件
 */
export function downloadBase64Image(base64Data: string, filename: string, mimeType?: string): void {
  try {
    let actualData = base64Data;
    let actualMimeType = mimeType;

    if (base64Data.startsWith("data:")) {
      const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/);
      if (matches && matches[1] && matches[2]) {
        actualMimeType = matches[1];
        actualData = matches[2];
      }
    }

    if (!actualMimeType) {
      throw new Error("无法确定 MIME 类型,请提供 mimeType 参数");
    }

    // Base64 解码
    const byteCharacters = atob(actualData);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: actualMimeType });

    downloadBlob(blob, filename);
  } catch (error) {
    logger.error("下载 Base64 文件失败", error);
    throw new Error("下载失败: " + (error instanceof Error ? error.message : "Base64 解码错误"));
  }
}

/**
 * 下载 SVG 文件
 */
export function downloadSVG(svgContent: string, filename: string = "diagram.svg"): void {
  downloadTextFile(svgContent, filename, "image/svg+xml");
}

/**
 * 下载 JSON 文件
 */
export function downloadJSON(
  data: unknown,
  filename: string = "data.json",
  pretty: boolean = true
): void {
  const jsonString = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  downloadTextFile(jsonString, filename, "application/json");
}

/**
 * 从 URL 下载文件
 */
export async function downloadFromURL(url: string, filename?: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const blob = await response.blob();

    // 如果没有提供文件名,尝试从 Content-Disposition 或 URL 提取
    const finalFilename = filename || extractFilenameFromURL(url) || "download";

    downloadBlob(blob, finalFilename);
  } catch (error) {
    logger.error("从 URL 下载文件失败", error);
    throw new Error("下载失败: " + (error instanceof Error ? error.message : "网络错误"));
  }
}

function extractFilenameFromURL(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split("/");
    const lastPart = parts[parts.length - 1];

    // 如果最后一部分包含扩展名,则认为是文件名
    if (lastPart && lastPart.includes(".")) {
      return lastPart;
    }

    return null;
  } catch {
    return null;
  }
}
