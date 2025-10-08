/**
 * 工具函数 - 类名合并
 *
 * 用于合并多个 className，过滤掉 undefined 和 false
 */

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
