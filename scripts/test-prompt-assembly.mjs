#!/usr/bin/env node
/**
 * Prompt Assembly Smoke Test (Promote-V2)
 *
 * 用途：
 *   - 将 Promote-V2 下的 L1/L2/L3 提示词拼接成最终提示
 *   - 检查关键段落是否缺失、字符数是否落在预期区间
 *   - 生成输出文件及统计信息，便于快速自测
 *
 * 运行示例：
 *   node scripts/test-prompt-assembly.mjs
 *   node scripts/test-prompt-assembly.mjs --languages=mermaid,plantuml --types=flowchart,sequence
 *   node scripts/test-prompt-assembly.mjs --all --verbose
 */

import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// 常量配置
// ---------------------------------------------------------------------------

const PROMPTS_DIR = path.join(process.cwd(), "Promote-V2");
const OUTPUT_DIR = path.join(process.cwd(), "dist/prompts-v2");
const DEFAULT_LANGUAGES = ["mermaid", "plantuml", "dbml", "excalidraw", "graphviz"];
const DEPTH_LABELS = {
  D: "角色设定",
  E: "成功指标",
  P: "背景信息",
  T: "执行任务",
  H: "自检回路",
};

const depthHeaderRegex = /^#\s*([DEPTH])\b/;

// ---------------------------------------------------------------------------
// CLI 参数解析
// ---------------------------------------------------------------------------

function parseCliOptions() {
  const args = process.argv.slice(2);
  const options = {
    languages: [...DEFAULT_LANGUAGES],
    diagramTypesFilter: null,
    includeAllLanguages: false,
    verbose: false,
  };

  for (const arg of args) {
    if (arg === "--all") {
      options.includeAllLanguages = true;
    } else if (arg.startsWith("--languages=")) {
      const value = arg.split("=")[1] ?? "";
      const langs = value
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);
      if (langs.length > 0) {
        options.languages = langs;
      }
    } else if (arg.startsWith("--types=")) {
      const value = arg.split("=")[1] ?? "";
      const types = value
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);
      options.diagramTypesFilter = types.length > 0 ? types : null;
    } else if (arg === "--verbose") {
      options.verbose = true;
    }
  }

  return options;
}

// ---------------------------------------------------------------------------
// 文件工具
// ---------------------------------------------------------------------------

function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readFileContent(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`文件不存在: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf-8").trim();
}

// ---------------------------------------------------------------------------
// 提示词解析 & 合并
// ---------------------------------------------------------------------------

function parseSegments(markdown) {
  const segments = {};
  const lines = markdown.split(/\r?\n/);

  let currentKey = null;
  let buffer = [];

  const commit = () => {
    if (currentKey && buffer.length > 0) {
      const value = buffer
        .map(line => line.trim())
        .filter(Boolean)
        .join(" ")
        .trim();
      if (value) {
        segments[currentKey] = value;
      }
    }
    buffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const headerMatch = line.match(depthHeaderRegex);

    if (headerMatch) {
      commit();
      currentKey = headerMatch[1];
      continue;
    }

    if (currentKey) {
      buffer.push(rawLine);
    }
  }

  commit();

  return segments;
}

function mergeSegments(l1, l2, l3) {
  const join = (...parts) =>
    parts
      .filter(part => part && String(part).trim().length > 0)
      .map(part => String(part).trim())
      .join("");

  return {
    D: join(l1.D, l2.D, l3.D),
    E: join(l1.E, l2.E, l3.E),
    P: join(l1.P, l2.P, l3.P),
    T: join(l1.T, l2.T, l3.T),
    H: join(l1.H, l2.H, l3.H),
  };
}

function formatPrompt(segments) {
  return (`# D ${DEPTH_LABELS.D}\n${segments.D}\n\n` +
    `# E ${DEPTH_LABELS.E}\n${segments.E}\n\n` +
    `# P ${DEPTH_LABELS.P}\n${segments.P}\n\n` +
    `# T ${DEPTH_LABELS.T}\n${segments.T}\n\n` +
    `# H ${DEPTH_LABELS.H}\n${segments.H}`).trim();
}

// ---------------------------------------------------------------------------
// 组装逻辑
// ---------------------------------------------------------------------------

function getAllLanguages() {
  const files = fs.readdirSync(PROMPTS_DIR);
  const pattern = /^L2-(.+)\.md$/;
  return files
    .map(file => {
      const match = file.match(pattern);
      return match ? match[1] : null;
    })
    .filter(Boolean)
    .sort();
}

function getDiagramTypes(language) {
  const files = fs.readdirSync(PROMPTS_DIR);
  const pattern = new RegExp(`^L3-${language}-(.+)\\.md$`);
  return files
    .map(file => {
      const match = file.match(pattern);
      return match ? match[1] : null;
    })
    .filter(Boolean)
    .sort();
}

function assemblePrompt(language, diagramType, verbose = false) {
  const l1Path = path.join(PROMPTS_DIR, "L1.md");
  const l2Path = path.join(PROMPTS_DIR, `L2-${language}.md`);
  const l3Path = path.join(PROMPTS_DIR, `L3-${language}-${diagramType}.md`);

  const l1Segments = parseSegments(readFileContent(l1Path));
  const l2Segments = parseSegments(readFileContent(l2Path));
  const l3Segments = parseSegments(readFileContent(l3Path));

  const segments = mergeSegments(l1Segments, l2Segments, l3Segments);
  const prompt = formatPrompt(segments);
  const charCount = prompt.length;

  const warnings = [];
  ["D", "E", "P", "T", "H"].forEach(key => {
    if (!segments[key] || segments[key].length === 0) {
      warnings.push(`缺少 ${DEPTH_LABELS[key]} 段内容`);
    }
  });

  if (charCount < 1500 || charCount > 5000) {
    warnings.push(`字符数 ${charCount} 超出推荐范围 (1500-5000)`);
  }

  if (verbose) {
    console.log("\n----------------------------------------");
    console.log(`语言: ${language} | 类型: ${diagramType}`);
    console.log(`字符数: ${charCount}`);
    if (warnings.length > 0) {
      console.log(`⚠️  警告: ${warnings.join("; ")}`);
    }
  }

  return { language, diagramType, segments, prompt, charCount, warnings };
}

// ---------------------------------------------------------------------------
// 主流程
// ---------------------------------------------------------------------------

function main() {
  const options = parseCliOptions();

  const languages = options.includeAllLanguages
    ? getAllLanguages()
    : options.languages;

  if (languages.length === 0) {
    console.error("❌ 未指定语言，使用 --languages 或 --all 进行配置");
    process.exit(1);
  }

  ensureDirectory(OUTPUT_DIR);

  const assembled = [];

  console.log("🚀 开始拼接 Promote-V2 提示词...\n");
  console.log(`📋 语言列表: ${languages.join(", ")}`);
  if (options.diagramTypesFilter) {
    console.log(`🎯 仅测试类型: ${options.diagramTypesFilter.join(", ")}`);
  }
  console.log("");

  for (const language of languages) {
    const allTypes = getDiagramTypes(language);
    if (allTypes.length === 0) {
      console.warn(`⚠️  未找到 ${language} 的 L3 提示词，跳过`);
      continue;
    }

    const targetTypes = options.diagramTypesFilter
      ? allTypes.filter(type => options.diagramTypesFilter.includes(type))
      : allTypes;

    if (targetTypes.length === 0) {
      console.warn(`⚠️  ${language} 未匹配指定类型，跳过`);
      continue;
    }

    console.log(`📦 ${language}: ${targetTypes.length} 个图表类型`);

    for (const diagramType of targetTypes) {
      try {
        const result = assemblePrompt(language, diagramType, options.verbose);
        assembled.push(result);

        const outputPath = path.join(
          OUTPUT_DIR,
          `${language}-${diagramType}.md`
        );
        fs.writeFileSync(outputPath, result.prompt, "utf-8");

        const flag = result.warnings.length > 0 ? "⚠️" : "✅";
        console.log(`  ${flag} ${language}-${diagramType} (${result.charCount} 字符)`);
        if (options.verbose && result.warnings.length > 0) {
          result.warnings.forEach(w => console.log(`     ↳ ${w}`));
        }
      } catch (error) {
        console.error(
          `  ❌ ${language}-${diagramType} 组装失败: ${error.message}`
        );
      }
    }
  }

  if (assembled.length === 0) {
    console.warn("⚠️ 未生成任何提示词，请检查语言/类型配置");
    return;
  }

  const charCounts = assembled.map(item => item.charCount);
  const totalChars = charCounts.reduce((sum, value) => sum + value, 0);
  const avgChars = Math.round(totalChars / assembled.length);
  const minChars = Math.min(...charCounts);
  const maxChars = Math.max(...charCounts);
  const warningsTotal = assembled.reduce((sum, item) => sum + item.warnings.length, 0);

  const stats = {
    timestamp: new Date().toISOString(),
    totalPrompts: assembled.length,
    totalChars,
    avgChars,
    minChars,
    maxChars,
    warningsTotal,
    details: assembled.map(item => ({
      language: item.language,
      diagramType: item.diagramType,
      charCount: item.charCount,
      warnings: item.warnings,
    })),
  };

  const statsPath = path.join(OUTPUT_DIR, "assembly-stats.json");
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), "utf-8");

  console.log("\n==================== 总结 ====================");
  console.log(`✅ 生成提示词数量: ${stats.totalPrompts}`);
  console.log(`📏 平均字符数: ${stats.avgChars}`);
  console.log(`📐 字符数范围: ${stats.minChars} - ${stats.maxChars}`);
  console.log(`⚠️ 总警告数: ${stats.warningsTotal}`);
  console.log(`💾 输出目录: ${OUTPUT_DIR}`);
  console.log(`📝 统计文件: ${statsPath}`);
  console.log("==============================================");
}

main();
