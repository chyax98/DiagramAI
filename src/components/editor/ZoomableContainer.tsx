/** 可缩放容器 - 封装react-zoom-pan-pinch,仅客户端渲染 */

"use client";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ZoomableContainerProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  children: React.ReactNode;
}

export function ZoomableContainer({
  isFullscreen,
  onToggleFullscreen,
  children,
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
          <div className="flex h-14 items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <div className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
              图表预览
            </div>

            <div className="flex items-center gap-2">
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

          <div className="flex flex-1 items-center justify-center overflow-hidden bg-white">
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
