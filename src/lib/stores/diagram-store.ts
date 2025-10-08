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
import { getDefaultDiagramType, RENDER_LANGUAGES } from "@/lib/constants/diagram-types";

interface DiagramStateData {
  code: string;
  renderLanguage: RenderLanguage;
  diagramType: string;
  selectedModelId: number | null;
  renderError: string | null;
  isGenerating: boolean;
  currentSessionId: number | null;
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

        // 开始生成图表
        startGeneration: () =>
          set({ isGenerating: true, renderError: null }, false, "diagram/startGeneration"),

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
