/**
 * 版本号管理工具函数
 * 提供语义化版本号的生成、解析和比较功能
 */

import type { PromptVersionInfo } from "@/types/prompt";

/**
 * 生成下一个版本号 (自动递增 patch 版本)
 * @param versions 现有版本列表 (按创建时间降序排列)
 * @returns 下一个版本号字符串 (如 "v1.0.1")
 */
export function generateNextVersion(versions: PromptVersionInfo[]): string {
  if (versions.length === 0) return "v1.0.0";

  const latestVersion = versions[0]?.version;
  if (!latestVersion) return "v1.0.0";

  const match = latestVersion.match(/v(\d+)\.(\d+)\.(\d+)/);
  if (!match) return "v1.0.0";

  const [, major = "1", minor = "0", patch = "0"] = match;
  return `v${major}.${minor}.${parseInt(patch, 10) + 1}`;
}

/**
 * 解析版本号字符串
 * @param versionStr 版本号字符串 (如 "v1.2.3")
 * @returns 解析后的版本对象,解析失败返回 null
 */
export function parseVersion(
  versionStr: string
): { major: number; minor: number; patch: number } | null {
  const match = versionStr.match(/v(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;

  return {
    major: parseInt(match[1] || "0", 10),
    minor: parseInt(match[2] || "0", 10),
    patch: parseInt(match[3] || "0", 10),
  };
}

/**
 * 比较两个版本号的大小
 * @param v1 版本号 1
 * @param v2 版本号 2
 * @returns 1 (v1 > v2), -1 (v1 < v2), 0 (v1 === v2)
 */
export function compareVersions(v1: string, v2: string): number {
  const parsed1 = parseVersion(v1);
  const parsed2 = parseVersion(v2);

  if (!parsed1 || !parsed2) return 0;

  if (parsed1.major !== parsed2.major) {
    return parsed1.major > parsed2.major ? 1 : -1;
  }

  if (parsed1.minor !== parsed2.minor) {
    return parsed1.minor > parsed2.minor ? 1 : -1;
  }

  if (parsed1.patch !== parsed2.patch) {
    return parsed1.patch > parsed2.patch ? 1 : -1;
  }

  return 0;
}

/**
 * 验证版本号格式是否有效
 * @param versionStr 版本号字符串
 * @returns 是否为有效的语义化版本号
 */
export function isValidVersion(versionStr: string): boolean {
  return /^v\d+\.\d+\.\d+$/.test(versionStr);
}
