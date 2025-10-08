/** 图表生成服务 - 统一 chat() 接口处理首次生成和多轮调整 */

import { generateText, type LanguageModel } from "ai";
import { getDatabaseInstance } from "@/lib/db/client";
import { ModelRepository } from "@/lib/repositories/ModelRepository";
import { ChatSessionRepository } from "@/lib/repositories/ChatSessionRepository";
import { getAIProvider, validateProviderConfig } from "@/lib/ai/provider-factory";
import { cleanCode } from "@/lib/utils/code-cleaner";
import type { ChatSessionData, ChatMessage, RenderLanguage } from "@/types/database";
import { getGeneratePrompt } from "@/lib/constants/prompts";
import {
  MAX_INPUT_TEXT_LENGTH,
  MAX_CHAT_ROUNDS,
  AI_TEMPERATURE,
  AI_MAX_RETRIES,
} from "@/lib/constants/env";

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

export interface ChatParams {
  userId: number;
  userMessage: string;
  modelId: number;
  renderLanguage: RenderLanguage;
  sessionId?: number;
  diagramType?: string;
}

export interface ChatResult {
  code: string;
  sessionId: number;
  roundCount: number;
}

export class DiagramGenerationService {
  /**
   * 构建任务标记提示
   * @param isFirstGeneration - 是否为首次生成
   * @param diagramType - 图表类型（首次生成时必需）
   * @returns 任务标记字符串
   */
  private _buildTaskHint(isFirstGeneration: boolean, diagramType?: string): string {
    if (isFirstGeneration) {
      return `[任务：生成${diagramType}图表]`;
    }
    return `[任务：调整图表]`;
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

  /** 统一对话接口 - 无 sessionId 创建新会话,有 sessionId 继续对话 */
  async chat(params: ChatParams): Promise<ChatResult> {
    if (params.userMessage.length > MAX_INPUT_TEXT_LENGTH) {
      throw new Error(`输入文本超过 ${MAX_INPUT_TEXT_LENGTH.toLocaleString()} 字符限制`);
    }

    const { model } = await this.validateAndPrepare(params.userId, params.modelId);
    const db = getDatabaseInstance();
    const sessionRepo = new ChatSessionRepository(db);

    if (!params.sessionId) {
      return this._generateFirst(params, model, sessionRepo);
    } else {
      return this._continueChat(params, model, sessionRepo);
    }
  }

  private async _generateFirst(
    params: ChatParams,
    model: LanguageModel,
    sessionRepo: ChatSessionRepository
  ): Promise<ChatResult> {
    // 构建任务标记（传递给 AI）
    const taskHint = this._buildTaskHint(true, params.diagramType);

    const { text: generatedCode } = await generateText({
      model,
      system: getGeneratePrompt(params.renderLanguage, params.diagramType || "auto"),
      messages: [
        {
          role: "user",
          content: `${taskHint}\n${params.userMessage}`, // 注入任务标记
        },
      ],
      temperature: AI_TEMPERATURE,
      maxRetries: AI_MAX_RETRIES,
    });

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

    // 重建历史对话（使用原始消息）
    const messages: Array<{ role: "user" | "assistant"; content: string }> = [];

    sessionData.chatHistory.forEach((msg) => {
      messages.push({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      });
    });

    // 构建任务标记（传递给 AI）
    const taskHint = this._buildTaskHint(false);

    messages.push({
      role: "user",
      content: `${taskHint}\n${params.userMessage}`, // 注入任务标记
    });

    const result = await generateText({
      model,
      system: getGeneratePrompt(params.renderLanguage, sessionData.diagramType || "auto"),
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

    const newRoundCount = currentRound + 1;

    sessionRepo.update(session.id, JSON.stringify(sessionData), newRoundCount);

    return {
      code: adjustedCode,
      sessionId: session.id,
      roundCount: newRoundCount,
    };
  }
}
