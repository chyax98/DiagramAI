/** 生成历史数据访问层 - 支持分页查询和按语言筛选 */

import type {
  GenerationHistory,
  CreateHistoryParams,
  QueryHistoryParams,
  PaginatedResult,
} from "@/types/database";
import type { RenderLanguage } from "@/types/diagram";
import type Database from "better-sqlite3";

export class HistoryRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  create(params: CreateHistoryParams): number {
    const stmt = this.db.prepare(`
      INSERT INTO generation_histories
        (user_id, input_text, render_language, diagram_type, generated_code, model_id, is_saved, render_error)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      params.user_id,
      params.input_text,
      params.render_language,
      params.diagram_type || null,
      params.generated_code,
      params.model_id || null,
      params.is_saved || 0,
      params.render_error || null
    );

    return result.lastInsertRowid as number;
  }

  findById(id: number): GenerationHistory | null {
    const stmt = this.db.prepare(`
      SELECT * FROM generation_histories WHERE id = ?
    `);

    const row = stmt.get(id) as GenerationHistory | undefined;
    return row || null;
  }

  findPaginated(params: QueryHistoryParams): PaginatedResult<GenerationHistory> {
    const page = params.page || 1;
    const pageSize = params.page_size || 20;
    const offset = (page - 1) * pageSize;

    let whereClause = "WHERE user_id = ?";
    const whereValues: unknown[] = [params.user_id];

    if (params.render_language && params.render_language !== "all") {
      whereClause += " AND render_language = ?";
      whereValues.push(params.render_language);
    }

    const countStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM generation_histories ${whereClause}
    `);
    const countResult = countStmt.get(...whereValues) as { count: number };
    const total = countResult.count;

    const dataStmt = this.db.prepare(`
      SELECT * FROM generation_histories
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);
    const items = dataStmt.all(...whereValues, pageSize, offset) as GenerationHistory[];

    return {
      items,
      total,
      page,
      page_size: pageSize,
      total_pages: Math.ceil(total / pageSize),
    };
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare(`
      DELETE FROM generation_histories WHERE id = ?
    `);

    const result = stmt.run(id);
    return result.changes > 0;
  }

  countByUserId(userId: number, renderLanguage?: RenderLanguage): number {
    let query = "SELECT COUNT(*) as count FROM generation_histories WHERE user_id = ?";
    const values: unknown[] = [userId];

    if (renderLanguage) {
      query += " AND render_language = ?";
      values.push(renderLanguage);
    }

    const stmt = this.db.prepare(query);
    const result = stmt.get(...values) as { count: number };
    return result.count;
  }

  findRecentByUserId(userId: number, limit = 10, offset = 0): GenerationHistory[] {
    const stmt = this.db.prepare(`
      SELECT * FROM generation_histories
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);

    return stmt.all(userId, limit, offset) as GenerationHistory[];
  }

  markAsSaved(id: number): boolean {
    const stmt = this.db.prepare(`
      UPDATE generation_histories
      SET is_saved = 1
      WHERE id = ?
    `);

    const result = stmt.run(id);
    return result.changes > 0;
  }

  unmarkAsSaved(id: number): boolean {
    const stmt = this.db.prepare(`
      UPDATE generation_histories
      SET is_saved = 0
      WHERE id = ?
    `);

    const result = stmt.run(id);
    return result.changes > 0;
  }

  findSaved(userId: number, page = 1, pageSize = 20): PaginatedResult<GenerationHistory> {
    const offset = (page - 1) * pageSize;

    const countStmt = this.db.prepare(`
      SELECT COUNT(*) as count
      FROM generation_histories
      WHERE user_id = ? AND is_saved = 1
    `);
    const countResult = countStmt.get(userId) as { count: number };
    const total = countResult.count;

    const dataStmt = this.db.prepare(`
      SELECT * FROM generation_histories
      WHERE user_id = ? AND is_saved = 1
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);
    const items = dataStmt.all(userId, pageSize, offset) as GenerationHistory[];

    return {
      items,
      total,
      page,
      page_size: pageSize,
      total_pages: Math.ceil(total / pageSize),
    };
  }

  recordRenderError(id: number, errorMessage: string): boolean {
    const stmt = this.db.prepare(`
      UPDATE generation_histories
      SET render_error = ?
      WHERE id = ?
    `);

    const result = stmt.run(errorMessage, id);
    return result.changes > 0;
  }

  clearRenderError(id: number): boolean {
    const stmt = this.db.prepare(`
      UPDATE generation_histories
      SET render_error = NULL
      WHERE id = ?
    `);

    const result = stmt.run(id);
    return result.changes > 0;
  }

  findWithErrors(userId: number): GenerationHistory[] {
    const stmt = this.db.prepare(`
      SELECT * FROM generation_histories
      WHERE user_id = ? AND render_error IS NOT NULL
      ORDER BY created_at DESC
    `);

    return stmt.all(userId) as GenerationHistory[];
  }
}
