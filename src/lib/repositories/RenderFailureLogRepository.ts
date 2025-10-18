/**
 * 渲染失败日志数据访问层
 *
 * 功能:
 * - 记录渲染失败案例
 * - 仅存储 Prompt ID（不存储内容快照）
 * - 支持 JOIN 查询获取 Prompt 内容
 * - 用于分析和改进 AI 提示词
 */

import type { RenderFailureLog, CreateFailureLogParams } from "@/types/prompt";
import { getDatabaseInstance } from "@/lib/db/client";

import type Database from "better-sqlite3";

/**
 * 失败日志记录（包含完整 Prompt 内容，通过 JOIN 获取）
 */
export interface FailureLogWithPrompts extends RenderFailureLog {
  prompt_l1_content: string | null;
  prompt_l2_content: string | null;
  prompt_l3_content: string | null;
}

export class RenderFailureLogRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  // ============================================================================
  // 创建方法
  // ============================================================================

  /**
   * 创建失败日志记录
   *
   * @param data - 失败日志参数
   * @returns 新创建的日志 ID
   *
   * @example
   * ```typescript
   * const logId = repo.create({
   *   user_id: 1,
   *   user_input: "绘制用户登录流程",
   *   render_language: "mermaid",
   *   diagram_type: "flowchart",
   *   generated_code: "flowchart TD\n  A --> B",
   *   error_message: "Syntax error at line 2",
   *   ai_provider: "openai",
   *   ai_model: "gpt-4o",
   *   prompt_l1_id: 1,
   *   prompt_l2_id: 5,
   *   prompt_l3_id: 12
   * });
   * ```
   */
  create(data: CreateFailureLogParams): number {
    const stmt = this.db.prepare(`
      INSERT INTO render_failure_logs (
        user_id,
        user_input,
        render_language,
        diagram_type,
        generated_code,
        error_message,
        ai_provider,
        ai_model,
        prompt_l1_id,
        prompt_l2_id,
        prompt_l3_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.user_id,
      data.user_input,
      data.render_language,
      data.diagram_type,
      data.generated_code,
      data.error_message,
      data.ai_provider,
      data.ai_model,
      data.prompt_l1_id ?? null,
      data.prompt_l2_id ?? null,
      data.prompt_l3_id ?? null
    );

    return result.lastInsertRowid as number;
  }

  // ============================================================================
  // 查询方法
  // ============================================================================

  /**
   * 根据用户 ID 查询失败日志（按时间倒序）
   *
   * @param userId - 用户 ID
   * @param limit - 返回记录数量（默认 50）
   * @returns 失败日志列表
   *
   * @example
   * ```typescript
   * const logs = repo.findByUserId(1, 10);
   * ```
   */
  findByUserId(userId: number, limit: number = 50): RenderFailureLog[] {
    const stmt = this.db.prepare(`
      SELECT * FROM render_failure_logs
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `);

    return stmt.all(userId, limit) as RenderFailureLog[];
  }

  /**
   * 根据 ID 查询单条失败日志
   *
   * @param id - 日志 ID
   * @returns 失败日志或 null
   *
   * @example
   * ```typescript
   * const log = repo.findById(123);
   * ```
   */
  findById(id: number): RenderFailureLog | null {
    const stmt = this.db.prepare(`
      SELECT * FROM render_failure_logs
      WHERE id = ?
    `);

    const row = stmt.get(id) as RenderFailureLog | undefined;
    return row || null;
  }

  /**
   * 查询失败日志并 JOIN 获取 Prompt 内容
   *
   * @param id - 日志 ID
   * @returns 包含 Prompt 内容的失败日志或 null
   *
   * @example
   * ```typescript
   * const logWithPrompts = repo.findWithPrompts(123);
   * if (logWithPrompts) {
   *   console.log("L1 Prompt:", logWithPrompts.prompt_l1_content);
   *   console.log("L2 Prompt:", logWithPrompts.prompt_l2_content);
   *   console.log("L3 Prompt:", logWithPrompts.prompt_l3_content);
   * }
   * ```
   */
  findWithPrompts(id: number): FailureLogWithPrompts | null {
    const stmt = this.db.prepare(`
      SELECT
        fl.*,
        l1.content as prompt_l1_content,
        l2.content as prompt_l2_content,
        l3.content as prompt_l3_content
      FROM render_failure_logs fl
      LEFT JOIN custom_prompts l1 ON fl.prompt_l1_id = l1.id
      LEFT JOIN custom_prompts l2 ON fl.prompt_l2_id = l2.id
      LEFT JOIN custom_prompts l3 ON fl.prompt_l3_id = l3.id
      WHERE fl.id = ?
    `);

    const row = stmt.get(id) as FailureLogWithPrompts | undefined;
    return row || null;
  }

  /**
   * 根据语言和类型查询失败日志
   *
   * @param renderLanguage - 渲染语言
   * @param diagramType - 图表类型
   * @param limit - 返回记录数量（默认 50）
   * @returns 失败日志列表
   *
   * @example
   * ```typescript
   * const logs = repo.findByLanguageAndType("mermaid", "flowchart", 20);
   * ```
   */
  findByLanguageAndType(
    renderLanguage: string,
    diagramType: string,
    limit: number = 50
  ): RenderFailureLog[] {
    const stmt = this.db.prepare(`
      SELECT * FROM render_failure_logs
      WHERE render_language = ? AND diagram_type = ?
      ORDER BY created_at DESC
      LIMIT ?
    `);

    return stmt.all(renderLanguage, diagramType, limit) as RenderFailureLog[];
  }

  /**
   * 根据 Prompt ID 查询失败日志
   *
   * @param promptId - Prompt ID
   * @param level - Prompt 层级（1/2/3）
   * @param limit - 返回记录数量（默认 50）
   * @returns 失败日志列表
   *
   * @example
   * ```typescript
   * // 查询使用 L1 Prompt #5 的所有失败案例
   * const logs = repo.findByPromptId(5, 1, 100);
   * ```
   */
  findByPromptId(promptId: number, level: 1 | 2 | 3, limit: number = 50): RenderFailureLog[] {
    const column = level === 1 ? "prompt_l1_id" : level === 2 ? "prompt_l2_id" : "prompt_l3_id";

    const stmt = this.db.prepare(`
      SELECT * FROM render_failure_logs
      WHERE ${column} = ?
      ORDER BY created_at DESC
      LIMIT ?
    `);

    return stmt.all(promptId, limit) as RenderFailureLog[];
  }

  // ============================================================================
  // 统计方法
  // ============================================================================

  /**
   * 统计用户的失败日志总数
   *
   * @param userId - 用户 ID
   * @returns 失败日志数量
   *
   * @example
   * ```typescript
   * const count = repo.countByUserId(1);
   * ```
   */
  countByUserId(userId: number): number {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM render_failure_logs
      WHERE user_id = ?
    `);

    const result = stmt.get(userId) as { count: number };
    return result.count;
  }

  /**
   * 统计特定语言和类型的失败日志数量
   *
   * @param renderLanguage - 渲染语言
   * @param diagramType - 图表类型
   * @returns 失败日志数量
   *
   * @example
   * ```typescript
   * const count = repo.countByLanguageAndType("mermaid", "flowchart");
   * ```
   */
  countByLanguageAndType(renderLanguage: string, diagramType: string): number {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM render_failure_logs
      WHERE render_language = ? AND diagram_type = ?
    `);

    const result = stmt.get(renderLanguage, diagramType) as { count: number };
    return result.count;
  }

  // ============================================================================
  // 删除方法
  // ============================================================================

  /**
   * 删除失败日志（物理删除）
   *
   * @param id - 日志 ID
   * @returns 是否删除成功
   *
   * @example
   * ```typescript
   * const deleted = repo.delete(123);
   * ```
   */
  delete(id: number): boolean {
    const stmt = this.db.prepare(`
      DELETE FROM render_failure_logs WHERE id = ?
    `);

    const result = stmt.run(id);
    return result.changes > 0;
  }

  /**
   * 批量删除用户的所有失败日志
   *
   * @param userId - 用户 ID
   * @returns 删除的记录数量
   *
   * @example
   * ```typescript
   * const deletedCount = repo.deleteByUserId(1);
   * ```
   */
  deleteByUserId(userId: number): number {
    const stmt = this.db.prepare(`
      DELETE FROM render_failure_logs WHERE user_id = ?
    `);

    const result = stmt.run(userId);
    return result.changes;
  }
}

// ============================================================================
// 单例导出
// ============================================================================

export const renderFailureLogRepository = new RenderFailureLogRepository(getDatabaseInstance());
