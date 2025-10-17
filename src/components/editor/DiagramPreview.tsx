/** 图表预览 - 使用Kroki API实时渲染,支持缩放平移和性能优化(防抖+缓存) */

"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import mermaid from "mermaid";

import type { RenderLanguage } from "@/types/diagram";
import type { ExportActions } from "@/hooks/useExportActions";
import { KROKI_MAX_RETRIES, KROKI_RETRY_DELAY, KROKI_TIMEOUT } from "@/lib/constants/env";
import { generateKrokiURL, type KrokiDiagramType } from "@/lib/utils/kroki";
import { logger } from "@/lib/utils/logger";
import { useTheme } from "@/contexts/ThemeContext";
import { ZoomableContainer } from "./ZoomableContainer";

interface DiagramPreviewProps {
  code: string;
  renderLanguage: RenderLanguage;
  onError: (error: string | null) => void;
  onSvgRendered?: (svg: string) => void; // 新增：SVG 渲染完成回调
  exportActions?: ExportActions; // 导出操作
}

/**
 * Mermaid 本地渲染
 * @param code - Mermaid 图表代码
 * @param theme - 主题 (light/dark)
 * @returns SVG 字符串
 */
async function renderWithMermaid(code: string, theme: "light" | "dark"): Promise<string> {
  try {
    // 初始化 Mermaid 配置
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === "dark" ? "dark" : "default",
      securityLevel: "loose",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
    });

    // ⭐ 步骤1: 先用 parse() 验证语法 (会抛出异常)
    try {
      await mermaid.parse(code);
    } catch (parseError) {
      const errorMessage =
        parseError instanceof Error ? parseError.message : "Mermaid syntax error";
      logger.error("❌ [Mermaid] 语法验证失败:", errorMessage);
      return Promise.reject(new Error(errorMessage));
    }

    // ⭐ 步骤2: 语法正确,执行渲染
    // 生成唯一 ID
    const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    // 渲染图表
    const { svg } = await mermaid.render(id, code);

    // ⭐ 检测 Mermaid 是否返回了错误 SVG（包含错误信息的 SVG）
    // Mermaid 11.x 在遇到语法错误时会返回包含 "Syntax error in text" 的 SVG 而不是抛出异常
    const svgLowerCase = svg.toLowerCase();
    const errorIndicators = [
      "syntax error", // 不区分大小写
      "parse error",
      "error:",
      "mermaid version", // 错误 SVG 通常包含版本信息
    ];

    const hasError = errorIndicators.some((indicator) => svgLowerCase.includes(indicator));

    // 额外检查: 错误 SVG 通常包含 <path> 的地雷/警告图标
    const hasErrorIcon = svg.includes('d="M12 9v2m0 4h.01');

    if (hasError || hasErrorIcon) {
      // 从 SVG 中提取错误信息
      const errorMatch =
        svg.match(/>(Syntax error[^<]*)</i) ||
        svg.match(/>(Error:[^<]*)</i) ||
        svg.match(/>(Parse error[^<]*)</i);
      const errorMessage = errorMatch ? errorMatch[1] : "Mermaid syntax error";
      logger.error("❌ [Mermaid] 渲染返回错误 SVG:", errorMessage);
      return Promise.reject(new Error(errorMessage));
    }

    logger.info("✅ [Mermaid] 本地渲染成功");
    return svg;
  } catch (error) {
    logger.error("❌ [Mermaid] 本地渲染失败:", error);
    const errorMessage = error instanceof Error ? error.message : "Mermaid rendering failed";
    return Promise.reject(new Error(`Mermaid 渲染失败: ${errorMessage}`));
  }
}

/**
 * Kroki 远程渲染 (用于除 Mermaid 外的所有图表)
 */
async function renderWithKroki(
  code: string,
  diagramType: RenderLanguage,
  retries = KROKI_MAX_RETRIES
): Promise<string> {
  const url = generateKrokiURL(code, diagramType as KrokiDiagramType, "svg");

  // 创建 AbortController 用于超时控制
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), KROKI_TIMEOUT);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "image/svg+xml" },
      signal: controller.signal, // 添加超时信号
    });

    // 清除超时定时器
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`❌ [Kroki] API 错误 ${response.status}:`, errorText);
      const error = new Error(
        `Kroki 渲染失败 (${response.status}): ${errorText || response.statusText}`
      );
      return Promise.reject(error);
    }

    return await response.text();
  } catch (error) {
    // 清除超时定时器
    clearTimeout(timeoutId);

    // 检查是否是超时错误
    if (error instanceof Error && error.name === "AbortError") {
      logger.error(`⏱️ [Kroki] 请求超时 (${KROKI_TIMEOUT}ms)`);
      const timeoutError = new Error(`Kroki 渲染超时 (${KROKI_TIMEOUT}ms)`);
      return Promise.reject(timeoutError);
    }

    logger.error(`❌ [Kroki] 渲染失败 (剩余重试: ${retries - 1})`, error);
    if (retries > 1) {
      await new Promise((resolve) => setTimeout(resolve, KROKI_RETRY_DELAY));
      return renderWithKroki(code, diagramType, retries - 1);
    }

    return Promise.reject(error);
  }
}

function hashCode(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash; // 转换为 32 位整数
  }
  return hash.toString(36);
}

export function DiagramPreview({
  code,
  renderLanguage,
  onError,
  onSvgRendered,
  exportActions,
}: DiagramPreviewProps) {
  const { effectiveTheme } = useTheme(); // 获取当前主题
  const [svgContent, setSvgContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [lastRetryTime, setLastRetryTime] = useState(0); // 防抖保护：记录上次重试时间

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderCache = useRef<Map<string, string>>(new Map());

  // 缓存指纹包含主题信息 (Mermaid 渲染结果依赖主题)
  const codeFingerprint = useMemo(() => {
    return hashCode(code + "::" + renderLanguage + "::" + effectiveTheme);
  }, [code, renderLanguage, effectiveTheme]);

  const isRenderingRef = useRef(false);

  const renderDiagram = useCallback(
    async (svgCallback?: (svg: string) => void) => {
      if (isRenderingRef.current) {
        return;
      }

      if (!code.trim()) {
        setSvgContent("");
        onError(null);
        return;
      }

      const cached = renderCache.current.get(codeFingerprint);
      if (cached) {
        setSvgContent(cached);
        onError(null);
        return;
      }

      isRenderingRef.current = true;
      setIsLoading(true);
      onError(null);

      try {
        // 渲染决策: Mermaid 使用本地渲染，其他使用 Kroki
        const svg =
          renderLanguage === "mermaid"
            ? await renderWithMermaid(code, effectiveTheme)
            : await renderWithKroki(code, renderLanguage);

        // ⭐ 双重防御: 在设置 svgContent 之前再次检查是否包含错误信息
        // 防止万一 renderWithMermaid 没有正确拒绝错误 SVG
        const errorIndicators = ["Syntax error", "Parse error", "mermaid version"];
        if (errorIndicators.some((indicator) => svg.includes(indicator))) {
          throw new Error("Mermaid 返回的 SVG 包含错误信息");
        }

        setSvgContent(svg);
        svgCallback?.(svg); // 通知父组件 SVG 已渲染
        onError(null); // ⭐ 清除之前的错误信息

        if (renderCache.current.size >= 20) {
          const firstKey = renderCache.current.keys().next().value;
          if (firstKey) {
            renderCache.current.delete(firstKey);
          }
        }
        renderCache.current.set(codeFingerprint, svg);
      } catch (error) {
        logger.error("❌ [DiagramPreview] 渲染失败:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown rendering error";
        onError(errorMessage);
        setSvgContent("");
        svgCallback?.(""); // ⭐ 修复：通知父组件清空 SVG 状态，避免导出历史成功的图表
      } finally {
        setIsLoading(false);
        isRenderingRef.current = false;
      }
    },
    [code, renderLanguage, effectiveTheme, onError, codeFingerprint]
  );

  /**
   * 手动重试渲染
   * 绕过缓存和防抖，立即重新渲染，带防抖保护（5秒内最多1次）
   */
  const handleManualRetry = useCallback(() => {
    const now = Date.now();
    const MIN_RETRY_INTERVAL = 5000; // 5秒防抖

    // 防抖保护
    if (now - lastRetryTime < MIN_RETRY_INTERVAL) {
      logger.warn(
        `⚠️ [DiagramPreview] 重试过于频繁，请等待 ${Math.ceil((MIN_RETRY_INTERVAL - (now - lastRetryTime)) / 1000)} 秒`
      );
      return;
    }

    logger.info("🔄 [DiagramPreview] 手动重试渲染");
    setLastRetryTime(now);

    // 清除缓存，强制重新渲染
    renderCache.current.delete(codeFingerprint);
    renderDiagram(onSvgRendered);
  }, [codeFingerprint, renderDiagram, lastRetryTime, onSvgRendered]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      renderDiagram(onSvgRendered);
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [renderDiagram, onSvgRendered]);

  if (!isMounted) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <div className="text-muted-foreground">初始化预览组件...</div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-full w-full flex-col bg-muted/30 ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      <ZoomableContainer
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        exportActions={exportActions}
      >
        {isLoading ? (
          <div className="text-muted-foreground">渲染中...</div>
        ) : svgContent ? (
          <div
            dangerouslySetInnerHTML={{ __html: svgContent }}
            className="diagram-preview-container select-none"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            {code.trim() ? (
              // 有代码但渲染失败
              <>
                <div className="flex flex-col items-center gap-2 text-center">
                  <svg
                    className="h-12 w-12 text-muted-foreground/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <p className="text-sm text-muted-foreground">渲染失败</p>
                  <p className="text-xs text-muted-foreground/60">可能是网络问题或代码语法错误</p>
                </div>
                <button
                  onClick={handleManualRetry}
                  disabled={isLoading}
                  className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  重新渲染
                </button>
              </>
            ) : (
              // 无代码
              <p className="text-muted-foreground/60">暂无内容</p>
            )}
          </div>
        )}
      </ZoomableContainer>
    </div>
  );
}
