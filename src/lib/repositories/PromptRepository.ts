/**
 * Prompt 提示词数据访问层 - 全局共享模式
 *
 * 核心变更 (相较于旧版本):
 * ❌ 移除 user_id 参数 - 全局共享
 * ✅ 自动生成版本号 (v1, v2, v3...)
 * ✅ 软删除支持 (deleted_at)
 * ✅ 审计字段 (created_by)
 * ✅ 事务保护
 */

import type {
  CustomPrompt,
  CreatePromptParams,
  UpdatePromptParams,
  PromptVersionInfo,
} from "@/types/prompt";

import type Database from "better-sqlite3";

export class PromptRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  // ============================================================================
  // 查询方法
  // ============================================================================

  /**
   * 获取激活的提示词版本
   *
   * @param level - 提示词层级 (1/2/3)
   * @param language - 渲染语言 (L2/L3 必填)
   * @param type - 图表类型 (L3 必填)
   * @returns 激活的提示词或 null
   *
   * @example
   * ```typescript
   * // L1: 通用提示词
   * const l1 = repo.findActive(1);
   *
   * // L2: Mermaid 语言级提示词
   * const l2 = repo.findActive(2, 'mermaid');
   *
   * // L3: Mermaid 流程图类型提示词
   * const l3 = repo.findActive(3, 'mermaid', 'flowchart');
   * ```
   */
  findActive(level: 1 | 2 | 3, language?: string, type?: string): CustomPrompt | null {
    const stmt = this.db.prepare(`
      SELECT * FROM custom_prompts
      WHERE prompt_level = ?
        AND (render_language = ? OR (render_language IS NULL AND ? IS NULL))
        AND (diagram_type = ? OR (diagram_type IS NULL AND ? IS NULL))
        AND is_active = 1
        AND deleted_at IS NULL
      LIMIT 1
    `);

    const row = stmt.get(level, language || null, language || null, type || null, type || null) as
      | CustomPrompt
      | undefined;

    return row || null;
  }

  /**
   * 获取所有版本历史 (按版本号降序)
   *
   * @param level - 提示词层级
   * @param language - 渲染语言 (可选)
   * @param type - 图表类型 (可选)
   * @returns 版本历史列表
   */
  findVersions(level: 1 | 2 | 3, language?: string, type?: string): CustomPrompt[] {
    const stmt = this.db.prepare(`
      SELECT * FROM custom_prompts
      WHERE prompt_level = ?
        AND (render_language = ? OR (render_language IS NULL AND ? IS NULL))
        AND (diagram_type = ? OR (diagram_type IS NULL AND ? IS NULL))
        AND deleted_at IS NULL
      ORDER BY version DESC, created_at DESC
    `);

    return stmt.all(
      level,
      language || null,
      language || null,
      type || null,
      type || null
    ) as CustomPrompt[];
  }

  /**
   * 获取版本信息列表 (轻量级,不含 content)
   *
   * @param level - 提示词层级
   * @param language - 渲染语言 (可选)
   * @param type - 图表类型 (可选)
   * @returns 版本信息列表
   */
  findVersionInfos(level: 1 | 2 | 3, language?: string, type?: string): PromptVersionInfo[] {
    const stmt = this.db.prepare(`
      SELECT
        id,
        version,
        name,
        description,
        is_active,
        created_by,
        created_at,
        updated_at,
        deleted_at
      FROM custom_prompts
      WHERE prompt_level = ?
        AND (render_language = ? OR (render_language IS NULL AND ? IS NULL))
        AND (diagram_type = ? OR (diagram_type IS NULL AND ? IS NULL))
        AND deleted_at IS NULL
      ORDER BY version DESC, created_at DESC
    `);

    return stmt.all(
      level,
      language || null,
      language || null,
      type || null,
      type || null
    ) as PromptVersionInfo[];
  }

  /**
   * 根据 ID 获取特定版本
   *
   * @param id - 提示词 ID
   * @returns 提示词或 null
   */
  findById(id: number): CustomPrompt | null {
    const stmt = this.db.prepare(`
      SELECT * FROM custom_prompts WHERE id = ?
    `);

    const row = stmt.get(id) as CustomPrompt | undefined;
    return row || null;
  }

  // ============================================================================
  // 创建和更新方法
  // ============================================================================

  /**
   * 创建新版本 (自动生成版本号)
   *
   * 功能:
   * 1. 自动生成版本号 (v1, v2, v3...)
   * 2. 使用事务保证并发安全
   * 3. 返回新创建的提示词 ID
   *
   * @param data - 创建参数
   * @returns 新创建的提示词 ID
   *
   * @example
   * ```typescript
   * // L1: 创建通用提示词
   * const id = repo.create({
   *   prompt_level: 1,
   *   name: "修正箭头语法",
   *   description: "统一使用 --> 而不是 ->",
   *   content: "...",
   *   is_active: false,
   *   created_by: 1
   * });
   *
   * // L2: 创建语言级提示词
   * const id = repo.create({
   *   prompt_level: 2,
   *   render_language: "mermaid",
   *   name: "Mermaid 通用规范",
   *   content: "...",
   *   created_by: 1
   * });
   *
   * // L3: 创建类型级提示词
   * const id = repo.create({
   *   prompt_level: 3,
   *   render_language: "mermaid",
   *   diagram_type: "flowchart",
   *   name: "流程图优化版本",
   *   content: "...",
   *   created_by: 1
   * });
   * ```
   */
  create(data: CreatePromptParams): number {
    // 使用事务保证并发安全
    const transaction = this.db.transaction((params: CreatePromptParams) => {
      // 1. 生成下一个版本号
      const nextVersion = this.getNextVersion(
        params.prompt_level,
        params.prompt_level >= 2 && "render_language" in params
          ? params.render_language
          : undefined,
        params.prompt_level === 3 && "diagram_type" in params ? params.diagram_type : undefined
      );

      // 2. 插入新记录
      const stmt = this.db.prepare(`
        INSERT INTO custom_prompts (
          prompt_level,
          render_language,
          diagram_type,
          version,
          name,
          description,
          content,
          is_active,
          created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      // 根据 prompt_level 类型安全地访问字段
      const renderLanguage =
        params.prompt_level >= 2 && "render_language" in params ? params.render_language : null;
      const diagramType =
        params.prompt_level === 3 && "diagram_type" in params ? params.diagram_type : null;

      const result = stmt.run(
        params.prompt_level,
        renderLanguage,
        diagramType,
        nextVersion,
        params.name,
        params.description || null,
        params.content,
        params.is_active ? 1 : 0,
        params.created_by
      );

      return result.lastInsertRowid as number;
    });

    return transaction(data);
  }

  /**
   * 更新提示词
   *
   * @param id - 提示词 ID
   * @param data - 更新参数
   *
   * @example
   * ```typescript
   * repo.update(123, {
   *   name: "新名称",
   *   description: "新说明",
   *   content: "新内容"
   * });
   * ```
   */
  update(id: number, data: UpdatePromptParams): void {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (data.content !== undefined) {
      updates.push("content = ?");
      values.push(data.content);
    }

    if (data.name !== undefined) {
      updates.push("name = ?");
      values.push(data.name);
    }

    if (data.description !== undefined) {
      updates.push("description = ?");
      values.push(data.description);
    }

    if (data.is_active !== undefined) {
      updates.push("is_active = ?");
      values.push(data.is_active ? 1 : 0);
    }

    if (updates.length === 0) {
      return;
    }

    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE custom_prompts
      SET ${updates.join(", ")}
      WHERE id = ?
    `);

    stmt.run(...values);
  }

  // ============================================================================
  // 版本管理方法
  // ============================================================================

  /**
   * 激活指定版本 (同时取消其他版本的激活状态)
   *
   * 功能:
   * 1. 取消同一位置所有版本的激活状态
   * 2. 激活指定版本
   * 3. 使用事务保证原子性
   *
   * @param id - 要激活的提示词 ID
   *
   * @example
   * ```typescript
   * repo.activate(123);
   * ```
   */
  activate(id: number): void {
    const transaction = this.db.transaction((promptId: number) => {
      const prompt = this.findById(promptId);
      if (!prompt) {
        throw new Error(`Prompt with id ${promptId} not found`);
      }

      // 1. 取消同一位置所有版本的激活状态
      const deactivateStmt = this.db.prepare(`
        UPDATE custom_prompts
        SET is_active = 0
        WHERE prompt_level = ?
          AND (render_language = ? OR (render_language IS NULL AND ? IS NULL))
          AND (diagram_type = ? OR (diagram_type IS NULL AND ? IS NULL))
          AND deleted_at IS NULL
          AND id != ?
      `);

      deactivateStmt.run(
        prompt.prompt_level,
        prompt.render_language,
        prompt.render_language,
        prompt.diagram_type,
        prompt.diagram_type,
        promptId
      );

      // 2. 激活指定版本
      const activateStmt = this.db.prepare(`
        UPDATE custom_prompts
        SET is_active = 1
        WHERE id = ?
      `);

      activateStmt.run(promptId);
    });

    transaction(id);
  }

  /**
   * 软删除提示词
   *
   * @param id - 提示词 ID
   *
   * @example
   * ```typescript
   * repo.delete(123);
   * ```
   */
  delete(id: number): void {
    const stmt = this.db.prepare(`
      UPDATE custom_prompts
      SET deleted_at = datetime('now')
      WHERE id = ?
    `);

    stmt.run(id);
  }

  // ============================================================================
  // 辅助方法
  // ============================================================================

  /**
   * 生成下一个版本号 (v1, v2, v3...)
   *
   * 逻辑:
   * 1. 查询当前最大版本号
   * 2. 如果不存在,返回 "v1"
   * 3. 如果存在,解析版本号并递增
   *
   * @param level - 提示词层级
   * @param language - 渲染语言 (可选)
   * @param type - 图表类型 (可选)
   * @returns 下一个版本号 (如 "v1", "v2", "v3")
   *
   * @private
   */
  private getNextVersion(level: 1 | 2 | 3, language?: string, type?: string): string {
    const stmt = this.db.prepare(`
      SELECT version FROM custom_prompts
      WHERE prompt_level = ?
        AND (render_language = ? OR (render_language IS NULL AND ? IS NULL))
        AND (diagram_type = ? OR (diagram_type IS NULL AND ? IS NULL))
        AND deleted_at IS NULL
      ORDER BY version DESC
      LIMIT 1
    `);

    const row = stmt.get(level, language || null, language || null, type || null, type || null) as
      | { version: string }
      | undefined;

    if (!row) {
      return "v1";
    }

    // 解析版本号: "v123" -> 123
    const currentVersionNum = parseInt(row.version.substring(1), 10);

    // 如果解析失败,返回 v1
    if (isNaN(currentVersionNum)) {
      return "v1";
    }

    // 递增版本号
    return `v${currentVersionNum + 1}`;
  }

  /**
   * 获取所有自定义的提示词位置
   *
   * @returns 提示词位置列表
   */
  findAllCustomizedPositions(): Array<{
    prompt_level: 1 | 2 | 3;
    render_language: string | null;
    diagram_type: string | null;
    active_version: string;
  }> {
    const stmt = this.db.prepare(`
      SELECT DISTINCT
        prompt_level,
        render_language,
        diagram_type,
        (
          SELECT version
          FROM custom_prompts cp2
          WHERE cp2.prompt_level = cp1.prompt_level
            AND (cp2.render_language = cp1.render_language OR (cp2.render_language IS NULL AND cp1.render_language IS NULL))
            AND (cp2.diagram_type = cp1.diagram_type OR (cp2.diagram_type IS NULL AND cp1.diagram_type IS NULL))
            AND cp2.is_active = 1
            AND cp2.deleted_at IS NULL
          LIMIT 1
        ) as active_version
      FROM custom_prompts cp1
      WHERE deleted_at IS NULL
      ORDER BY prompt_level, render_language, diagram_type
    `);

    return stmt.all() as Array<{
      prompt_level: 1 | 2 | 3;
      render_language: string | null;
      diagram_type: string | null;
      active_version: string;
    }>;
  }
}
