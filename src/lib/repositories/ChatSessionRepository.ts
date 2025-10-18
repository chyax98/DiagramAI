/** 对话会话数据访问层 */

import type { ChatSession, CreateChatSessionParams } from "@/types/database";
import type Database from "better-sqlite3";

export class ChatSessionRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  /** 创建新的对话会话 */
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

    return this.findById(id)!;
  }

  /** 更新会话数据和轮次 */
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

  /** 根据 ID 查询会话 */
  findById(id: number): ChatSession | null {
    const stmt = this.db.prepare(`
      SELECT * FROM chat_sessions WHERE id = ?
    `);

    return (stmt.get(id) as ChatSession) || null;
  }

  /** 查询用户的所有会话 (按创建时间倒序) */
  findByUser(userId: number): ChatSession[] {
    const stmt = this.db.prepare(`
      SELECT * FROM chat_sessions
      WHERE user_id = ?
      ORDER BY created_at DESC
    `);

    return stmt.all(userId) as ChatSession[];
  }

  /** 根据生成历史 ID 查询关联的会话 */
  findByHistory(historyId: number): ChatSession | null {
    const stmt = this.db.prepare(`
      SELECT * FROM chat_sessions
      WHERE generation_history_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `);

    return (stmt.get(historyId) as ChatSession) || null;
  }

  /** 删除会话 */
  delete(id: number): boolean {
    const stmt = this.db.prepare(`
      DELETE FROM chat_sessions WHERE id = ?
    `);

    const info = stmt.run(id);
    return info.changes > 0;
  }

  /** 查询用户最近的会话 (限制数量) */
  findRecentByUser(userId: number, limit: number = 10): ChatSession[] {
    const stmt = this.db.prepare(`
      SELECT * FROM chat_sessions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `);

    return stmt.all(userId, limit) as ChatSession[];
  }

  /** 统计用户的会话总数 */
  countByUser(userId: number): number {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count
      FROM chat_sessions
      WHERE user_id = ?
    `);

    const result = stmt.get(userId) as { count: number };
    return result.count;
  }

  /** 删除用户的所有会话 (批量删除) */
  deleteByUser(userId: number): number {
    const stmt = this.db.prepare(`
      DELETE FROM chat_sessions WHERE user_id = ?
    `);

    const info = stmt.run(userId);
    return info.changes;
  }
}
