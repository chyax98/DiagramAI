/**
 * 对话会话数据访问层
 *
 * 设计要点：
 * - 采用 Repository 模式隔离数据访问逻辑
 * - session_data 以 JSON 格式存储完整对话历史
 * - round_count 跟踪对话轮次，防止超限
 * - 支持与 generation_history 表关联
 */

import type Database from "better-sqlite3";
import type { ChatSession, CreateChatSessionParams } from "@/types/database";

export class ChatSessionRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  /**
   * 创建新的对话会话
   *
   * @param params - 会话创建参数
   * @returns 新创建的会话对象
   */
  create(params: CreateChatSessionParams): ChatSession {
    const stmt = this.db.prepare(`
      INSERT INTO chat_sessions (user_id, generation_history_id, session_data, round_count)
      VALUES (?, ?, ?, ?)
    `);

    const info = stmt.run(
      params.userId,
      params.generationHistoryId || null,
      params.sessionData,
      params.roundCount || 0
    );

    const id = info.lastInsertRowid as number;

    // 返回创建的会话对象
    return this.findById(id)!;
  }

  /**
   * 更新会话数据和轮次
   *
   * @param id - 会话 ID
   * @param sessionData - 新的会话数据 JSON
   * @param roundCount - 新的对话轮次
   * @throws 会话不存在时抛出错误
   */
  update(id: number, sessionData: string, roundCount: number): void {
    const stmt = this.db.prepare(`
      UPDATE chat_sessions
      SET session_data = ?, round_count = ?
      WHERE id = ?
    `);

    const info = stmt.run(sessionData, roundCount, id);

    if (info.changes === 0) {
      throw new Error(`ChatSession with id ${id} not found`);
    }
  }

  /**
   * 根据 ID 查询会话
   *
   * @param id - 会话 ID
   * @returns 会话对象（不存在则返回 null）
   */
  findById(id: number): ChatSession | null {
    const stmt = this.db.prepare(`
      SELECT * FROM chat_sessions WHERE id = ?
    `);

    return (stmt.get(id) as ChatSession) || null;
  }

  /**
   * 查询用户的所有会话（按创建时间倒序）
   *
   * @param userId - 用户 ID
   * @returns 会话列表（最新的在前）
   *
   * 性能考量：使用索引 idx_chat_sessions_user_id
   */
  findByUser(userId: number): ChatSession[] {
    const stmt = this.db.prepare(`
      SELECT * FROM chat_sessions
      WHERE user_id = ?
      ORDER BY created_at DESC
    `);

    return stmt.all(userId) as ChatSession[];
  }

  /**
   * 根据生成历史 ID 查询关联的会话
   *
   * @param historyId - 生成历史 ID
   * @returns 关联的会话（不存在则返回 null）
   */
  findByHistory(historyId: number): ChatSession | null {
    const stmt = this.db.prepare(`
      SELECT * FROM chat_sessions
      WHERE generation_history_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `);

    return (stmt.get(historyId) as ChatSession) || null;
  }

  /**
   * 删除会话
   *
   * @param id - 会话 ID
   * @returns 是否删除成功
   */
  delete(id: number): boolean {
    const stmt = this.db.prepare(`
      DELETE FROM chat_sessions WHERE id = ?
    `);

    const info = stmt.run(id);
    return info.changes > 0;
  }

  /**
   * 查询用户最近的会话（限制数量）
   *
   * @param userId - 用户 ID
   * @param limit - 返回数量限制（默认 10）
   * @returns 最近的会话列表
   */
  findRecentByUser(userId: number, limit: number = 10): ChatSession[] {
    const stmt = this.db.prepare(`
      SELECT * FROM chat_sessions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `);

    return stmt.all(userId, limit) as ChatSession[];
  }

  /**
   * 统计用户的会话总数
   *
   * @param userId - 用户 ID
   * @returns 会话总数
   */
  countByUser(userId: number): number {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count
      FROM chat_sessions
      WHERE user_id = ?
    `);

    const result = stmt.get(userId) as { count: number };
    return result.count;
  }

  /**
   * 删除用户的所有会话（批量删除）
   *
   * @param userId - 用户 ID
   * @returns 删除的会话数量
   */
  deleteByUser(userId: number): number {
    const stmt = this.db.prepare(`
      DELETE FROM chat_sessions WHERE user_id = ?
    `);

    const info = stmt.run(userId);
    return info.changes;
  }
}
