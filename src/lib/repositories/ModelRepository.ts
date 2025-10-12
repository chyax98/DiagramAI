/** AI 模型配置数据访问层 - 支持多 Provider 的 Repository 模式 */

import type { AIModel, CreateAIModelParams, UpdateAIModelParams } from "@/types/database";
import type Database from "better-sqlite3";

export class ModelRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  create(params: CreateAIModelParams): number {
    const stmt = this.db.prepare(`
      INSERT INTO ai_models (user_id, name, provider, api_endpoint, api_key, model_id, parameters)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      params.user_id,
      params.name,
      params.provider || "openai",
      params.api_endpoint,
      params.api_key,
      params.model_id,
      params.parameters || null
    );

    return result.lastInsertRowid as number;
  }

  findById(id: number): AIModel | null {
    const stmt = this.db.prepare(`
      SELECT * FROM ai_models WHERE id = ?
    `);

    const row = stmt.get(id) as AIModel | undefined;
    return row || null;
  }

  findByUserId(userId: number): AIModel[] {
    const stmt = this.db.prepare(`
      SELECT * FROM ai_models
      WHERE user_id = ?
      ORDER BY created_at DESC
    `);

    return stmt.all(userId) as AIModel[];
  }

  update(id: number, params: UpdateAIModelParams): boolean {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (params.name !== undefined) {
      fields.push("name = ?");
      values.push(params.name);
    }
    if (params.provider !== undefined) {
      fields.push("provider = ?");
      values.push(params.provider);
    }
    if (params.api_endpoint !== undefined) {
      fields.push("api_endpoint = ?");
      values.push(params.api_endpoint);
    }
    if (params.api_key !== undefined) {
      fields.push("api_key = ?");
      values.push(params.api_key);
    }
    if (params.model_id !== undefined) {
      fields.push("model_id = ?");
      values.push(params.model_id);
    }
    if (params.parameters !== undefined) {
      fields.push("parameters = ?");
      values.push(params.parameters);
    }

    if (fields.length === 0) {
      return false;
    }

    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE ai_models
      SET ${fields.join(", ")}
      WHERE id = ?
    `);

    const result = stmt.run(...values);
    return result.changes > 0;
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare(`
      DELETE FROM ai_models WHERE id = ?
    `);

    const result = stmt.run(id);
    return result.changes > 0;
  }

  countByUserId(userId: number): number {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM ai_models WHERE user_id = ?
    `);

    const result = stmt.get(userId) as { count: number };
    return result.count;
  }
}
