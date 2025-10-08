/** 用户数据访问层 - Repository 模式提供统一 CRUD 接口 */

import type { User, CreateUserParams, UserPublic } from "@/types/database";

import type Database from "better-sqlite3";

export class UserRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  create(params: CreateUserParams): number {
    const stmt = this.db.prepare(`
      INSERT INTO users (username, password_hash)
      VALUES (?, ?)
    `);

    const result = stmt.run(params.username, params.password_hash);
    return result.lastInsertRowid as number;
  }

  findById(id: number): User | null {
    const stmt = this.db.prepare(`
      SELECT * FROM users WHERE id = ?
    `);

    const row = stmt.get(id) as User | undefined;
    return row || null;
  }

  findByUsername(username: string): User | null {
    const stmt = this.db.prepare(`
      SELECT * FROM users WHERE username = ?
    `);

    const row = stmt.get(username) as User | undefined;
    return row || null;
  }

  findPublicById(id: number): UserPublic | null {
    const stmt = this.db.prepare(`
      SELECT id, username, created_at, last_login_at
      FROM users
      WHERE id = ?
    `);

    const row = stmt.get(id) as UserPublic | undefined;
    return row || null;
  }

  updateLastLogin(id: number): void {
    const stmt = this.db.prepare(`
      UPDATE users
      SET last_login_at = datetime('now', '+8 hours')
      WHERE id = ?
    `);

    stmt.run(id);
  }

  existsByUsername(username: string): boolean {
    const stmt = this.db.prepare(`
      SELECT 1 FROM users WHERE username = ? LIMIT 1
    `);

    const result = stmt.get(username);
    return result !== undefined;
  }

  /** 删除用户(级联删除 ai_models 和 generation_histories) */
  delete(id: number): boolean {
    const stmt = this.db.prepare(`
      DELETE FROM users WHERE id = ?
    `);

    const result = stmt.run(id);
    return result.changes > 0;
  }

  count(): number {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM users
    `);

    const result = stmt.get() as { count: number };
    return result.count;
  }

  findAll(): UserPublic[] {
    const stmt = this.db.prepare(`
      SELECT id, username, created_at, last_login_at
      FROM users
      ORDER BY created_at DESC
    `);

    return stmt.all() as UserPublic[];
  }
}
