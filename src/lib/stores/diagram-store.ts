/**
 * 图表状态管理 Store
 *
 * 设计要点：
 * - 基于 Zustand，支持 DevTools 和 localStorage 持久化
 * - 存储图表代码、渲染语言、图表类型、AI 模型选择
 * - 管理生成状态和对话 session
 */

import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import type { RenderLanguage } from "@/types/diagram";
import type { RecommendationResult } from "@/types/recommendation";
import {
  getDefaultDiagramType,
  RENDER_LANGUAGES,
  LANGUAGE_DIAGRAM_TYPES,
} from "@/lib/constants/diagram-types";
import { logger } from "@/lib/utils/logger";

interface DiagramStateData {
  code: string;
  renderLanguage: RenderLanguage;
  diagramType: string;
  selectedModelId: number | null;
  renderError: string | null;
  isGenerating: boolean;
  currentSessionId: number | null;
  // 推荐功能状态
  recommendation: RecommendationResult | null;
  isRecommending: boolean;
}

interface DiagramActions {
  setCode: (code: string) => void;
  setLanguage: (language: RenderLanguage) => void;
  setLanguageWithCascade: (language: RenderLanguage) => void;
  setDiagramType: (type: string) => void;
  setModel: (modelId: number | null) => void;
  setError: (error: string | null) => void;
  startGeneration: () => void;
  finishGeneration: (code: string) => void;
  setSessionId: (sessionId: number | null) => void;
  clearSession: () => void;
  reset: () => void;
  setSelection: (selection: {
    renderLanguage?: RenderLanguage;
    diagramType?: string;
    modelId?: number | null;
  }) => void;
  // 推荐功能 actions
  setRecommendation: (recommendation: RecommendationResult | null) => void;
  startRecommending: () => void;
  finishRecommending: (recommendation: RecommendationResult | null) => void;
  applyRecommendation: () => void;
}

type DiagramState = DiagramStateData & DiagramActions;

// 从单一数据源获取默认值
const defaultLanguage = RENDER_LANGUAGES[0]?.value ?? "mermaid";
const initialState: DiagramStateData = {
  code: "",
  renderLanguage: defaultLanguage,
  diagramType: getDefaultDiagramType(defaultLanguage),
  selectedModelId: null,
  renderError: null,
  isGenerating: false,
  currentSessionId: null,
  recommendation: null,
  isRecommending: false,
};

/**
 * 图表状态管理 Store
 *
 * @example
 * ```tsx
 *  精确订阅单个字段
 * const code = useDiagramStore((state) => state.code);
 *
 *  获取 actions
 * const { setCode, startGeneration } = useDiagramStore();
 *
 *  使用 actions
 * setCode('graph TD\n  A --> B');
 * ```
 */
export const useDiagramStore = create<DiagramState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // 设置图表代码 (同时清除错误，但保持生成状态)
        setCode: (code) =>
          set(
            (_state) => ({
              code,
              renderError: null,
              // 保持 isGenerating 状态不变 (流式渲染期间需要保持 true)
            }),
            false,
            "diagram/setCode" // 使用命名空间格式
          ),

        // 切换渲染语言（不级联）
        setLanguage: (renderLanguage) => set({ renderLanguage }, false, "diagram/setLanguage"),

        setLanguageWithCascade: (renderLanguage) => {
          const defaultType = getDefaultDiagramType(renderLanguage);
          set(
            {
              renderLanguage,
              diagramType: defaultType,
            },
            false,
            "diagram/setLanguageWithCascade"
          );
        },

        setDiagramType: (diagramType) => set({ diagramType }, false, "diagram/setDiagramType"),

        // 选择 AI 模型
        setModel: (selectedModelId) => set({ selectedModelId }, false, "diagram/setModel"),

        // 批量更新选择器状态
        setSelection: (selection) =>
          set(
            (state) => ({
              ...state,
              ...selection,
              ...(selection.modelId !== undefined && { selectedModelId: selection.modelId }),
            }),
            false,
            "diagram/setSelection"
          ),

        // 设置错误信息 (渲染错误不影响生成状态)
        setError: (renderError) => set({ renderError }, false, "diagram/setError"),

        // 开始生成图表 (原子化 test-and-set)
        startGeneration: () =>
          set(
            (state) => {
              // 如果已经在生成中,不更新状态
              if (state.isGenerating) return state;
              return { isGenerating: true, renderError: null };
            },
            false,
            "diagram/startGeneration"
          ),

        // 完成图表生成
        finishGeneration: (code) =>
          set({ isGenerating: false, code }, false, "diagram/finishGeneration"),

        // 设置 session ID
        setSessionId: (currentSessionId) =>
          set({ currentSessionId }, false, "diagram/setSessionId"),

        // 清除 session (新建时)
        clearSession: () => set({ currentSessionId: null }, false, "diagram/clearSession"),

        // 重置所有状态
        reset: () => set(initialState, false, "diagram/reset"),

        // 推荐功能 actions
        setRecommendation: (recommendation) =>
          set({ recommendation }, false, "diagram/setRecommendation"),

        startRecommending: () =>
          set({ isRecommending: true, recommendation: null }, false, "diagram/startRecommending"),

        finishRecommending: (recommendation) =>
          set({ isRecommending: false, recommendation }, false, "diagram/finishRecommending"),

        applyRecommendation: () =>
          set(
            (state) => {
              if (!state.recommendation) return state;

              // 验证推荐的图表类型是否合法
              const { renderLanguage, diagramType } = state.recommendation;
              const supportedTypes = LANGUAGE_DIAGRAM_TYPES[renderLanguage];

              // 检查该语言是否支持推荐的图表类型
              const isValidType = supportedTypes?.some((type) => type.value === diagramType);

              if (!isValidType) {
                // 如果推荐的类型不合法,使用默认类型
                logger.warn(
                  `[applyRecommendation] 推荐的图表类型不合法: ${renderLanguage} + ${diagramType}, 使用默认类型`
                );
                return {
                  renderLanguage,
                  diagramType: getDefaultDiagramType(renderLanguage),
                  recommendation: null,
                };
              }

              return {
                renderLanguage,
                diagramType,
                recommendation: null, // 清除推荐
              };
            },
            false,
            "diagram/applyRecommendation"
          ),
      }),
      {
        name: "diagram-storage", // localStorage key
        storage: createJSONStorage(() => localStorage), // 显式指定 localStorage
        // 只持久化用户偏好设置，不持久化运行时状态
        partialize: (state) => ({
          renderLanguage: state.renderLanguage,
          diagramType: state.diagramType,
          selectedModelId: state.selectedModelId,
          currentSessionId: state.currentSessionId, // 持久化 sessionId
        }),
      }
    ),
    { name: "DiagramStore" } // DevTools 中显示的名称
  )
);

export type { DiagramState, DiagramStateData, DiagramActions };
