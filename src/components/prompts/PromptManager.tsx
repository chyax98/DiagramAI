/**
 * 提示词管理主容器
 * 三栏布局 + 编辑器
 * ✅ 重构: 使用通用 SelectionColumn 组件消除重复代码
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { PromptSelection } from "@/types/prompt";
import {
  LANGUAGE_DIAGRAM_TYPES,
  RENDER_LANGUAGES,
  type RenderLanguage,
} from "@/lib/constants/diagram-types";
import { SelectionColumn } from "./SelectionColumn";
import { PromptEditor } from "./PromptEditor";

// L1 层级配置
const LEVELS = [
  {
    level: 1 as const,
    value: "1",
    title: "L1 通用规范",
    description: "所有图表共享",
  },
  {
    level: 2 as const,
    value: "2",
    title: "L2 语言规范",
    description: "特定语言规范",
  },
  {
    level: 3 as const,
    value: "3",
    title: "L3 类型规范",
    description: "特定图表类型",
  },
] as const;

export function PromptManager() {
  const [selection, setSelection] = useState<PromptSelection>({
    level: null,
    language: null,
    type: null,
  });

  const handleLevelSelect = (levelStr: string) => {
    const level = parseInt(levelStr, 10) as 1 | 2 | 3;

    // L3 时自动选择 mermaid + flowchart
    if (level === 3) {
      setSelection({ level, language: "mermaid", type: "flowchart" });
      return;
    }

    // L2 时自动选择 mermaid
    if (level === 2) {
      setSelection({ level, language: "mermaid", type: null });
      return;
    }

    setSelection({ level, language: null, type: null });
  };

  const handleLanguageSelect = (language: string) => {
    setSelection({ ...selection, language: language as RenderLanguage, type: null });
  };

  const handleTypeSelect = (type: string) => {
    setSelection({ ...selection, type });
  };

  // 🎯 自动选择逻辑: L3 选择语言后,自动选择第一个类型
  // ✅ 性能优化: 移除 selection.type 依赖,避免不必要的 effect 执行
  useEffect(() => {
    if (selection.level === 3 && selection.language && !selection.type) {
      const types = LANGUAGE_DIAGRAM_TYPES[selection.language as RenderLanguage];
      if (types && types.length > 0) {
        // 自动选择第一个类型
        const firstType = types[0];
        if (firstType) {
          setSelection((prev) => ({ ...prev, type: firstType.value }));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection.level, selection.language]); // ✅ 移除 selection.type 依赖

  // 根据选中的语言获取图表类型列表
  const diagramTypes = selection.language
    ? LANGUAGE_DIAGRAM_TYPES[selection.language as RenderLanguage] || []
    : [];

  return (
    <div className="flex h-full bg-background">
      {/* L1 层级选择列 */}
      <SelectionColumn
        title="层级"
        width="w-32"
        items={LEVELS}
        selectedValue={selection.level}
        onSelect={handleLevelSelect}
        renderItem={(item) => (
          <div>
            <div className="text-sm text-card-foreground">{item.title}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
          </div>
        )}
      />

      {/* L2 语言选择列 */}
      <SelectionColumn
        title="语言"
        width="w-48"
        items={RENDER_LANGUAGES}
        selectedValue={selection.language}
        onSelect={handleLanguageSelect}
        renderItem={(lang) => (
          <div className="flex items-center gap-2">
            <Image
              src={lang.iconPath}
              alt={lang.label}
              width={16}
              height={16}
              className="shrink-0"
            />
            <div className="flex-1 min-w-0 truncate">
              <div className="text-sm text-card-foreground truncate">{lang.label}</div>
            </div>
          </div>
        )}
        searchable
        showCount
        isVisible={selection.level === 2 || selection.level === 3}
        emptyMessage="未找到匹配的语言"
        filterFunction={(lang, query) =>
          lang.label.toLowerCase().includes(query) ||
          lang.value.toLowerCase().includes(query) ||
          lang.description.toLowerCase().includes(query)
        }
      />

      {/* L3 类型选择列 */}
      <SelectionColumn
        title="类型"
        width="w-52"
        items={diagramTypes}
        selectedValue={selection.type}
        onSelect={handleTypeSelect}
        renderItem={(type) => (
          <div>
            <div className="text-sm text-card-foreground">{type.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {type.description}
            </div>
          </div>
        )}
        showCount
        isVisible={selection.level === 3 && !!selection.language}
        emptyMessage="该语言暂无图表类型"
      />

      {/* 编辑器 */}
      <PromptEditor selection={selection} />
    </div>
  );
}
