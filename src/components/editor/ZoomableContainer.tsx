/** 可缩放容器 - 封装react-zoom-pan-pinch,仅客户端渲染 */

"use client";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCcw,
  Download,
  Copy,
  FileImage,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExportActions } from "@/hooks/useExportActions";

interface ZoomableContainerProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  children: React.ReactNode;
  exportActions?: ExportActions; // 导出操作
}

export function ZoomableContainer({
  isFullscreen,
  onToggleFullscreen,
  children,
  exportActions,
}: ZoomableContainerProps) {
  return (
    <TransformWrapper
      initialScale={0.8}
      minScale={0.1}
      maxScale={5}
      centerOnInit
      limitToBounds={false}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <>
          <div className="flex h-14 items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-foreground">
            <div className="text-sm font-medium">图表预览</div>

            <div className="flex items-center gap-2">
              {/* 导出操作按钮组 */}
              {exportActions && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={exportActions.exportSVG}
                    disabled={!exportActions.hasSvgContent || exportActions.svgStatus === "loading"}
                    className="h-8 gap-1.5"
                    title={!exportActions.hasSvgContent ? "请先成功渲染图表" : "下载 SVG"}
                  >
                    {exportActions.svgStatus === "loading" ? (
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : exportActions.svgStatus === "success" ? (
                      <FileImage className="h-4 w-4 text-green-500" />
                    ) : (
                      <FileImage className="h-4 w-4" />
                    )}
                    <span className="text-xs">SVG</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={exportActions.exportPNG}
                    disabled={!exportActions.hasSvgContent || exportActions.pngStatus === "loading"}
                    className="h-8 gap-1.5"
                    title={!exportActions.hasSvgContent ? "请先成功渲染图表" : "下载 PNG"}
                  >
                    {exportActions.pngStatus === "loading" ? (
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : exportActions.pngStatus === "success" ? (
                      <Download className="h-4 w-4 text-green-500" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    <span className="text-xs">PNG</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={exportActions.copyImage}
                    disabled={!exportActions.hasSvgContent || exportActions.copyImageStatus === "loading"}
                    className="h-8 gap-1.5"
                    title={!exportActions.hasSvgContent ? "请先成功渲染图表" : "复制图片到剪贴板"}
                  >
                    {exportActions.copyImageStatus === "loading" ? (
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : exportActions.copyImageStatus === "success" ? (
                      <Copy className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="text-xs">复制图片</span>
                  </Button>

                  <div className="h-6 w-px bg-border mx-1" />
                </>
              )}

              {/* 缩放和全屏按钮 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => zoomOut()}
                className="h-8 w-8 p-0"
                title="缩小"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => resetTransform()}
                className="h-8 gap-1.5 text-xs"
                title="重置缩放"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                100%
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => zoomIn()}
                className="h-8 w-8 p-0"
                title="放大"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFullscreen}
                className="h-8 w-8 p-0"
                title={isFullscreen ? "退出全屏" : "全屏"}
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center overflow-hidden bg-white dark:bg-slate-900">
            <TransformComponent
              wrapperClass="!w-full !h-full"
              contentClass="!w-full !h-full flex items-center justify-center"
            >
              {children}
            </TransformComponent>
          </div>
        </>
      )}
    </TransformWrapper>
  );
}
