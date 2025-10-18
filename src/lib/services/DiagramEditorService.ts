/**
 * 图表编辑器业务逻辑层
 *
 * 职责：
 * - 处理图表生成/调整/修复/保存的业务逻辑
 * - 与后端 API 通信
 * - 数据验证和转换
 *
 * 不包含：
 * - UI 交互逻辑 (toast、dialog)
 * - 状态管理 (Zustand store)
 * - 路由导航
 */

import { apiClient } from "@/lib/utils/api-client";
import type { RenderLanguage } from "@/lib/constants/diagram-types";
import { logger } from "@/lib/utils/logger";

// ========== 请求参数类型 ==========

/**
 * 生成图表请求参数
 */
export interface GenerateDiagramParams {
  /** 用户输入的图表描述 */
  input: string;
  /** 渲染语言 (如 mermaid, plantuml) */
  renderLanguage: RenderLanguage;
  /** 图表类型 (如 flowchart, sequence) */
  diagramType: string;
  /** 使用的 AI 模型 ID */
  modelId: number;
}

/**
 * 调整图表请求参数
 */
export interface AdjustDiagramParams {
  /** 调整指令 */
  input: string;
  /** 当前会话 ID */
  sessionId: number | null;
  /** 渲染语言 */
  renderLanguage: RenderLanguage;
  /** 使用的 AI 模型 ID */
  modelId: number;
}

/**
 * 修复图表请求参数
 */
export interface FixDiagramParams {
  /** 渲染错误信息 */
  renderError: string;
  /** 当前会话 ID */
  sessionId: number | null;
  /** 渲染语言 */
  renderLanguage: RenderLanguage;
  /** 使用的 AI 模型 ID */
  modelId: number;
}

/**
 * 保存图表请求参数
 */
export interface SaveDiagramParams {
  /** 图表代码 */
  code: string;
  /** 渲染语言 */
  renderLanguage: RenderLanguage;
  /** 图表类型 */
  diagramType: string;
  /** 使用的 AI 模型 ID (可选) */
  modelId?: number;
  /** 输入文本 (默认为"手动编辑") */
  inputText?: string;
}

// ========== 响应类型 ==========

/**
 * 生成图表响应
 */
export interface GenerateDiagramResult {
  /** 生成的图表代码 */
  code: string;
  /** 会话 ID */
  sessionId: number;
}

/**
 * 调整图表响应
 */
export interface AdjustDiagramResult {
  /** 调整后的图表代码 */
  code: string;
  /** 会话 ID */
  sessionId: number;
  /** 当前轮次 */
  roundCount: number;
}

/**
 * 修复图表响应
 */
export interface FixDiagramResult {
  /** 修复后的图表代码 */
  code: string;
  /** 会话 ID */
  sessionId: number;
}

/**
 * 保存图表响应
 */
export interface SaveDiagramResult {
  /** 历史记录 ID */
  historyId: number;
}

// ========== Service 类 ==========

/**
 * 图表编辑器业务逻辑服务
 *
 * @example
 * ```typescript
 * const service = new DiagramEditorService();
 *
 * // 生成图表
 * const result = await service.generate({
 *   input: "用户登录流程",
 *   renderLanguage: "mermaid",
 *   diagramType: "sequence",
 *   modelId: 1,
 * });
 *
 * // 调整图表
 * const adjusted = await service.adjust({
 *   input: "添加密码重置功能",
 *   sessionId: result.sessionId,
 *   renderLanguage: "mermaid",
 *   modelId: 1,
 * });
 *
 * // 修复图表
 * const fixed = await service.fix({
 *   renderError: "Syntax error at line 5",
 *   sessionId: result.sessionId,
 *   renderLanguage: "mermaid",
 *   modelId: 1,
 * });
 *
 * // 保存图表
 * await service.save({
 *   code: result.code,
 *   renderLanguage: "mermaid",
 *   diagramType: "sequence",
 *   modelId: 1,
 * });
 * ```
 */
export class DiagramEditorService {
  /**
   * 生成新图表
   *
   * @param params - 生成参数
   * @returns 生成的代码和会话 ID
   * @throws Error 如果参数无效或 API 调用失败
   */
  async generate(params: GenerateDiagramParams): Promise<GenerateDiagramResult> {
    // 参数验证
    this._validateGenerateParams(params);

    logger.info("📝 调用图表生成服务:", {
      input: params.input.slice(0, 50) + "...",
      renderLanguage: params.renderLanguage,
      diagramType: params.diagramType,
      modelId: params.modelId,
    });

    try {
      // 调用后端 API
      const result = await apiClient.post<GenerateDiagramResult>("/api/chat", {
        userMessage: params.input,
        renderLanguage: params.renderLanguage,
        diagramType: params.diagramType,
        modelId: params.modelId,
        taskType: "generate", // 显式指定任务类型
      });

      logger.info("✅ 图表生成成功:", {
        sessionId: result.sessionId,
        codeLength: result.code.length,
      });

      return result;
    } catch (error) {
      logger.error("❌ 图表生成失败:", error);
      throw error;
    }
  }

  /**
   * 调整现有图表
   *
   * @param params - 调整参数
   * @returns 调整后的代码和会话信息
   * @throws Error 如果参数无效或 API 调用失败
   */
  async adjust(params: AdjustDiagramParams): Promise<AdjustDiagramResult> {
    // 参数验证
    this._validateAdjustParams(params);

    logger.info("🔧 调用图表调整服务:", {
      input: params.input.slice(0, 50) + "...",
      sessionId: params.sessionId,
      renderLanguage: params.renderLanguage,
      modelId: params.modelId,
    });

    try {
      // 调用后端 API
      const result = await apiClient.post<AdjustDiagramResult>("/api/chat", {
        sessionId: params.sessionId,
        userMessage: params.input,
        renderLanguage: params.renderLanguage,
        modelId: params.modelId,
        taskType: "adjust", // 显式指定任务类型
      });

      logger.info("✅ 图表调整成功:", {
        sessionId: result.sessionId,
        roundCount: result.roundCount,
        codeLength: result.code.length,
      });

      return result;
    } catch (error) {
      logger.error("❌ 图表调整失败:", error);
      throw error;
    }
  }

  /**
   * 修复图表渲染错误
   *
   * 设计理由：
   * 1. 依赖任务标记 <<<SYSTEM_INSTRUCTION: FIX_SYNTAX_ERRORS_ONLY>>> 指导 AI 行为
   * 2. L1 prompt 中已详细说明修复任务的执行策略和禁止项
   * 3. 用户消息只需提供错误信息，避免冗余指令（减少 token 消耗）
   *
   * @param params - 修复参数
   * @returns 修复后的代码和会话 ID
   * @throws Error 如果参数无效或 API 调用失败
   *
   * @example
   * ```typescript
   * // Kroki 返回错误: "Syntax error: invalid node ID '开始'"
   * const result = await service.fix({
   *   renderError: "Syntax error: invalid node ID '开始'",
   *   sessionId: 123,
   *   renderLanguage: "mermaid",
   *   modelId: 1,
   * });
   * // AI 收到的完整消息：
   * // <<<SYSTEM_INSTRUCTION: FIX_SYNTAX_ERRORS_ONLY>>>
   * // 渲染错误：Syntax error: invalid node ID '开始'
   * ```
   */
  async fix(params: FixDiagramParams): Promise<FixDiagramResult> {
    // 参数验证
    this._validateFixParams(params);

    // ✅ 简化消息：只提供错误信息，依赖任务标记 + L1 prompt 指导行为
    const fixMessage = `渲染错误：${params.renderError}`;

    logger.info("🔨 调用图表修复服务:", {
      renderError: params.renderError.slice(0, 100) + "...",
      sessionId: params.sessionId,
      renderLanguage: params.renderLanguage,
      modelId: params.modelId,
    });

    try {
      // 调用后端 API
      const result = await apiClient.post<FixDiagramResult>("/api/chat", {
        sessionId: params.sessionId,
        userMessage: fixMessage, // ✅ 简化后的修复消息（节省 ~100 tokens）
        renderLanguage: params.renderLanguage,
        modelId: params.modelId,
        taskType: "fix", // ⭐ 显式指定：修复任务（会注入任务标记）
        renderError: params.renderError, // ⭐ 传递渲染错误，用于自动记录失败日志
      });

      logger.info("✅ 图表修复成功:", {
        sessionId: result.sessionId,
        codeLength: result.code.length,
      });

      return result;
    } catch (error) {
      logger.error("❌ 图表修复失败:", error);
      throw error;
    }
  }

  /**
   * 保存图表到历史记录
   *
   * @param params - 保存参数
   * @returns 历史记录 ID
   * @throws Error 如果参数无效或 API 调用失败
   */
  async save(params: SaveDiagramParams): Promise<SaveDiagramResult> {
    // 参数验证
    this._validateSaveParams(params);

    logger.info("💾 调用图表保存服务:", {
      codeLength: params.code.length,
      renderLanguage: params.renderLanguage,
      diagramType: params.diagramType,
      modelId: params.modelId,
    });

    try {
      // 调用后端 API
      const result = await apiClient.post<SaveDiagramResult>("/api/history", {
        inputText: params.inputText || "手动编辑",
        renderLanguage: params.renderLanguage,
        diagramType: params.diagramType,
        generatedCode: params.code,
        modelId: params.modelId,
      });

      logger.info("✅ 图表保存成功:", {
        historyId: result.historyId,
      });

      return result;
    } catch (error) {
      logger.error("❌ 图表保存失败:", error);
      throw error;
    }
  }

  // ========== 私有方法：参数验证 ==========

  private _validateGenerateParams(params: GenerateDiagramParams): void {
    if (!params.input || !params.input.trim()) {
      throw new Error("图表描述不能为空");
    }
    if (!params.renderLanguage) {
      throw new Error("渲染语言不能为空");
    }
    if (!params.diagramType) {
      throw new Error("图表类型不能为空");
    }
    if (!params.modelId) {
      throw new Error("模型 ID 不能为空");
    }
  }

  private _validateAdjustParams(params: AdjustDiagramParams): void {
    if (!params.input || !params.input.trim()) {
      throw new Error("调整指令不能为空");
    }
    if (!params.renderLanguage) {
      throw new Error("渲染语言不能为空");
    }
    if (!params.modelId) {
      throw new Error("模型 ID 不能为空");
    }
    // sessionId 允许为 null (首次调整时)
  }

  private _validateFixParams(params: FixDiagramParams): void {
    if (!params.renderError || !params.renderError.trim()) {
      throw new Error("渲染错误信息不能为空");
    }
    if (!params.renderLanguage) {
      throw new Error("渲染语言不能为空");
    }
    if (!params.modelId) {
      throw new Error("模型 ID 不能为空");
    }
    // sessionId 允许为 null (首次修复时)
  }

  private _validateSaveParams(params: SaveDiagramParams): void {
    if (!params.code || !params.code.trim()) {
      throw new Error("图表代码不能为空");
    }
    if (!params.renderLanguage) {
      throw new Error("渲染语言不能为空");
    }
    if (!params.diagramType) {
      throw new Error("图表类型不能为空");
    }
    // modelId 允许为 undefined (手动编辑时可能没有)
  }
}

// ========== 单例导出 ==========

/**
 * 图表编辑器服务单例
 *
 * 推荐在 Hook 或 Component 中使用
 */
export const diagramEditorService = new DiagramEditorService();
