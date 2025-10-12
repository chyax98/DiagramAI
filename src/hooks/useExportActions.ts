/** 导出操作 Hook - 封装 SVG/PNG/源代码/图片复制等导出逻辑 */

import { useState, useCallback } from "react";
import { saveAs } from "file-saver";

import { copyTextToClipboard, copyImageToClipboard } from "@/lib/utils/clipboard";
import { logger } from "@/lib/utils/logger";
import { svgToPngBlob, isSvgToImageSupported } from "@/lib/utils/svg-to-image";

export type ExportStatus = "idle" | "loading" | "success" | "error";

export interface ExportActions {
  // 导出为 SVG 文件
  exportSVG: () => Promise<void>;
  // 导出为 PNG 文件
  exportPNG: () => Promise<void>;
  // 复制源代码到剪贴板
  copyCode: () => Promise<void>;
  // 复制图片到剪贴板
  copyImage: () => Promise<void>;
  // 状态
  svgStatus: ExportStatus;
  pngStatus: ExportStatus;
  copyStatus: ExportStatus;
  copyImageStatus: ExportStatus;
}

interface UseExportActionsParams {
  code: string;
  svgContent?: string;
}

function generateFileName(format: "svg" | "png"): string {
  const timestamp = Date.now();
  return `diagram-${timestamp}.${format}`;
}

/**
 * 导出操作 Hook
 * 提供 SVG/PNG 下载、源代码复制、图片复制功能
 */
export function useExportActions({ code, svgContent }: UseExportActionsParams): ExportActions {
  const [svgStatus, setSvgStatus] = useState<ExportStatus>("idle");
  const [pngStatus, setPngStatus] = useState<ExportStatus>("idle");
  const [copyStatus, setCopyStatus] = useState<ExportStatus>("idle");
  const [copyImageStatus, setCopyImageStatus] = useState<ExportStatus>("idle");

  const exportSVG = useCallback(async () => {
    if (!svgContent) {
      logger.warn("⚠️ [Export] SVG 内容不可用");
      setSvgStatus("error");
      setTimeout(() => setSvgStatus("idle"), 2000);
      return;
    }

    setSvgStatus("loading");

    try {
      logger.info("✨ [Export] 使用本地 SVG（无需重新请求）");
      const blob = new Blob([svgContent], { type: "image/svg+xml" });
      saveAs(blob, generateFileName("svg"));
      setSvgStatus("success");
      setTimeout(() => setSvgStatus("idle"), 2000);
    } catch (error) {
      logger.error("Export SVG error:", error);
      setSvgStatus("error");
      setTimeout(() => setSvgStatus("idle"), 2000);
    }
  }, [svgContent]);

  const exportPNG = useCallback(async () => {
    if (!svgContent || !isSvgToImageSupported()) {
      logger.warn("⚠️ [Export] SVG 内容不可用或浏览器不支持");
      setPngStatus("error");
      setTimeout(() => setPngStatus("idle"), 2000);
      return;
    }

    setPngStatus("loading");

    try {
      logger.info("✨ [Export] 使用本地 SVG 转 PNG（无需重新请求）");
      const blob = await svgToPngBlob(svgContent, 2); // 2倍分辨率
      saveAs(blob, generateFileName("png"));
      setPngStatus("success");
      setTimeout(() => setPngStatus("idle"), 2000);
    } catch (error) {
      logger.error("Export PNG error:", error);
      setPngStatus("error");
      setTimeout(() => setPngStatus("idle"), 2000);
    }
  }, [svgContent]);

  const copyCode = useCallback(async () => {
    setCopyStatus("loading");

    try {
      const success = await copyTextToClipboard(code);
      setCopyStatus(success ? "success" : "error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch (error) {
      logger.error("Copy error:", error);
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  }, [code]);

  const copyImage = useCallback(async () => {
    if (!svgContent || !isSvgToImageSupported()) {
      logger.warn("⚠️ [Export] SVG 内容不可用或浏览器不支持");
      setCopyImageStatus("error");
      setTimeout(() => setCopyImageStatus("idle"), 2000);
      return;
    }

    setCopyImageStatus("loading");

    try {
      logger.info("✨ [Export] 使用本地 SVG 转 PNG（无需重新请求）");
      const blob = await svgToPngBlob(svgContent, 2); // 2倍分辨率
      const success = await copyImageToClipboard(blob);
      setCopyImageStatus(success ? "success" : "error");
      setTimeout(() => setCopyImageStatus("idle"), 2000);
    } catch (error) {
      logger.error("Copy image error:", error);
      setCopyImageStatus("error");
      setTimeout(() => setCopyImageStatus("idle"), 2000);
    }
  }, [svgContent]);

  return {
    exportSVG,
    exportPNG,
    copyCode,
    copyImage,
    svgStatus,
    pngStatus,
    copyStatus,
    copyImageStatus,
  };
}
