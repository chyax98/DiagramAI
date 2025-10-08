/** 导出图表模态框 - 支持SVG/PNG/源代码 */

"use client";

import { useState } from "react";
import { X, Download, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import type { RenderLanguage } from "@/types/diagram";
import type { KrokiDiagramType } from "@/lib/utils/kroki";
import { KROKI_URL } from "@/lib/constants/env";
import { copyTextToClipboard, copyImageToClipboard } from "@/lib/utils/clipboard";

import { logger } from "@/lib/utils/logger";
interface ExportModalProps {
  isOpen: boolean;
  code: string;
  renderLanguage: RenderLanguage;
  onClose: () => void;
}

type ExportStatus = "idle" | "loading" | "success" | "error";

async function exportWithKroki(
  code: string,
  diagramType: KrokiDiagramType,
  format: "svg" | "png"
): Promise<Blob> {
  const url = `${KROKI_URL}/${diagramType}/${format}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: code,
  });

  if (!response.ok) {
    throw new Error(`导出失败: ${response.status} ${response.statusText}`);
  }

  return await response.blob();
}

function generateFileName(format: "svg" | "png" | "txt"): string {
  const timestamp = Date.now();
  return `diagram-${timestamp}.${format}`;
}

export function ExportModal({ isOpen, code, renderLanguage, onClose }: ExportModalProps) {
  const [svgStatus, setSvgStatus] = useState<ExportStatus>("idle");
  const [pngStatus, setPngStatus] = useState<ExportStatus>("idle");
  const [copyStatus, setCopyStatus] = useState<ExportStatus>("idle");
  const [copyImageStatus, setCopyImageStatus] = useState<ExportStatus>("idle");

  if (!isOpen) return null;

  const handleExportSVG = async () => {
    setSvgStatus("loading");

    try {
      const blob = await exportWithKroki(code, renderLanguage, "svg");
      saveAs(blob, generateFileName("svg"));
      setSvgStatus("success");
      setTimeout(() => setSvgStatus("idle"), 2000);
    } catch (error) {
      logger.error("Export SVG error:", error);
      setSvgStatus("error");
      setTimeout(() => setSvgStatus("idle"), 2000);
    }
  };

  const handleExportPNG = async () => {
    setPngStatus("loading");

    try {
      const blob = await exportWithKroki(code, renderLanguage, "png");
      saveAs(blob, generateFileName("png"));
      setPngStatus("success");
      setTimeout(() => setPngStatus("idle"), 2000);
    } catch (error) {
      logger.error("Export PNG error:", error);
      setPngStatus("error");
      setTimeout(() => setPngStatus("idle"), 2000);
    }
  };

  const handleCopyCode = async () => {
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
  };

  const handleCopyImage = async () => {
    setCopyImageStatus("loading");

    try {
      const blob = await exportWithKroki(code, renderLanguage, "png");
      const success = await copyImageToClipboard(blob);
      setCopyImageStatus(success ? "success" : "error");
      setTimeout(() => setCopyImageStatus("idle"), 2000);
    } catch (error) {
      logger.error("Copy image error:", error);
      setCopyImageStatus("error");
      setTimeout(() => setCopyImageStatus("idle"), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg animate-in fade-in-0 zoom-in-95 rounded-lg bg-card border border-border p-6 shadow-2xl duration-200">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">导出图表</h2>
            <p className="mt-1 text-sm text-muted-foreground">选择导出格式或复制源代码</p>
          </div>

          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleExportSVG}
            disabled={svgStatus === "loading"}
            className="flex w-full items-center justify-between rounded-lg border border-input bg-muted p-4 text-left transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-indigo-400 dark:text-indigo-300" />
              <div>
                <div className="font-medium text-foreground">导出为 SVG</div>
                <div className="text-sm text-muted-foreground">矢量图形,支持缩放</div>
              </div>
            </div>

            {svgStatus === "success" && <CheckCircle className="h-5 w-5 text-green-400" />}
            {svgStatus === "loading" && (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-indigo-400 dark:border-indigo-300 border-t-transparent" />
            )}
          </button>

          <button
            onClick={handleExportPNG}
            disabled={pngStatus === "loading"}
            className="flex w-full items-center justify-between rounded-lg border border-input bg-muted p-4 text-left transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-violet-400 dark:text-violet-300" />
              <div>
                <div className="font-medium text-foreground">导出为 PNG</div>
                <div className="text-sm text-muted-foreground">位图图像,通用格式</div>
              </div>
            </div>

            {pngStatus === "success" && <CheckCircle className="h-5 w-5 text-green-400" />}
            {pngStatus === "loading" && (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-violet-400 dark:border-violet-300 border-t-transparent" />
            )}
          </button>

          <button
            onClick={handleCopyCode}
            disabled={copyStatus === "loading"}
            className="flex w-full items-center justify-between rounded-lg border border-input bg-muted p-4 text-left transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <Copy className="h-5 w-5 text-green-400" />
              <div>
                <div className="font-medium text-foreground">复制源代码</div>
                <div className="text-sm text-muted-foreground">复制到剪贴板</div>
              </div>
            </div>

            {copyStatus === "success" && <CheckCircle className="h-5 w-5 text-green-400" />}
            {copyStatus === "loading" && (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-green-400 border-t-transparent" />
            )}
          </button>

          <button
            onClick={handleCopyImage}
            disabled={copyImageStatus === "loading"}
            className="flex w-full items-center justify-between rounded-lg border border-input bg-muted p-4 text-left transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <Copy className="h-5 w-5 text-orange-400" />
              <div>
                <div className="font-medium text-foreground">复制图片</div>
                <div className="text-sm text-muted-foreground">PNG 图片到剪贴板</div>
              </div>
            </div>

            {copyImageStatus === "success" && <CheckCircle className="h-5 w-5 text-green-400" />}
            {copyImageStatus === "loading" && (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-orange-400 border-t-transparent" />
            )}
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            关闭
          </Button>
        </div>
      </div>
    </div>
  );
}
