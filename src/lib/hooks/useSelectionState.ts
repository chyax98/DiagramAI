/**
 * useSelectionState Hook
 *
 * 管理三级选择器(AI 模型 → 渲染语言 → 图表类型)的当前选择
 * 实现级联更新逻辑:切换语言时自动更新图表类型
 */

"use client";

import { useState, useCallback } from "react";
import type { RenderLanguage } from "@/types/diagram";
import { getSupportedDiagramTypes, getDefaultDiagramType } from "@/lib/constants/diagram-types";

/**
 * 选择器状态接口
 */
export interface SelectionState {
  /** AI 模型 ID (Level 1) */
  modelId: number | null;

  /** 渲染语言 (Level 2) */
  renderLanguage: RenderLanguage;

  /** 图表类型 (Level 3) */
  diagramType: string;
}

// Hook 实现

/**
 * 选择器状态管理 Hook
 *
 * 提供三级选择器的状态管理和级联更新逻辑
 *
 * @returns {Object} 状态和更新方法
 * @returns {SelectionState} selection - 当前选择状态
 * @returns {Function} setModelId - 更新模型 ID
 * @returns {Function} setRenderLanguage - 更新渲染语言(级联更新图表类型)
 * @returns {Function} setDiagramType - 更新图表类型
 * @returns {Function} setSelection - 直接设置完整状态
 *
 * @example
 * ```typescript
 * const { selection, setRenderLanguage } = useSelectionState();
 *
 * // 切换语言时自动更新图表类型为该语言的第一个类型
 * setRenderLanguage('plantuml');
 * // selection.renderLanguage === 'plantuml'
 * // selection.diagramType === 'sequence' (PlantUML 的第一个类型)
 * ```
 */
export function useSelectionState() {
  // 状态初始化

  const [selection, setSelection] = useState<SelectionState>({
    modelId: null,
    renderLanguage: "mermaid", // 默认 Mermaid
    diagramType: "flowchart", // 默认流程图
  });

  // 更新方法

  /**
   * 更新 AI 模型 ID
   *
   * @param modelId - 新的模型 ID (null 表示未选择)
   */
  const setModelId = useCallback((modelId: number | null) => {
    setSelection((prev) => ({
      ...prev,
      modelId,
    }));
  }, []);

  /**
   * 更新渲染语言
   *
   * 级联逻辑:
   * 1. 更新 renderLanguage
   * 2. 自动更新 diagramType 为该语言的第一个类型
   *
   * @param newLanguage - 新的渲染语言
   */
  const setRenderLanguage = useCallback((newLanguage: RenderLanguage) => {
    const defaultType = getDefaultDiagramType(newLanguage);

    setSelection((prev) => ({
      ...prev,
      renderLanguage: newLanguage,
      diagramType: defaultType, // 级联更新图表类型
    }));
  }, []);

  /**
   * 更新图表类型
   *
   * @param newType - 新的图表类型
   */
  const setDiagramType = useCallback((newType: string) => {
    setSelection((prev) => ({
      ...prev,
      diagramType: newType,
    }));
  }, []);

  // 返回值

  return {
    selection,
    setModelId,
    setRenderLanguage,
    setDiagramType,
    setSelection, // 也提供完整设置方法(用于历史记录加载)
  };
}

/**
 * 验证图表类型是否属于当前渲染语言
 *
 * @param renderLanguage - 渲染语言
 * @param diagramType - 图表类型
 * @returns 是否有效
 *
 * @example
 * ```typescript
 * isValidDiagramType('mermaid', 'flowchart') // true
 * isValidDiagramType('mermaid', 'sequence') // false (PlantUML 的类型)
 * ```
 */
export function isValidDiagramType(renderLanguage: RenderLanguage, diagramType: string): boolean {
  const types = getSupportedDiagramTypes(renderLanguage);
  return types.some((t) => t.value === diagramType);
}
