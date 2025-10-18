/**
 * 预览生成的 Prompt
 */

import { loadPromptTOML } from "../src/lib/utils/prompt-toml-loader";

async function main() {
  const language = process.argv[2] || "mermaid";
  const type = process.argv[3] || "flowchart";

  console.log(`📝 预览: ${language}/${type}\n`);
  console.log("=" + "=".repeat(79) + "\n");

  const result = await loadPromptTOML(language as any, type);

  console.log(result.final_system_prompt);

  console.log("\n" + "=" + "=".repeat(79));
  console.log(`\n📊 统计:`);
  console.log(`   L1 版本: ${result.versions.l1_version}`);
  console.log(`   L2 版本: ${result.versions.l2_version || "N/A"}`);
  console.log(`   L3 版本: ${result.versions.l3_version}`);
  console.log(`   总长度: ${result.final_system_prompt.length} 字符`);
}

main().catch(console.error);
