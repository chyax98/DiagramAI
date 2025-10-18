/**
 * 测试 Promote-V4 TOML Loader
 *
 * 用途: 验证 TOML 加载器能否正确加载和拼接三层 Prompt
 */

import { loadPromptTOML } from "../src/lib/utils/prompt-toml-loader";
import type { RenderLanguage } from "../src/lib/constants/diagram-types";

/**
 * 测试用例
 */
const testCases: Array<{ language: RenderLanguage; type: string }> = [
  // Mermaid
  { language: "mermaid", type: "flowchart" },
  { language: "mermaid", type: "sequence" },
  { language: "mermaid", type: "class" },

  // PlantUML
  { language: "plantuml", type: "sequence" },
  { language: "plantuml", type: "class" },

  // DBML
  { language: "dbml", type: "erd" },

  // Excalidraw
  { language: "excalidraw", type: "sketch" },

  // GraphViz
  { language: "graphviz", type: "flowchart" },
];

async function main() {
  console.log("🧪 测试 Promote-V4 TOML Loader\n");
  console.log("=" + "=".repeat(79) + "\n");

  let passed = 0;
  let failed = 0;

  for (const { language, type } of testCases) {
    try {
      console.log(`📝 测试: ${language}/${type}`);

      const result = await loadPromptTOML(language, type);

      // 验证结果
      if (!result.l1_content) {
        throw new Error("L1 content is empty");
      }
      if (!result.l3_content) {
        throw new Error("L3 content is empty");
      }
      if (!result.final_system_prompt) {
        throw new Error("Final system prompt is empty");
      }

      console.log(`   ✅ 通过`);
      console.log(`      L1 版本: ${result.versions.l1_version}`);
      console.log(`      L2 版本: ${result.versions.l2_version || "N/A"}`);
      console.log(`      L3 版本: ${result.versions.l3_version}`);
      console.log(`      最终 Prompt 长度: ${result.final_system_prompt.length} 字符`);
      console.log();

      passed++;
    } catch (error) {
      console.log(`   ❌ 失败`);
      console.log(`      错误: ${error instanceof Error ? error.message : String(error)}`);
      console.log();
      failed++;
    }
  }

  console.log("=" + "=".repeat(79));
  console.log(`\n📊 测试结果:`);
  console.log(`   总计: ${testCases.length}`);
  console.log(`   ✅ 通过: ${passed}`);
  console.log(`   ❌ 失败: ${failed}`);
  console.log(`   成功率: ${((passed / testCases.length) * 100).toFixed(1)}%`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("测试失败:", error);
  process.exit(1);
});
