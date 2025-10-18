/**
 * 渲染失败日志服务
 * 职责：自动记录渲染失败到数据库，便于后续分析优化提示词
 */

import { logger } from "@/lib/utils/logger";
import { renderFailureLogRepository } from "@/lib/repositories/RenderFailureLogRepository";

/**
 * 失败日志条目接口
 */
export interface FailureLogEntry {
  /** 时间戳 ISO 8601 格式 */
  timestamp: string;
  /** 用户 ID */
  userId: number;
  /** 用户输入描述 */
  input: string;
  /** 图表类型 */
  diagramType: string;
  /** 渲染语言 */
  renderLanguage: string;
  /** AI 生成的代码 */
  generatedCode: string;
  /** 错误信息 */
  error: string;
  /** 错误类型分类 */
  errorType: "kroki" | "network" | "code_format" | "unknown";
  /** 使用的 AI 模型信息 */
  modelInfo: {
    provider: string;
    modelId: string;
  };
  /** 使用的 Prompt IDs（从 loadPrompt 获取） */
  promptIds?: {
    l1_id?: number;
    l2_id?: number;
    l3_id?: number;
  };
  /** 会话 ID（可选） */
  sessionId?: number;
  /** 历史记录 ID（可选） */
  historyId?: number;
}

/**
 * 渲染失败日志服务类
 *
 * 功能：
 * 1. 自动记录渲染失败到数据库
 * 2. 记录 Prompt 版本（L1/L2/L3）用于优化分析
 * 3. 自动分类错误类型
 */
export class FailureLogService {
  private readonly enabled: boolean;

  constructor() {
    // 通过环境变量控制是否启用（默认启用）
    this.enabled = process.env.ENABLE_FAILURE_LOGGING !== "false";
  }

  /**
   * 记录渲染失败到数据库
   *
   * @param entry 失败日志条目
   * @returns Promise<void>
   *
   * 实现逻辑：
   * 1. 检查是否启用日志
   * 2. 获取当前激活的 Prompt ID（L1/L2/L3）
   * 3. 写入数据库（存储 Prompt ID 而非完整内容）
   * 4. 失败不抛出异常（避免影响主流程）
   */
  async logFailure(entry: FailureLogEntry): Promise<void> {
    if (!this.enabled) {
      return;
    }

    try {
      // 使用传入的 Prompt IDs（来自 loadPrompt）
      const promptL1Id = entry.promptIds?.l1_id || null;
      const promptL2Id = entry.promptIds?.l2_id || null;
      const promptL3Id = entry.promptIds?.l3_id || null;

      // 写入数据库（只存 Prompt ID，不存完整内容）
      renderFailureLogRepository.create({
        user_id: entry.userId,
        user_input: entry.input,
        render_language: entry.renderLanguage,
        diagram_type: entry.diagramType,
        generated_code: entry.generatedCode,
        error_message: entry.error,
        ai_provider: entry.modelInfo.provider,
        ai_model: entry.modelInfo.modelId,
        prompt_l1_id: promptL1Id,
        prompt_l2_id: promptL2Id,
        prompt_l3_id: promptL3Id,
      });

      logger.info("[FailureLogService] 失败记录已保存到数据库", {
        userId: entry.userId,
        renderLanguage: entry.renderLanguage,
        diagramType: entry.diagramType,
        promptIds: {
          l1: promptL1Id,
          l2: promptL2Id,
          l3: promptL3Id,
        },
      });
    } catch (error) {
      // 日志记录失败不应影响主流程，使用 logger 记录错误
      logger.error("[FailureLogService] Failed to log render failure:", error);
    }
  }

  /**
   * 根据错误信息自动分类错误类型
   *
   * @param error 错误信息字符串
   * @returns 错误类型分类
   *
   * 分类规则：
   * - kroki: Kroki 渲染错误（语法错误、不支持的特性）
   * - network: 网络错误（Kroki 服务不可用）
   * - code_format: 代码格式错误（AI 输出格式问题）
   * - unknown: 未知错误
   */
  classifyError(error: string): FailureLogEntry["errorType"] {
    const lowerError = error.toLowerCase();

    // Kroki 渲染错误
    if (
      lowerError.includes("syntax") ||
      lowerError.includes("parse") ||
      lowerError.includes("unsupported") ||
      lowerError.includes("invalid")
    ) {
      return "kroki";
    }

    // 网络错误
    if (
      lowerError.includes("fetch") ||
      lowerError.includes("network") ||
      lowerError.includes("timeout") ||
      lowerError.includes("econnrefused")
    ) {
      return "network";
    }

    // 代码格式错误
    if (
      lowerError.includes("format") ||
      lowerError.includes("clean") ||
      lowerError.includes("markdown")
    ) {
      return "code_format";
    }

    // 未知错误
    return "unknown";
  }
}
