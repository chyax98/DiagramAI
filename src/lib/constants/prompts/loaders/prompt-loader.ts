/**
 * Prompt 加载器
 *
 * 从 .txt 文件加载 prompt 内容，提供内存缓存和完整 prompt 构建功能
 *
 * 特点:
 * - 零依赖: 只使用 Node.js 原生 fs 模块
 * - 内存缓存: 首次加载后缓存，后续访问<1ms
 * - 类型安全: TypeScript 类型检查和自动完成
 * - 简洁实现: ~100 行代码
 */

import fs from "fs";
import path from "path";
import type { RenderLanguage, DiagramType } from "@/lib/constants/diagram-types";

/**
 * Prompt 加载器类
 */
class PromptLoader {
  /** 内存缓存: key = "language:type", value = prompt 内容 */
  private cache = new Map<string, string>();

  /** Prompt 数据目录 */
  private readonly dataDir: string;

  constructor() {
    // Prompt 目录: src/lib/constants/prompts/
    // .txt 文件直接放在各语言目录下（如 mermaid/flowchart.txt）
    this.dataDir = path.join(process.cwd(), "src/lib/constants/prompts");
  }

  /**
   * 获取 prompt 内容
   *
   * @param language - 渲染语言 (如 "mermaid")
   * @param type - 图表类型 (如 "flowchart")
   * @returns prompt 文本内容
   *
   * @example
   * ```typescript
   * const loader = new PromptLoader();
   * const content = loader.getPrompt('mermaid', 'flowchart');
   * ```
   */
  getPrompt(language: string, type: string): string {
    const key = this.getCacheKey(language, type);

    // 检查缓存
    if (!this.cache.has(key)) {
      const content = this.loadPromptFile(language, type);
      this.cache.set(key, content);
    }

    return this.cache.get(key)!;
  }

  /**
   * 构建完整 prompt
   *
   * 组合结构: 任务上下文 + L1通用规范 + L2语言规范 + L3类型规范 + 用户需求
   *
   * @param language - 渲染语言
   * @param type - 图表类型
   * @param userInput - 用户输入
   * @returns 完整的 prompt 文本
   *
   * @example
   * ```typescript
   * const prompt = loader.buildFullPrompt('mermaid', 'flowchart', '用户登录流程');
   * // 返回: 任务上下文 + 通用规范 + Mermaid规范 + Flowchart规范 + 用户需求
   * ```
   */
  buildFullPrompt(
    language: RenderLanguage,
    type: DiagramType,
    userInput: string
  ): string {
    // 1. 任务上下文: 明确当前任务参数
    const taskContext = this.buildTaskContext(language, type);

    // 2. L1: 通用规范 (所有图表共享)
    const universal = this.getPromptSafe("common", "universal");

    // 3. L2: 语言规范 (如 Mermaid 通用规范)
    const languagePrompt = this.getPromptSafe(language, "common");

    // 4. L3: 类型规范 (如 Flowchart 特定要求)
    const typePrompt = this.getPrompt(language, type);

    // 5. 用户需求
    const userRequirement = `\n\n用户需求:\n${userInput}`;

    // 组合所有部分
    const parts = [taskContext, universal, languagePrompt, typePrompt, userRequirement];

    // 过滤空内容并用分隔符连接
    return parts.filter((p) => p && p.trim().length > 0).join("\n\n---\n\n");
  }

  /**
   * 构建完整 prompt (不包含用户输入)
   *
   * 组合结构: 任务上下文 + L1通用规范 + L2语言规范 + L3类型规范
   *
   * 用于向后兼容的场景,用户输入由调用方单独传递
   *
   * @param language - 渲染语言
   * @param type - 图表类型
   * @returns 完整的 prompt 文本(不包含用户输入部分)
   *
   * @example
   * ```typescript
   * const prompt = loader.buildFullPromptWithoutUserInput('mermaid', 'flowchart');
   * // 返回: 任务上下文 + 通用规范 + Mermaid规范 + Flowchart规范
   * ```
   */
  buildFullPromptWithoutUserInput(
    language: RenderLanguage,
    type: DiagramType
  ): string {
    // 1. 任务上下文: 明确当前任务参数
    const taskContext = this.buildTaskContext(language, type);

    // 2. L1: 通用规范 (所有图表共享)
    const universal = this.getPromptSafe("common", "universal");

    // 3. L2: 语言规范 (如 Mermaid 通用规范)
    const languagePrompt = this.getPromptSafe(language, "common");

    // 4. L3: 类型规范 (如 Flowchart 特定要求)
    const typePrompt = this.getPrompt(language, type);

    // 组合所有部分 (不包含用户需求)
    const parts = [taskContext, universal, languagePrompt, typePrompt];

    // 过滤空内容并用分隔符连接
    return parts.filter((p) => p && p.trim().length > 0).join("\n\n---\n\n");
  }

  /**
   * 安全获取 prompt (如果不存在返回空字符串)
   *
   * 用于可选的 prompt 文件，如 common.txt 可能不存在
   */
  private getPromptSafe(language: string, type: string): string {
    try {
      return this.getPrompt(language, type);
    } catch {
      return "";
    }
  }

  /**
   * 从文件加载 prompt 内容
   */
  private loadPromptFile(language: string, type: string): string {
    const filePath = this.getFilePath(language, type);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      throw new Error(
        `Prompt file not found: ${language}/${type}.txt\n` +
          `Expected path: ${filePath}\n` +
          `Please check if the file exists or create it.`
      );
    }

    // 读取文件内容
    try {
      return fs.readFileSync(filePath, "utf-8");
    } catch (error) {
      throw new Error(
        `Failed to read prompt file: ${language}/${type}.txt\n` +
          `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 获取文件路径
   */
  private getFilePath(language: string, type: string): string {
    return path.join(this.dataDir, language, `${type}.txt`);
  }

  /**
   * 获取缓存键
   */
  private getCacheKey(language: string, type: string): string {
    return `${language}:${type}`;
  }

  /**
   * 构建任务上下文
   *
   * 明确告知 AI 当前任务的参数，避免模糊引用
   */
  private buildTaskContext(language: string, type: string): string {
    return `# 当前任务

你正在生成 **${language.toUpperCase()} ${type}** 代码。

## 任务参数

- **渲染语言**: ${language}
- **图表类型**: ${type}
- **渲染引擎**: Kroki
- **输出格式**: \`\`\`${language}
[你的代码]
\`\`\`

## 执行要求

请基于以上任务参数，严格执行下方的生成规范。`;
  }

  /**
   * 清除缓存 (用于开发环境热更新)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 获取缓存统计信息
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * 预加载常用 prompt (可选优化)
   *
   * 在应用启动时预加载常用 prompt，减少首次请求延迟
   */
  preloadCommonPrompts(): void {
    const commonPrompts = [
      { language: "mermaid", type: "flowchart" },
      { language: "mermaid", type: "sequence" },
      { language: "plantuml", type: "sequence" },
      { language: "plantuml", type: "class" },
    ];

    for (const { language, type } of commonPrompts) {
      try {
        this.getPrompt(language, type);
      } catch {
        // 忽略加载失败的文件
      }
    }
  }
}

/**
 * 单例 PromptLoader 实例
 *
 * 在整个应用中共享同一个实例，利用内存缓存
 */
export const promptLoader = new PromptLoader();

/**
 * 开发环境: 监听文件变化，自动清除缓存 (可选)
 *
 * 在开发环境下，当 prompt 文件变化时自动清除缓存，
 * 无需重启服务即可看到最新 prompt
 */
if (process.env.NODE_ENV === "development" && typeof window === "undefined") {
  // 只在服务端启用文件监听
  try {
     
    const chokidar = require("chokidar");

    const watcher = chokidar.watch("src/lib/constants/prompts/**/*.txt", {
      persistent: true,
      ignoreInitial: true,
      ignored: '**/loaders/**', // 忽略 loaders 目录
    });

    watcher.on("change", (filePath: string) => {
      console.log(`[PromptLoader] 文件变化: ${filePath}`);
      promptLoader.clearCache();
      console.log("[PromptLoader] 缓存已清除");
    });
  } catch {
    // chokidar 未安装，跳过文件监听
  }
}
