#!/usr/bin/env tsx
/**
 * 测试数据库 Prompt 加载功能
 *
 * 执行: npx tsx scripts/test-db-prompt-loader.ts
 */

import { loadPromptTOML } from "../src/lib/utils/prompt-toml-loader";

async function testPromptLoader() {
  console.log("🧪 测试数据库 Prompt 加载功能...\n");

  const testCases = [
    { language: "mermaid", type: "flowchart", label: "Mermaid 流程图" },
    { language: "plantuml", type: "sequence", label: "PlantUML 时序图" },
    { language: "d2", type: "architecture", label: "D2 架构图" },
  ];

  let successCount = 0;
  let failCount = 0;

  for (const testCase of testCases) {
    try {
      console.log(`📋 测试: ${testCase.label} (${testCase.language}/${testCase.type})`);

      const result = await loadPromptTOML(testCase.language as any, testCase.type);

      // 验证返回结果
      if (!result.l1_content) {
        throw new Error("L1 content is empty");
      }
      if (!result.l3_content) {
        throw new Error("L3 content is empty");
      }
      if (!result.final_system_prompt) {
        throw new Error("Final system prompt is empty");
      }

      console.log(`   ✅ L1 版本: ${result.versions.l1_version}`);
      if (result.l2_content) {
        console.log(`   ✅ L2 版本: ${result.versions.l2_version} (${result.l2_content.length} 字符)`);
      } else {
        console.log(`   ⏭️  L2: 无 (可选)`);
      }
      console.log(`   ✅ L3 版本: ${result.versions.l3_version}`);
      console.log(`   ✅ 最终 Prompt: ${result.final_system_prompt.length} 字符`);
      console.log("");

      successCount++;
    } catch (error) {
      console.error(`   ❌ 失败: ${error instanceof Error ? error.message : String(error)}`);
      console.log("");
      failCount++;
    }
  }

  console.log("\n📊 测试统计:");
  console.log(`   ✅ 成功: ${successCount} 个`);
  console.log(`   ❌ 失败: ${failCount} 个`);

  if (failCount === 0) {
    console.log("\n🎉 所有测试通过!");
  } else {
    console.log("\n⚠️  存在失败的测试");
    process.exit(1);
  }
}

testPromptLoader();
