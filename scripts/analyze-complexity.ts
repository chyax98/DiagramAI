#!/usr/bin/env tsx

import fs from "fs";
import path from "path";

const PROMPTS_DIR = path.join(process.cwd(), "data/prompts");

interface ComplexityIndicators {
  mustRules: number; // "必须"/"MUST"/"CRITICAL" 等强制规则
  forbiddenRules: number; // "禁止"/"NEVER"/"不要" 等禁止规则
  alignmentRules: number; // 对齐要求关键词
  coordinateRules: number; // 坐标/单位相关
  symbolRules: number; // 符号/箭头等特殊字符规则
  lengthLines: number; // 文件行数
  lengthChars: number; // 文件字符数
  exampleCount: number; // 示例数量
  constraintSections: number; // "约束"/"限制"/"规则" 章节数
}

interface LanguageComplexity {
  language: string;
  totalFiles: number;
  totalLines: number;
  avgLinesPerFile: number;
  indicators: ComplexityIndicators;
  complexityScore: number;
  mostComplexType: string;
  mostComplexLines: number;
  sampleContent: string;
}

// 分析单个文件
function analyzeFile(filePath: string): ComplexityIndicators {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  return {
    mustRules: (content.match(/必须|MUST|CRITICAL|强制|严格|REQUIRED/gi) || []).length,
    forbiddenRules: (content.match(/禁止|NEVER|不要|不能|FORBIDDEN|AVOID/gi) || []).length,
    alignmentRules: (content.match(/对齐|align|缩进|indent|空格|spacing|格式|format/gi) || [])
      .length,
    coordinateRules: (
      content.match(/坐标|coordinate|位置|position|单位|unit|像素|px|cm|mm/gi) || []
    ).length,
    symbolRules: (content.match(/箭头|arrow|符号|symbol|字符|character|标记|marker/gi) || [])
      .length,
    lengthLines: lines.length,
    lengthChars: content.length,
    exampleCount: (content.match(/示例|example|案例|sample/gi) || []).length,
    constraintSections: (
      content.match(/^#+\s*(约束|限制|规则|注意|Constraints|Rules|Notes)/gim) || []
    ).length,
  };
}

// 合并指标
function mergeIndicators(indicators: ComplexityIndicators[]): ComplexityIndicators {
  const merged: ComplexityIndicators = {
    mustRules: 0,
    forbiddenRules: 0,
    alignmentRules: 0,
    coordinateRules: 0,
    symbolRules: 0,
    lengthLines: 0,
    lengthChars: 0,
    exampleCount: 0,
    constraintSections: 0,
  };

  indicators.forEach((ind) => {
    Object.keys(merged).forEach((key) => {
      merged[key as keyof ComplexityIndicators] += ind[key as keyof ComplexityIndicators];
    });
  });

  return merged;
}

// 计算复杂度分数 (1-10)
function calculateComplexityScore(indicators: ComplexityIndicators, avgLines: number): number {
  let score = 0;

  // 规则密度 (每100行的规则数)
  const ruleDensity =
    (indicators.mustRules + indicators.forbiddenRules) / (indicators.lengthLines / 100);
  score += Math.min(ruleDensity / 5, 3); // 0-3分

  // 对齐和坐标要求
  const geometricComplexity = (indicators.alignmentRules + indicators.coordinateRules) / 10;
  score += Math.min(geometricComplexity, 2); // 0-2分

  // 符号复杂度
  const symbolComplexity = indicators.symbolRules / 15;
  score += Math.min(symbolComplexity, 2); // 0-2分

  // 文件长度 (长文件通常更复杂)
  const lengthFactor = avgLines / 200;
  score += Math.min(lengthFactor, 2); // 0-2分

  // 约束章节数量
  const constraintFactor = indicators.constraintSections / 5;
  score += Math.min(constraintFactor, 1); // 0-1分

  return Math.min(Math.round(score * 10) / 10, 10);
}

// 分析语言目录
function analyzeLanguage(languageDir: string): LanguageComplexity | null {
  const fullPath = path.join(PROMPTS_DIR, languageDir);

  if (!fs.statSync(fullPath).isDirectory()) return null;

  const files = fs.readdirSync(fullPath).filter((f) => f.endsWith(".txt"));
  if (files.length === 0) return null;

  const fileIndicators = files.map((f) => analyzeFile(path.join(fullPath, f)));
  const fileSizes = files.map((f) => {
    const content = fs.readFileSync(path.join(fullPath, f), "utf-8");
    return { file: f, lines: content.split("\n").length };
  });

  const mostComplex = fileSizes.sort((a, b) => b.lines - a.lines)[0];
  if (!mostComplex) return null; // 防御性检查

  const totalLines = fileSizes.reduce((sum, f) => sum + f.lines, 0);
  const avgLines = totalLines / files.length;

  const merged = mergeIndicators(fileIndicators);
  const score = calculateComplexityScore(merged, avgLines);

  // 获取最复杂文件的示例内容
  const samplePath = path.join(fullPath, mostComplex.file);
  const sampleContent = fs.readFileSync(samplePath, "utf-8").split("\n").slice(0, 50).join("\n");

  return {
    language: languageDir,
    totalFiles: files.length,
    totalLines,
    avgLinesPerFile: Math.round(avgLines),
    indicators: merged,
    complexityScore: score,
    mostComplexType: mostComplex.file.replace(".txt", ""),
    mostComplexLines: mostComplex.lines,
    sampleContent,
  };
}

// 主函数
function main() {
  const languages = fs
    .readdirSync(PROMPTS_DIR)
    .filter((f) => fs.statSync(path.join(PROMPTS_DIR, f)).isDirectory());

  const results = languages
    .map(analyzeLanguage)
    .filter((r): r is LanguageComplexity => r !== null)
    .sort((a, b) => b.complexityScore - a.complexityScore);

  // 生成Markdown报告
  let report = `# 图表语言语法复杂度分析报告

> 生成时间: ${new Date().toLocaleString("zh-CN")}

---

## 📊 Top 10 最复杂语言排行榜

| 排名 | 语言 | 复杂度评分 | 平均行数/文件 | 强制规则 | 对齐要求 | 符号规则 | 最复杂类型 |
|------|------|-----------|--------------|----------|----------|----------|-----------|
`;

  results.slice(0, 10).forEach((r, i) => {
    report += `| ${i + 1} | **${r.language}** | **${r.complexityScore}/10** | ${r.avgLinesPerFile} | ${r.indicators.mustRules} | ${r.indicators.alignmentRules} | ${r.indicators.symbolRules} | \`${r.mostComplexType}\` (${r.mostComplexLines}行) |\n`;
  });

  report += `\n---\n\n## 📋 详细分析\n\n`;

  results.forEach((r, i) => {
    const rank = i + 1;
    report += `### ${rank}. ${r.language.toUpperCase()}\n\n`;
    report += `**复杂度评分**: ${r.complexityScore}/10\n\n`;
    report += `**统计数据**:\n`;
    report += `- 总文件数: ${r.totalFiles}\n`;
    report += `- 总行数: ${r.totalLines}\n`;
    report += `- 平均行数/文件: ${r.avgLinesPerFile}\n\n`;

    report += `**识别的复杂特征**:\n`;
    if (r.indicators.mustRules > 10) {
      report += `1. **强制规则密集** - 包含 ${r.indicators.mustRules} 处"必须"/"MUST"等强制性要求\n`;
    }
    if (r.indicators.forbiddenRules > 10) {
      report += `2. **禁止规则严格** - 包含 ${r.indicators.forbiddenRules} 处"禁止"/"NEVER"等限制性规则\n`;
    }
    if (r.indicators.alignmentRules > 15) {
      report += `3. **对齐要求复杂** - ${r.indicators.alignmentRules} 处对齐/缩进/格式要求\n`;
    }
    if (r.indicators.coordinateRules > 10) {
      report += `4. **坐标系统精确** - ${r.indicators.coordinateRules} 处坐标/单位/位置相关规则\n`;
    }
    if (r.indicators.symbolRules > 20) {
      report += `5. **符号约束严格** - ${r.indicators.symbolRules} 处箭头/符号/字符特殊要求\n`;
    }
    if (r.avgLinesPerFile > 150) {
      report += `6. **文档长度超长** - 平均每个文件 ${r.avgLinesPerFile} 行,学习成本高\n`;
    }

    report += `\n**最复杂的图表类型**:\n`;
    report += `- \`${r.mostComplexType}\`: ${r.mostComplexLines} 行 (${r.complexityScore >= 7 ? "极高复杂度" : r.complexityScore >= 5 ? "中高复杂度" : "中等复杂度"})\n\n`;

    report += `**示例Prompt摘录** (前50行):\n\n`;
    report += "```\n" + r.sampleContent + "\n```\n\n";

    report += `**建议**:\n`;
    if (r.complexityScore >= 8) {
      report += `- ⚠️ **高度复杂** - 建议简化语法规则或提供更多示例辅助\n`;
      report += `- 考虑是否真正需要此语言,用户学习成本极高\n`;
      report += `- AI生成错误率可能较高,需要加强错误处理\n`;
    } else if (r.complexityScore >= 6) {
      report += `- ⚡ **中度复杂** - 保留但需优化prompt结构\n`;
      report += `- 增加常见场景的模板示例\n`;
      report += `- 强化语法检查和错误提示\n`;
    } else {
      report += `- ✅ **复杂度可控** - 保持现有结构即可\n`;
    }

    report += `\n---\n\n`;
  });

  // 添加总结建议
  report += `## 🎯 总体建议\n\n`;
  report += `### 建议简化/删除的语言 (复杂度 >= 8)\n\n`;
  const highComplexity = results.filter((r) => r.complexityScore >= 8);
  if (highComplexity.length > 0) {
    highComplexity.forEach((r) => {
      report += `- **${r.language}** (${r.complexityScore}/10) - 语法规则过于复杂,AI生成成功率可能较低\n`;
    });
  } else {
    report += `无极高复杂度语言\n`;
  }

  report += `\n### 需要优化的语言 (6 <= 复杂度 < 8)\n\n`;
  const mediumComplexity = results.filter((r) => r.complexityScore >= 6 && r.complexityScore < 8);
  if (mediumComplexity.length > 0) {
    mediumComplexity.forEach((r) => {
      report += `- **${r.language}** (${r.complexityScore}/10) - 可以通过增加示例、简化规则来降低复杂度\n`;
    });
  } else {
    report += `无需优化语言\n`;
  }

  report += `\n### 表现良好的语言 (复杂度 < 6)\n\n`;
  const lowComplexity = results.filter((r) => r.complexityScore < 6);
  report += `共 ${lowComplexity.length} 种语言复杂度适中,建议保持现状\n`;

  // 写入文件
  const outputPath = path.join(process.cwd(), "claudedocs/syntax-complexity-analysis.md");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, report, "utf-8");

  console.log(`✅ 分析完成! 报告已保存至: ${outputPath}`);
  console.log(`\n📊 统计摘要:`);
  console.log(`- 总语言数: ${results.length}`);
  console.log(`- 高复杂度 (>=8): ${highComplexity.length}`);
  console.log(`- 中复杂度 (6-8): ${mediumComplexity.length}`);
  console.log(`- 低复杂度 (<6): ${lowComplexity.length}`);
  console.log(`\nTop 3 最复杂语言:`);
  results.slice(0, 3).forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.language}: ${r.complexityScore}/10`);
  });
}

main();
