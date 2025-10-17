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
   * 构建完整 prompt (不包含用户输入)
   *
   * 组合结构: L1通用规范 + L2语言规范 + L3类型规范
   *
   * 用户输入由调用方（AI服务）单独传递,保持提示词的复用性
   *
   * @param language - 渲染语言
   * @param type - 图表类型
   * @returns 完整的 prompt 文本(不包含用户输入部分)
   *
   * @example
   * ```typescript
   * const prompt = loader.buildFullPromptWithoutUserInput('mermaid', 'flowchart');
   * // 返回: 通用规范 + Mermaid规范 + Flowchart规范
   * ```
   */
  buildFullPromptWithoutUserInput(language: RenderLanguage, type: DiagramType): string {
    const parts: string[] = [];

    // 1. L1: 通用规范 (所有图表共享)
    try {
      // 直接从根目录加载 universal.txt
      const universalPath = path.join(this.dataDir, "universal.txt");
      if (fs.existsSync(universalPath)) {
        parts.push(fs.readFileSync(universalPath, "utf-8"));
      }
    } catch {
      // universal.txt 可选，不存在则跳过
    }

    // 2. L2: 语言规范 (如 Mermaid 通用规范)
    try {
      parts.push(this.getPrompt(language, "common"));
    } catch {
      // language/common.txt 可选，不存在则跳过
    }

    // 3. L3: 类型规范 (如 Flowchart 特定要求)
    parts.push(this.getPrompt(language, type));

    // 过滤空内容并用分隔符连接
    return parts.filter((p) => p && p.trim().length > 0).join("\n\n---\n\n");
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
}

/**
 * 单例 PromptLoader 实例
 *
 * 在整个应用中共享同一个实例，利用内存缓存
 */
export const promptLoader = new PromptLoader();
