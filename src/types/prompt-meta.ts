/**
 * 提示词 Meta 信息类型定义
 */

/**
 * 提示词 Meta 信息
 * 存储在数据库 meta_info 字段
 */
export interface PromptMetaInfo {
  /** 用户自定义标签 (如: ["性能优化", "样式调整", "重要"]) */
  tags?: string[];

  /** 变更摘要 (自动从 version_name 提取或用户填写) */
  change_summary?: string;

  /** 创建者类型 */
  created_by: "user" | "system";

  /** 字符数统计 */
  char_count: number;

  /** 行数统计 */
  line_count: number;

  /** 与上一版本的差异统计 (可选) */
  diff_stats?: {
    /** 新增行数 */
    added: number;
    /** 删除行数 */
    removed: number;
    /** 修改行数 */
    modified: number;
  };

  /** 其他自定义字段 (扩展用) */
  [key: string]: unknown;
}

/**
 * 创建 Meta 信息的辅助函数
 */
export function createPromptMeta(
  content: string,
  options?: {
    tags?: string[];
    changeSummary?: string;
    createdBy?: "user" | "system";
    previousContent?: string;
  }
): PromptMetaInfo {
  const meta: PromptMetaInfo = {
    created_by: options?.createdBy || "user",
    char_count: content.length,
    line_count: content.split("\n").length,
  };

  if (options?.tags && options.tags.length > 0) {
    meta.tags = options.tags;
  }

  if (options?.changeSummary) {
    meta.change_summary = options.changeSummary;
  }

  // 计算差异统计
  if (options?.previousContent) {
    meta.diff_stats = calculateDiff(options.previousContent, content);
  }

  return meta;
}

/**
 * 简单的差异统计计算 (基于行对比)
 */
function calculateDiff(
  oldContent: string,
  newContent: string
): { added: number; removed: number; modified: number } {
  const oldLines = oldContent.split("\n");
  const newLines = newContent.split("\n");

  const oldSet = new Set(oldLines);
  const newSet = new Set(newLines);

  let added = 0;
  let removed = 0;

  // 计算新增行
  for (const line of newLines) {
    if (!oldSet.has(line)) {
      added++;
    }
  }

  // 计算删除行
  for (const line of oldLines) {
    if (!newSet.has(line)) {
      removed++;
    }
  }

  // 修改行 = min(新增, 删除)
  const modified = Math.min(added, removed);

  return {
    added: added - modified,
    removed: removed - modified,
    modified,
  };
}

/**
 * 解析 meta_info JSON 字符串
 */
export function parsePromptMeta(metaJson: string | null): PromptMetaInfo | null {
  if (!metaJson) return null;

  try {
    return JSON.parse(metaJson) as PromptMetaInfo;
  } catch (_error) {
    return null;
  }
}

/**
 * 序列化 meta_info 为 JSON 字符串
 */
export function stringifyPromptMeta(meta: PromptMetaInfo): string {
  return JSON.stringify(meta);
}
