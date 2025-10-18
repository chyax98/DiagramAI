/**
 * 提示词管理类型定义
 *
 * 功能特性:
 * - 三层提示词管理 (L1/L2/L3)
 * - 版本控制（自动生成 v1, v2, v3...）
 * - 全局共享（所有用户使用同一套 Prompt）
 * - 软删除支持
 * - 审计追踪（记录创建者）
 */

import type { RenderLanguage } from "@/lib/constants/diagram-types";

// ============================================================================
// 核心类型定义
// ============================================================================

/**
 * 提示词层级
 *
 * - L1: 通用提示词 (所有图表共享)
 * - L2: 语言级提示词 (特定渲染语言)
 * - L3: 类型级提示词 (特定图表类型)
 */
export type PromptLevel = 1 | 2 | 3;

/**
 * 自定义提示词 (数据库完整记录)
 */
export interface CustomPrompt {
  /** 主键 ID */
  id: number;

  /** 提示词层级 (1/2/3) */
  prompt_level: PromptLevel;

  /** 渲染语言 (L2/L3 必填, L1 为 null) */
  render_language: RenderLanguage | null;

  /** 图表类型 (L3 必填, L1/L2 为 null) */
  diagram_type: string | null;

  /** 版本号（自动生成: v1, v2, v3...） */
  version: string;

  /** 版本名称（用户填写，必填，如 "修正箭头语法"） */
  name: string;

  /** 版本说明（用户填写，可选，如 "详细说明..."） */
  description: string | null;

  /** 是否为当前激活版本 (0: 历史版本, 1: 激活版本) */
  is_active: number; // SQLite BOOLEAN: 0 或 1

  /** 提示词内容 */
  content: string;

  /** 创建者 ID（记录谁创建的，用于审计） */
  created_by: number;

  /** 创建时间 */
  created_at: string;

  /** 更新时间 */
  updated_at: string;

  /** 软删除标记（null: 未删除, 时间戳: 已删除） */
  deleted_at: string | null;
}

// ============================================================================
// 创建和更新参数类型
// ============================================================================

/**
 * 创建提示词参数 (L1 通用级别)
 *
 * 说明:
 * - L1 级别不需要 render_language 和 diagram_type
 * - 全局通用提示词,适用于所有图表
 * - version 由系统自动生成，不需要用户提供
 */
export interface CreatePromptL1Params {
  prompt_level: 1;
  render_language?: never; // 禁止设置
  diagram_type?: never; // 禁止设置
  name: string; // 必填
  description?: string; // 可选
  content: string;
  is_active?: boolean;
  created_by: number; // 从 JWT 获取
}

/**
 * 创建提示词参数 (L2 语言级别)
 *
 * 说明:
 * - L2 级别必须指定 render_language
 * - 不能指定 diagram_type
 * - 适用于特定渲染语言的所有图表类型
 * - version 由系统自动生成，不需要用户提供
 */
export interface CreatePromptL2Params {
  prompt_level: 2;
  render_language: RenderLanguage;
  diagram_type?: never; // 禁止设置
  name: string; // 必填
  description?: string; // 可选
  content: string;
  is_active?: boolean;
  created_by: number; // 从 JWT 获取
}

/**
 * 创建提示词参数 (L3 类型级别)
 *
 * 说明:
 * - L3 级别必须同时指定 render_language 和 diagram_type
 * - 最精确的提示词级别,仅适用于特定图表类型
 * - version 由系统自动生成，不需要用户提供
 */
export interface CreatePromptL3Params {
  prompt_level: 3;
  render_language: RenderLanguage;
  diagram_type: string;
  name: string; // 必填
  description?: string; // 可选
  content: string;
  is_active?: boolean;
  created_by: number; // 从 JWT 获取
}

/**
 * 创建提示词参数 (联合类型)
 *
 * 根据 prompt_level 自动选择正确的参数类型:
 * - prompt_level = 1 → CreatePromptL1Params
 * - prompt_level = 2 → CreatePromptL2Params
 * - prompt_level = 3 → CreatePromptL3Params
 */
export type CreatePromptParams = CreatePromptL1Params | CreatePromptL2Params | CreatePromptL3Params;

/**
 * 更新提示词参数
 *
 * 说明:
 * - 仅允许更新部分字段
 * - 不允许修改 prompt_level, render_language, diagram_type, version
 * - version 修改会创建新版本（通过 create 方法）
 */
export interface UpdatePromptParams {
  /** 版本名称 (可选修改) */
  name?: string;

  /** 版本说明 (可选修改) */
  description?: string;

  /** 提示词内容 (可选修改) */
  content?: string;

  /** 激活状态 (可选修改) */
  is_active?: boolean;
}

// ============================================================================
// 查询和过滤类型
// ============================================================================

/**
 * 提示词查询过滤参数
 *
 * 用于查询特定位置的提示词 (支持多种查询模式)
 */
export interface PromptQueryFilters {
  /** 提示词层级 (可选, 筛选特定层级) */
  prompt_level?: PromptLevel;

  /** 渲染语言 (可选, 筛选特定语言) */
  render_language?: RenderLanguage;

  /** 图表类型 (可选, 筛选特定类型) */
  diagram_type?: string;

  /** 是否仅查询激活版本 (默认 false, 查询所有版本) */
  only_active?: boolean;

  /** 是否包含已删除的版本 (默认 false, 不包含) */
  include_deleted?: boolean;

  /** 分页: 页码 (从 1 开始) */
  page?: number;

  /** 分页: 每页数量 (默认 20) */
  page_size?: number;
}

/**
 * 提示词版本信息 (简化版本)
 *
 * 用于版本历史列表显示
 */
export interface PromptVersionInfo {
  /** 版本 ID */
  id: number;

  /** 版本号 */
  version: string;

  /** 版本名称 */
  name: string;

  /** 版本说明 */
  description: string | null;

  /** 是否激活 */
  is_active: number;

  /** 创建者 ID */
  created_by: number;

  /** 创建时间 */
  created_at: string;

  /** 更新时间 */
  updated_at: string;

  /** 是否已删除 */
  deleted_at: string | null;
}

/**
 * 提示词位置标识
 *
 * 用于唯一标识一个提示词的位置 (不包括版本信息)
 */
export interface PromptLocation {
  prompt_level: PromptLevel;
  render_language: RenderLanguage | null;
  diagram_type: string | null;
}

// ============================================================================
// 业务逻辑类型
// ============================================================================

/**
 * 提示词加载结果
 *
 * 用于提示词加载器返回的最终组合结果
 */
export interface PromptLoadResult {
  /** L1 通用提示词 (可能不存在) */
  l1_content: string | null;

  /** L2 语言级提示词 (可能不存在) */
  l2_content: string | null;

  /** L3 类型级提示词 (可能不存在) */
  l3_content: string | null;

  /** 最终组合后的完整提示词 */
  final_prompt: string;

  /** 使用的版本信息 */
  versions: {
    l1_version?: string;
    l2_version?: string;
    l3_version?: string;
  };

  /** 使用的 Prompt ID（用于失败日志记录） */
  prompt_ids: {
    l1_id?: number;
    l2_id?: number;
    l3_id?: number;
  };
}

// ============================================================================
// 导出辅助类型
// ============================================================================

/**
 * 提示词公开信息 (不包含敏感数据)
 *
 * 用于 API 响应
 */
export type CustomPromptPublic = CustomPrompt;

/**
 * 提示词列表项 (简化信息)
 *
 * 用于列表展示
 */
export type CustomPromptListItem = Pick<
  CustomPrompt,
  | "id"
  | "prompt_level"
  | "render_language"
  | "diagram_type"
  | "version"
  | "name"
  | "is_active"
  | "created_at"
  | "created_by"
>;

// ============================================================================
// 前端专用类型
// ============================================================================

/**
 * 提示词选择状态
 * 用于前端组件的选择器状态管理
 */
export interface PromptSelection {
  level: 1 | 2 | 3 | null;
  language: RenderLanguage | null;
  type: string | null;
}

// ============================================================================
// 失败日志相关类型
// ============================================================================

/**
 * 渲染失败日志记录
 */
export interface RenderFailureLog {
  id: number;
  user_id: number;
  user_input: string;
  render_language: string;
  diagram_type: string;
  generated_code: string;
  error_message: string;
  ai_provider: string;
  ai_model: string;
  prompt_l1_id: number | null;
  prompt_l2_id: number | null;
  prompt_l3_id: number | null;
  created_at: string;
}

/**
 * 创建失败日志参数
 */
export interface CreateFailureLogParams {
  user_id: number;
  user_input: string;
  render_language: string;
  diagram_type: string;
  generated_code: string;
  error_message: string;
  ai_provider: string;
  ai_model: string;
  prompt_l1_id?: number | null;
  prompt_l2_id?: number | null;
  prompt_l3_id?: number | null;
}
