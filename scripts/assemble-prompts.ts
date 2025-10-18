#!/usr/bin/env tsx
/**
 * Prompt Assembly Script - V3 提示词拼接工具
 *
 * 功能:
 * 1. 读取 L1/L2/L3 三层提示词文件
 * 2. 按照 DEPTH 框架 (D/E/P/T/H) 合并提示词
 * 3. 替换占位符 {language} 和 {diagram_type}
 * 4. 生成最终可用的完整提示词
 * 5. 验证输出质量并生成统计报告
 */

import fs from "fs";
import path from "path";

// ============================================================================
// 类型定义
// ============================================================================

interface PromptSegments {
  D: string; // Define - 角色设定
  E: string; // Establish - 成功指标
  P: string; // Provide - 背景信息
  T: string; // Task - 执行任务
  H: string; // Human - 自检回路
}

interface AssembledPrompt {
  language: string;
  diagramType: string;
  prompt: string;
  charCount: number;
  segments: PromptSegments;
}

interface AssemblyStats {
  totalAssembled: number;
  avgCharCount: number;
  minCharCount: number;
  maxCharCount: number;
  byLanguage: Record<string, number>;
}

// ============================================================================
// 常量配置
// ============================================================================

const PROMPTS_DIR = path.join(process.cwd(), "Promote-V3");
const OUTPUT_DIR = path.join(process.cwd(), "dist/prompts");
const DEPTH_MARKERS = ["# D", "# E", "# P", "# T", "# H"] as const;

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 读取提示词文件内容
 */
function readPromptFile(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(`文件不存在: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf-8").trim();
}

/**
 * 解析提示词文件为 DEPTH 段落
 */
function parsePromptSegments(content: string): Partial<PromptSegments> {
  const segments: Partial<PromptSegments> = {};
  const lines = content.split("\n");

  let currentSegment: keyof PromptSegments | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    // 检查是否是新段落标记 (忽略段落标题,只读取后续内容)
    if (line.startsWith("# D ")) {
      if (currentSegment && currentContent.length > 0) {
        segments[currentSegment] = currentContent.join("").trim();
      }
      currentSegment = "D";
      currentContent = []; // 空数组,段落标题不读入
    } else if (line.startsWith("# E ")) {
      if (currentSegment && currentContent.length > 0) {
        segments[currentSegment] = currentContent.join("").trim();
      }
      currentSegment = "E";
      currentContent = [];
    } else if (line.startsWith("# P ")) {
      if (currentSegment && currentContent.length > 0) {
        segments[currentSegment] = currentContent.join("").trim();
      }
      currentSegment = "P";
      currentContent = [];
    } else if (line.startsWith("# T ")) {
      if (currentSegment && currentContent.length > 0) {
        segments[currentSegment] = currentContent.join("").trim();
      }
      currentSegment = "T";
      currentContent = [];
    } else if (line.startsWith("# H ")) {
      if (currentSegment && currentContent.length > 0) {
        segments[currentSegment] = currentContent.join("").trim();
      }
      currentSegment = "H";
      currentContent = [];
    } else if (currentSegment && line.trim()) {
      // 添加到当前段落内容 (不添加换行,因为是长句压缩风格)
      currentContent.push(line);
    }
  }

  // 保存最后一个段落
  if (currentSegment && currentContent.length > 0) {
    segments[currentSegment] = currentContent.join("").trim();
  }

  return segments;
}

/**
 * 合并 DEPTH 段落
 *
 * 合并规则 (按 ASSEMBLY_SPEC.md):
 * - D段: 你同时扮演 [L1角色]、[L2角色]、[L3角色]...
 * - E段: L1;L2;L3 (分号分隔)
 * - P段: L1+L2+L3 (直接连接)
 * - T段: L1+L2+L3 (直接连接)
 * - H段: L1+L2+L3 (直接连接)
 */
function mergeSegments(
  l1: Partial<PromptSegments>,
  l2: Partial<PromptSegments>,
  l3: Partial<PromptSegments>
): PromptSegments {
  const merged: PromptSegments = {
    D: "",
    E: "",
    P: "",
    T: "",
    H: "",
  };

  // D段: 特殊处理 - L1包含目标任务说明,L2/L3是角色补充
  if (l1.D) {
    // L1的D段包含"**目标任务**:"和基础角色,直接作为开头
    let dContent = l1.D.trim();

    // 提取L2和L3的角色名称
    const additionalRoles: string[] = [];
    if (l2.D) {
      const match = l2.D.trim().match(/^(.+?)负责/);
      if (match) additionalRoles.push(match[1]);
    }
    if (l3.D) {
      const match = l3.D.trim().match(/^(.+?)负责/);
      if (match) additionalRoles.push(match[1]);
    }

    // 如果有L2/L3角色,插入到L1的"你同时扮演"之后
    if (additionalRoles.length > 0) {
      dContent = dContent.replace(
        /你同时扮演需求分析专家、图表架构师、代码实现工程师/,
        `你同时扮演需求分析专家、图表架构师、代码实现工程师、${additionalRoles.join("、")}`
      );
    }

    merged.D = dContent;
  }

  // E段: 换行分隔 (保持可读性)
  const constraints: string[] = [];
  if (l1.E) constraints.push(l1.E);
  if (l2.E) constraints.push(l2.E);
  if (l3.E) constraints.push(l3.E);
  merged.E = constraints.filter(Boolean).join("\n\n");

  // P段: 换行分隔 (保持可读性)
  const backgrounds: string[] = [];
  if (l1.P) backgrounds.push(l1.P);
  if (l2.P) backgrounds.push(l2.P);
  if (l3.P) backgrounds.push(l3.P);
  merged.P = backgrounds.filter(Boolean).join("\n\n");

  // T段: 换行分隔 (保持可读性)
  const tasks: string[] = [];
  if (l1.T) tasks.push(l1.T);
  if (l2.T) tasks.push(l2.T);
  if (l3.T) tasks.push(l3.T);
  merged.T = tasks.filter(Boolean).join("\n\n");

  // H段: 换行分隔 (保持可读性)
  const checks: string[] = [];
  if (l1.H) checks.push(l1.H);
  if (l2.H) checks.push(l2.H);
  if (l3.H) checks.push(l3.H);
  merged.H = checks.filter(Boolean).join("\n\n");

  return merged;
}

/**
 * 替换占位符
 */
function replacePlaceholders(content: string, language: string, diagramType: string): string {
  return content.replace(/\{language\}/g, language).replace(/\{diagram_type\}/g, diagramType);
}

/**
 * 格式化最终提示词
 */
function formatFinalPrompt(segments: PromptSegments): string {
  return `# D 角色设定
${segments.D}

# E 成功指标
${segments.E}

# P 背景信息
${segments.P}

# T 执行任务
${segments.T}

# H 自检回路
${segments.H}`;
}

/**
 * 拼接单个提示词
 */
function assemblePrompt(language: string, diagramType: string): AssembledPrompt {
  // 读取 L1 通用层
  const l1Path = path.join(PROMPTS_DIR, "L1.md");
  const l1Content = readPromptFile(l1Path);
  const l1Segments = parsePromptSegments(l1Content);

  // 读取 L2 语言层
  const l2Path = path.join(PROMPTS_DIR, `L2-${language}.md`);
  const l2Content = readPromptFile(l2Path);
  const l2Segments = parsePromptSegments(l2Content);

  // 读取 L3 类型层
  const l3Path = path.join(PROMPTS_DIR, `L3-${language}-${diagramType}.md`);
  const l3Content = readPromptFile(l3Path);
  const l3Segments = parsePromptSegments(l3Content);

  // 合并段落
  const mergedSegments = mergeSegments(l1Segments, l2Segments, l3Segments);

  // 格式化最终提示词
  let finalPrompt = formatFinalPrompt(mergedSegments);

  // 替换占位符
  finalPrompt = replacePlaceholders(finalPrompt, language, diagramType);

  return {
    language,
    diagramType,
    prompt: finalPrompt,
    charCount: finalPrompt.length,
    segments: mergedSegments,
  };
}

/**
 * 获取语言的所有图表类型
 */
function getDiagramTypes(language: string): string[] {
  const files = fs.readdirSync(PROMPTS_DIR);
  const pattern = new RegExp(`^L3-${language}-(.+)\\.md$`);

  return files
    .filter((file) => pattern.test(file))
    .map((file) => {
      const match = file.match(pattern);
      return match ? match[1] : "";
    })
    .filter(Boolean);
}

/**
 * 获取所有支持的语言
 */
function getAllLanguages(): string[] {
  const files = fs.readdirSync(PROMPTS_DIR);
  const pattern = /^L2-(.+)\.md$/;

  return files
    .filter((file) => pattern.test(file))
    .map((file) => {
      const match = file.match(pattern);
      return match ? match[1] : "";
    })
    .filter(Boolean);
}

// ============================================================================
// 主执行逻辑
// ============================================================================

async function main() {
  console.log("🚀 开始拼接 V3 提示词...\n");

  // 确保输出目录存在
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const languages = getAllLanguages();
  console.log(`📋 发现 ${languages.length} 种语言: ${languages.join(", ")}\n`);

  const allPrompts: AssembledPrompt[] = [];
  const stats: AssemblyStats = {
    totalAssembled: 0,
    avgCharCount: 0,
    minCharCount: Infinity,
    maxCharCount: 0,
    byLanguage: {},
  };

  // 遍历所有语言和图表类型
  for (const language of languages) {
    const diagramTypes = getDiagramTypes(language);
    console.log(`  📁 ${language}: ${diagramTypes.length} 种图表类型`);

    stats.byLanguage[language] = diagramTypes.length;

    for (const diagramType of diagramTypes) {
      try {
        const assembled = assemblePrompt(language, diagramType);
        allPrompts.push(assembled);

        // 更新统计
        stats.totalAssembled++;
        stats.minCharCount = Math.min(stats.minCharCount, assembled.charCount);
        stats.maxCharCount = Math.max(stats.maxCharCount, assembled.charCount);

        // 保存到文件
        const outputPath = path.join(OUTPUT_DIR, `${language}-${diagramType}.txt`);
        fs.writeFileSync(outputPath, assembled.prompt, "utf-8");

        console.log(`     ✅ ${language}-${diagramType}: ${assembled.charCount} 字符`);
      } catch (error) {
        console.error(`     ❌ ${language}-${diagramType}: ${(error as Error).message}`);
      }
    }
  }

  // 计算平均字符数
  stats.avgCharCount = Math.round(
    allPrompts.reduce((sum, p) => sum + p.charCount, 0) / allPrompts.length
  );

  // 生成统计报告
  console.log("\n" + "=".repeat(70));
  console.log("📊 拼接统计报告");
  console.log("=".repeat(70));
  console.log(`✅ 总计拼接: ${stats.totalAssembled} 个提示词`);
  console.log(`📏 平均字符数: ${stats.avgCharCount} 字符`);
  console.log(`📐 字符数范围: ${stats.minCharCount} - ${stats.maxCharCount} 字符`);
  console.log(`💾 输出目录: ${OUTPUT_DIR}`);
  console.log("\n按语言统计:");
  for (const [lang, count] of Object.entries(stats.byLanguage)) {
    console.log(`  - ${lang}: ${count} 个`);
  }

  // 保存统计报告
  const statsPath = path.join(OUTPUT_DIR, "assembly-stats.json");
  fs.writeFileSync(
    statsPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        stats,
        prompts: allPrompts.map((p) => ({
          language: p.language,
          diagramType: p.diagramType,
          charCount: p.charCount,
        })),
      },
      null,
      2
    )
  );

  console.log(`\n📄 统计报告已保存: ${statsPath}`);
  console.log("\n✨ 拼接完成!");
}

// 执行主函数
main().catch(console.error);
