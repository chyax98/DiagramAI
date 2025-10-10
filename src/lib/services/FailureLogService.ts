/**
 * 渲染失败日志服务
 * 职责：自动记录渲染失败到 JSON Lines 文件，便于后续分析优化提示词
 */

import { mkdir, appendFile } from "fs/promises";
import { join } from "path";

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
  /** 会话 ID（可选） */
  sessionId?: number;
  /** 历史记录 ID（可选） */
  historyId?: number;
}

/**
 * 渲染失败日志服务类
 *
 * 功能：
 * 1. 自动记录渲染失败到日志文件
 * 2. 使用 JSON Lines 格式便于分析
 * 3. 按日期分割日志文件
 * 4. 自动分类错误类型
 */
export class FailureLogService {
  private readonly logDir: string;
  private readonly enabled: boolean;

  constructor() {
    // 日志目录：项目根目录/logs/render-failures
    this.logDir = join(process.cwd(), "logs", "render-failures");
    // 通过环境变量控制是否启用（默认启用）
    this.enabled = process.env.ENABLE_FAILURE_LOGGING !== "false";
  }

  /**
   * 记录渲染失败
   *
   * @param entry 失败日志条目
   * @returns Promise<void>
   *
   * 实现逻辑：
   * 1. 检查是否启用日志
   * 2. 确保日志目录存在
   * 3. 按日期生成日志文件名
   * 4. 以 JSON Lines 格式追加写入
   * 5. 失败不抛出异常（避免影响主流程）
   */
  async logFailure(entry: FailureLogEntry): Promise<void> {
    if (!this.enabled) {
      return;
    }

    try {
      // 确保日志目录存在（递归创建）
      await mkdir(this.logDir, { recursive: true });

      // 生成日志文件名：YYYY-MM-DD.jsonl
      const date = new Date().toISOString().split("T")[0];
      const logFile = join(this.logDir, `${date}.jsonl`);

      // 写入 JSON Lines 格式（每行一个 JSON 对象）
      const logLine = JSON.stringify(entry) + "\n";
      await appendFile(logFile, logLine, "utf-8");
    } catch (error) {
      // 日志记录失败不应影响主流程，仅输出错误到控制台
      console.error("[FailureLogService] Failed to log render failure:", error);
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
