/** 图表生成服务 - 统一 chat() 接口处理首次生成和多轮调整 */

import { generateText, type LanguageModel } from "ai";
import { getDatabaseInstance } from "@/lib/db/client";
import { ModelRepository } from "@/lib/repositories/ModelRepository";
import { ChatSessionRepository } from "@/lib/repositories/ChatSessionRepository";
import { getAIProvider, validateProviderConfig } from "@/lib/ai/provider-factory";
import { cleanCode } from "@/lib/utils/code-cleaner";
import type { ChatSessionData, ChatMessage, RenderLanguage } from "@/types/database";
import { getGeneratePrompt } from "@/lib/constants/prompts";
import { MAX_CHAT_ROUNDS, AI_TEMPERATURE, AI_MAX_RETRIES } from "@/lib/constants/env";
import { logger } from "@/lib/utils/logger";
import { FailureLogService } from "./FailureLogService";

interface PrepareResult {
  model: LanguageModel;
  modelConfig: {
    id: number;
    provider: string;
    model_id: string;
    api_key: string;
    api_endpoint: string | null;
  };
}

/**
 * 任务类型定义
 * - generate: 从零开始生成新图表
 * - adjust: 基于现有代码进行调整优化
 * - fix: 修复语法错误（保持逻辑不变）
 */
export type TaskType = "generate" | "adjust" | "fix";

export interface ChatParams {
  userId: number;
  userMessage: string;
  modelId: number;
  renderLanguage: RenderLanguage;
  sessionId?: number; // 初始没有生成 session Id
  diagramType?: string; // 可选: AI 可以自动推断图表类型
  taskType?: TaskType; // ⭐ 任务类型（由前端按钮决定）
  renderError?: string | null; // 渲染错误信息（用于失败日志记录）
}

export interface ChatResult {
  code: string;
  sessionId: number;
  roundCount: number;
}

export class DiagramGenerationService {
  /**
   * 记录渲染失败到日志文件
   *
   * 设计理由：
   * 1. 只在用户点击"修复"按钮时记录（高质量数据）
   * 2. 拥有完整上下文（session history, user input, model info）
   * 3. 异步执行，失败不影响主流程
   *
   * @param params - 聊天参数（包含 renderError）
   * @param sessionData - 会话数据（包含 history 和 currentCode）
   */
  private async _logRenderFailure(params: ChatParams, sessionData: ChatSessionData): Promise<void> {
    try {
      const failureLogService = new FailureLogService();
      const db = getDatabaseInstance();
      const modelRepo = new ModelRepository(db);

      // 获取模型信息
      const model = modelRepo.findById(params.modelId);
      const modelInfo = model
        ? { provider: model.provider, modelId: model.model_id }
        : { provider: "unknown", modelId: "unknown" };

      // 从 session history 提取原始用户输入
      const firstUserMessage = sessionData.chatHistory.find((msg) => msg.role === "user");
      const inputText = firstUserMessage?.content || "未知输入";

      await failureLogService.logFailure({
        timestamp: new Date().toISOString(),
        userId: params.userId,
        input: inputText,
        diagramType: sessionData.diagramType!,
        renderLanguage: params.renderLanguage,
        generatedCode: sessionData.currentCode,
        error: params.renderError!,
        errorType: failureLogService.classifyError(params.renderError!),
        modelInfo: modelInfo,
        sessionId: params.sessionId,
      });

      logger.info("[FailureLog] 已记录渲染失败", {
        userId: params.userId,
        sessionId: params.sessionId,
        errorType: failureLogService.classifyError(params.renderError!),
      });
    } catch (error) {
      // 日志记录失败不应影响主流程
      logger.error("[FailureLog] 记录失败日志时出错:", error);
    }
  }

  /**
   * 构建任务标记提示
   *
   * 任务标记由**前端按钮类型**决定，而非 sessionId 推断
   *
   * 设计理由：
   * 1. 使用醒目的 <<<>>> 格式，提高 AI 识别度
   * 2. SYSTEM_INSTRUCTION 前缀强调这是系统级指令
   * 3. 英文关键词避免编码问题，便于跨语言场景
   *
   * @param taskType - 任务类型（generate/adjust/fix）
   * @returns 任务标记字符串
   *
   * @example
   * _buildTaskHint('generate') // => "<<<SYSTEM_INSTRUCTION: GENERATE_NEW_DIAGRAM>>>"
   * _buildTaskHint('adjust')   // => "<<<SYSTEM_INSTRUCTION: ADJUST_EXISTING_DIAGRAM>>>"
   * _buildTaskHint('fix')      // => "<<<SYSTEM_INSTRUCTION: FIX_SYNTAX_ERRORS_ONLY>>>"
   */
  private _buildTaskHint(taskType: TaskType): string {
    const taskMap: Record<TaskType, string> = {
      generate: "<<<SYSTEM_INSTRUCTION: GENERATE_NEW_DIAGRAM>>>",
      adjust: "<<<SYSTEM_INSTRUCTION: ADJUST_EXISTING_DIAGRAM>>>",
      fix: "<<<SYSTEM_INSTRUCTION: FIX_SYNTAX_ERRORS_ONLY>>>",
    };
    return taskMap[taskType];
  }

  private async validateAndPrepare(userId: number, modelId: number): Promise<PrepareResult> {
    const db = getDatabaseInstance();
    const modelRepo = new ModelRepository(db);
    const modelConfig = modelRepo.findById(modelId);

    if (!modelConfig || modelConfig.user_id !== userId) {
      throw new Error("AI 模型不存在或无权访问");
    }

    validateProviderConfig({
      provider: modelConfig.provider,
      model_id: modelConfig.model_id,
      api_key: modelConfig.api_key,
    });

    const model = getAIProvider({
      provider: modelConfig.provider,
      model_id: modelConfig.model_id,
      api_key: modelConfig.api_key,
      api_endpoint: modelConfig.api_endpoint,
    });

    return { model, modelConfig };
  }

  /** 统一对话接口 - 任务类型由前端按钮决定，或根据 sessionId 自动推断 */
  async chat(params: ChatParams): Promise<ChatResult> {
    // 输入验证已在 API 层通过 Zod Schema 完成，此处无需重复验证
    const { model } = await this.validateAndPrepare(params.userId, params.modelId);
    const db = getDatabaseInstance();
    const sessionRepo = new ChatSessionRepository(db);

    // ⭐ 决策逻辑：优先使用显式 taskType，否则根据 sessionId 自动推断任务类型
    const taskType: TaskType = params.taskType || (!params.sessionId ? "generate" : "adjust");

    // 根据任务类型路由
    if (taskType === "generate") {
      return this._generateFirst(params, taskType, model, sessionRepo);
    } else {
      // adjust 或 fix 都走 continueChat（区别在任务标记）
      return this._continueChat(params, taskType, model, sessionRepo);
    }
  }

  private async _generateFirst(
    params: ChatParams,
    taskType: TaskType,
    model: LanguageModel,
    sessionRepo: ChatSessionRepository
  ): Promise<ChatResult> {
    // 构建任务标记（由按钮类型决定）
    const taskHint = this._buildTaskHint(taskType);

    // ✅ 开发环境验证：任务标记注入
    if (process.env.NODE_ENV === "development") {
      logger.debug("[DiagramGenerationService] 生成 - 任务类型:", taskType);
      logger.debug("[DiagramGenerationService] 生成 - 任务标记:", taskHint);
      logger.debug("[DiagramGenerationService] 生成 - 用户消息:", params.userMessage);
      logger.debug(
        "[DiagramGenerationService] 生成 - 注入内容:",
        `${taskHint}\n${params.userMessage}`
      );
      logger.debug("[DiagramGenerationService] 生成 - 图表类型:", params.diagramType);
      logger.debug("[DiagramGenerationService] 生成 - 渲染语言:", params.renderLanguage);
    }

    // 验证 diagram type 必填
    if (!params.diagramType) {
      throw new Error("图表类型不能为空");
    }

    const { text: generatedCode } = await generateText({
      model,
      system: getGeneratePrompt(params.renderLanguage, params.diagramType),
      messages: [
        {
          role: "user",
          content: `${taskHint}\n${params.userMessage}`, // 注入任务标记
        },
      ],
      temperature: AI_TEMPERATURE,
      maxRetries: AI_MAX_RETRIES,
    });

    // 清理 AI 生成的代码 (移除 markdown 代码块标记等)
    const code = cleanCode(generatedCode, params.renderLanguage);

    // 存储时使用原始消息（不包含任务标记）
    const sessionData: ChatSessionData = {
      chatHistory: [
        {
          role: "user",
          content: params.userMessage, // 原始消息
          timestamp: new Date().toISOString(),
        },
        {
          role: "assistant",
          content: code,
          timestamp: new Date().toISOString(),
        },
      ],
      currentCode: code,
      renderLanguage: params.renderLanguage,
      diagramType: params.diagramType, // ✅ 保存图表类型到会话数据
    };

    const session = sessionRepo.create({
      userId: params.userId,
      sessionData: JSON.stringify(sessionData),
      roundCount: 1,
    });

    return {
      code,
      sessionId: session.id,
      roundCount: 1,
    };
  }

  private async _continueChat(
    params: ChatParams,
    taskType: TaskType,
    model: LanguageModel,
    sessionRepo: ChatSessionRepository
  ): Promise<ChatResult> {
    const session = sessionRepo.findById(params.sessionId!);
    if (!session || session.user_id !== params.userId) {
      throw new Error("会话不存在或无权访问");
    }

    const sessionData: ChatSessionData = JSON.parse(session.session_data);

    const currentRound = session.round_count;
    if (currentRound >= MAX_CHAT_ROUNDS) {
      throw new Error(`已达到最大对话轮次 (${MAX_CHAT_ROUNDS})`);
    }

    // ⭐ 用户点击修复按钮时,自动记录失败日志
    if (taskType === "fix" && params.renderError && params.renderError.trim()) {
      await this._logRenderFailure(params, sessionData);
    }

    // 重建历史对话（使用原始消息）
    const messages: Array<{ role: "user" | "assistant"; content: string }> = [];

    sessionData.chatHistory.forEach((msg) => {
      messages.push({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      });
    });

    // 构建任务标记（由按钮类型决定）
    const taskHint = this._buildTaskHint(taskType);

    // ✅ 开发环境验证：任务标记注入
    if (process.env.NODE_ENV === "development") {
      logger.debug("[DiagramGenerationService] 多轮对话 - 任务类型:", taskType);
      logger.debug("[DiagramGenerationService] 多轮对话 - 任务标记:", taskHint);
      logger.debug("[DiagramGenerationService] 多轮对话 - 用户消息:", params.userMessage);
      logger.debug(
        "[DiagramGenerationService] 多轮对话 - 注入内容:",
        `${taskHint}\n${params.userMessage}`
      );
      logger.debug("[DiagramGenerationService] 多轮对话 - 会话轮次:", currentRound + 1);
      logger.debug("[DiagramGenerationService] 多轮对话 - 历史消息数:", messages.length);
    }

    messages.push({
      role: "user",
      content: `${taskHint}\n${params.userMessage}`, // 注入任务标记
    });

    // 验证会话数据完整性
    if (!sessionData.diagramType) {
      throw new Error("会话数据损坏：缺少图表类型信息");
    }

    const result = await generateText({
      model,
      system: getGeneratePrompt(params.renderLanguage, sessionData.diagramType),
      messages,
      temperature: AI_TEMPERATURE,
      maxRetries: AI_MAX_RETRIES,
    });

    const adjustedCode = cleanCode(result.text, params.renderLanguage);

    // 存储时使用原始消息（不包含任务标记）
    const newUserMessage: ChatMessage = {
      role: "user",
      content: params.userMessage, // 原始消息
      timestamp: new Date().toISOString(),
    };

    const assistantMessage: ChatMessage = {
      role: "assistant",
      content: adjustedCode,
      timestamp: new Date().toISOString(),
    };

    sessionData.chatHistory.push(newUserMessage, assistantMessage);
    sessionData.currentCode = adjustedCode;
    // 同步更新 renderLanguage (可能切换了语言)
    sessionData.renderLanguage = params.renderLanguage;
    // diagramType 不应该改变,保持会话原有值

    const newRoundCount = currentRound + 1;

    sessionRepo.update(session.id, JSON.stringify(sessionData), newRoundCount);

    return {
      code: adjustedCode,
      sessionId: session.id,
      roundCount: newRoundCount,
    };
  }
}
