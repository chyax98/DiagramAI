/**
 * CodeMirror 自定义主题
 *
 * 与应用 Indigo-Violet 配色系统保持一致
 * 基于 globals.css 中的 CSS 变量定义
 */

import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

/**
 * Indigo-Violet 亮色主题
 *
 * 配色参考:
 * - 主题色: Indigo (#6366f1)
 * - 辅助色: Violet (#8b5cf6)
 * - 背景: 白色/浅灰
 */
export const indigoLightTheme = createTheme({
  theme: "light",
  settings: {
    background: "#ffffff", // 白色背景
    foreground: "#1e293b", // slate-800 文字
    caret: "#6366f1", // indigo-500 光标
    selection: "#e0e7ff", // indigo-100 选中背景
    selectionMatch: "#ddd6fe", // violet-200 匹配高亮
    lineHighlight: "#f1f5f9", // slate-100 行高亮
    gutterBackground: "#f8fafc", // slate-50 行号背景
    gutterForeground: "#64748b", // slate-500 行号文字
    gutterBorder: "#e2e8f0", // slate-200 行号边框
  },
  styles: [
    // 注释 - 灰色
    { tag: t.comment, color: "#64748b" }, // slate-500

    // 关键字 - Indigo
    { tag: t.keyword, color: "#6366f1" }, // indigo-500

    // 变量名 - 深色
    { tag: t.variableName, color: "#1e293b" }, // slate-800

    // 字符串 - Violet
    { tag: [t.string, t.special(t.brace)], color: "#8b5cf6" }, // violet-500

    // 数字 - Emerald
    { tag: t.number, color: "#10b981" }, // emerald-500

    // 布尔值 - Amber
    { tag: t.bool, color: "#f59e0b" }, // amber-500

    // null - 灰色
    { tag: t.null, color: "#6b7280" }, // gray-500

    // 操作符 - 深色
    { tag: t.operator, color: "#475569" }, // slate-600

    // 类名 - Indigo
    { tag: t.className, color: "#4f46e5" }, // indigo-600

    // 类型名 - Violet
    { tag: [t.typeName, t.definition(t.typeName)], color: "#7c3aed" }, // violet-600

    // 标签 - Indigo
    { tag: [t.tagName, t.angleBracket], color: "#6366f1" }, // indigo-500

    // 属性名 - Violet
    { tag: t.attributeName, color: "#a78bfa" }, // violet-400

    // 函数名 - Indigo
    { tag: t.function(t.variableName), color: "#4f46e5" }, // indigo-600
  ],
});

/**
 * Indigo-Violet 暗色主题
 *
 * 配色参考:
 * - 主题色: Indigo-400 (#818cf8)
 * - 辅助色: Violet-400 (#a78bfa)
 * - 背景: Slate-950/Slate-900
 */
export const indigoDarkTheme = createTheme({
  theme: "dark",
  settings: {
    background: "#0f172a", // slate-950 背景
    foreground: "#e2e8f0", // slate-200 文字
    caret: "#818cf8", // indigo-400 光标
    selection: "#3730a3", // indigo-800 选中背景
    selectionMatch: "#5b21b6", // violet-800 匹配高亮
    lineHighlight: "#1e293b", // slate-800 行高亮
    gutterBackground: "#0f172a", // slate-950 行号背景
    gutterForeground: "#64748b", // slate-500 行号文字
    gutterBorder: "#334155", // slate-700 行号边框
  },
  styles: [
    // 注释 - 灰色
    { tag: t.comment, color: "#94a3b8" }, // slate-400

    // 关键字 - Indigo
    { tag: t.keyword, color: "#818cf8" }, // indigo-400

    // 变量名 - 浅色
    { tag: t.variableName, color: "#e2e8f0" }, // slate-200

    // 字符串 - Violet
    { tag: [t.string, t.special(t.brace)], color: "#a78bfa" }, // violet-400

    // 数字 - Emerald
    { tag: t.number, color: "#34d399" }, // emerald-400

    // 布尔值 - Amber
    { tag: t.bool, color: "#fbbf24" }, // amber-400

    // null - 灰色
    { tag: t.null, color: "#9ca3af" }, // gray-400

    // 操作符 - 浅灰
    { tag: t.operator, color: "#cbd5e1" }, // slate-300

    // 类名 - Indigo
    { tag: t.className, color: "#a5b4fc" }, // indigo-300

    // 类型名 - Violet
    { tag: [t.typeName, t.definition(t.typeName)], color: "#c4b5fd" }, // violet-300

    // 标签 - Indigo
    { tag: [t.tagName, t.angleBracket], color: "#818cf8" }, // indigo-400

    // 属性名 - Violet
    { tag: t.attributeName, color: "#c4b5fd" }, // violet-300

    // 函数名 - Indigo
    { tag: t.function(t.variableName), color: "#a5b4fc" }, // indigo-300
  ],
});
