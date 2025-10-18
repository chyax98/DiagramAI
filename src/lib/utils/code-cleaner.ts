/**
 * 代码清理工具
 *
 * 设计要点：
 * - 清理 AI 生成代码中的 Markdown 标记和说明文字
 * - 语言特定格式修正（PlantUML, DBML, Graphviz 等）
 * - 标准化空白字符
 */

import { RENDER_LANGUAGES, type RenderLanguage } from "@/lib/constants/diagram-types";

// 语言特定清理函数映射表
type CleanerFunction = (code: string) => string;
const LANGUAGE_CLEANERS: Partial<Record<RenderLanguage, CleanerFunction>> = {
  plantuml: cleanPlantUML,
  dbml: cleanDBML,
  mermaid: cleanMermaid,
  graphviz: cleanGraphviz,
  // d2, wavedrom, nomnoml, excalidraw, c4plantuml, vegalite 使用通用清理
};

/**
 * 清理生成的代码（移除 markdown 标记和常见干扰）
 *
 * @param code - 原始生成的代码
 * @param renderLanguage - 渲染语言
 * @returns 清理后的代码
 */
export function cleanCode(code: string, renderLanguage: RenderLanguage): string {
  // 输入验证
  if (!code || typeof code !== "string") {
    // PlantUML 特殊处理：空输入返回最小结构
    return renderLanguage === "plantuml" ? "@startuml\n\n@enduml" : "";
  }

  let cleaned = code.trim();

  // 空字符串特殊处理
  if (cleaned.length === 0) {
    return renderLanguage === "plantuml" ? "@startuml\n\n@enduml" : "";
  }

  // ==================== 第一步：移除 Markdown 代码块标记 ====================
  // 动态生成语言模式 (从 RENDER_LANGUAGES SSOT 获取)
  // 额外支持常见别名: dot (graphviz), sql (dbml)
  const languagePattern = RENDER_LANGUAGES.map((l) => l.value).join("|");
  const markdownCodeBlockPattern = new RegExp(
    `^\`\`\`(?:${languagePattern}|dot|sql)?\\s*\\n?`,
    "i"
  );
  cleaned = cleaned.replace(markdownCodeBlockPattern, "");
  cleaned = cleaned.replace(/\n?\s*```\s*$/i, "");
  cleaned = cleaned.trim();

  // 移除单反引号包裹
  if (/^`([^`]+)`$/s.test(cleaned)) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  // ==================== 第二步：移除前置说明文字（保守策略） ====================
  // 只移除非常明确的说明性前缀，避免误删代码
  // 示例："这是一个流程图："、"以下是代码："、"Here is the code:"
  const lines = cleaned.split("\n");
  const firstLine = lines[0];

  // 只移除包含明确说明关键词 + 冒号结尾的第一行
  if (
    firstLine &&
    /^(这是.*?[:：]|以下是.*?[:：]|下面是.*?[:：]|代码如下[:：]|Here is.*?:|The following.*?:|Below is.*?:)\s*$/i.test(
      firstLine
    )
  ) {
    // 确保第二行存在且不是空行
    if (lines[1] && lines[1].trim()) {
      cleaned = lines.slice(1).join("\n").trim();
    }
  }

  // ==================== 第三步：移除 HTML 注释 ====================
  // 只在开头或结尾有注释时移除，避免误删代码中的合法内容
  if (cleaned.startsWith("<!--")) {
    cleaned = cleaned.replace(/^<!--[\s\S]*?-->\s*/i, "").trim();
  }
  if (cleaned.endsWith("-->")) {
    cleaned = cleaned.replace(/\s*<!--[\s\S]*?-->$/i, "").trim();
  }

  // ==================== 移除尾部说明文字（极度保守策略） ====================
  // 只移除非常明确的说明性文字，避免误删合法代码
  // 条件：必须是纯中文说明句子（不含任何代码字符）
  const linesForTail = cleaned.split("\n");
  const lastLine = linesForTail[linesForTail.length - 1];

  if (
    lastLine &&
    lastLine.length > 0 &&
    // 必须是纯中文+中文标点（完全不含代码字符）
    /^[\u4e00-\u9fa5，。！？、：；""''（）【】《》\s]+$/.test(lastLine) &&
    // 必须包含明确的说明关键词
    /(这个图表|这张图|说明：|注意：|备注：)/.test(lastLine)
  ) {
    cleaned = linesForTail.slice(0, -1).join("\n").trim();
  }

  // ==================== 第四步：XSS 防护 ====================
  // 移除潜在的恶意脚本和危险标签
  cleaned = sanitizeCode(cleaned);

  // ==================== 第五步：标准化空白字符 ====================
  // 统一换行符
  cleaned = cleaned.replace(/\r\n/g, "\n");

  // 移除行尾空白
  cleaned = cleaned.replace(/[ \t]+$/gm, "");

  // 压缩多余空行 (3+ 空行 → 2 空行)
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  cleaned = cleaned.trim();

  // ==================== 第六步：语言特定处理 ====================
  // 使用映射表替代 switch，从单一数据源驱动
  const languageCleaner = LANGUAGE_CLEANERS[renderLanguage];
  if (languageCleaner) {
    cleaned = languageCleaner(cleaned);
  }

  return cleaned;
}

/**
 * PlantUML 特定清理（确保标记完整且位置正确）
 */
function cleanPlantUML(code: string): string {
  let result = code;

  // 确保有 @startuml
  if (!result.includes("@startuml")) {
    result = "@startuml\n" + result;
  }

  // 确保有 @enduml
  if (!result.includes("@enduml")) {
    result = result + "\n@enduml";
  }

  // 确保 @startuml 在开头
  if (!result.trim().startsWith("@startuml")) {
    result = result.replace(/@startuml/i, "");
    result = "@startuml\n" + result.trim();
  }

  // 确保 @enduml 在结尾
  if (!result.trim().endsWith("@enduml")) {
    const endumlIndex = result.lastIndexOf("@enduml");
    if (endumlIndex !== -1) {
      result = result.substring(0, endumlIndex + "@enduml".length);
    } else {
      result = result.trim() + "\n@enduml";
    }
  }

  return result;
}

/**
 * DBML 特定清理（替换 SQL 语法为 DBML 语法）
 */
function cleanDBML(code: string): string {
  let result = code;

  // SQL CREATE TABLE → DBML Table
  result = result.replace(/CREATE\s+TABLE\s+/gi, "Table ");

  // 移除 SQL 分号
  result = result.replace(/;[\s\n]*$/gm, "");

  return result;
}

/**
 * 通用 XSS 防护（所有语言适用）
 *
 * 移除可能导致 XSS 的恶意内容：
 * - <script> 标签
 * - <iframe> 和其他嵌入标签
 * - javascript: 伪协议
 * - on* 事件处理器
 */
function sanitizeCode(code: string): string {
  let result = code;

  // 移除所有 HTML 标签（图表语言不需要 HTML 标签）
  // 保留标签内容，只移除标签本身
  result = result.replace(/<[^>]+>/g, "");

  // 移除 JavaScript 伪协议
  result = result.replace(/javascript:/gi, "");

  // 移除 data: URLs 中的 script
  result = result.replace(/data:text\/html[^,]*,/gi, "");

  // 移除 on* 事件处理器（如 onclick, onload 等）
  result = result.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "");

  return result;
}

/**
 * Mermaid 特定清理（移除 HTML 标签包裹）
 */
function cleanMermaid(code: string): string {
  // sanitizeCode 已经处理了 HTML 标签，这里只需要返回结果
  return code.trim();
}

/**
 * Graphviz 特定清理（确保有 digraph 声明）
 */
function cleanGraphviz(code: string): string {
  let result = code;

  // 检查是否有 digraph 或 graph 声明
  if (!/^\s*(strict\s+)?(di)?graph\s+/i.test(result)) {
    // 缺少声明，添加默认的 digraph 包裹
    result = `digraph G {\n${result}\n}`;
  }

  return result;
}
