/**
 * 通用选择列组件
 * 替代 PromptLevelColumn, PromptLanguageColumn, PromptTypeColumn
 * 消除 95% 的重复代码
 */

"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectionColumnProps<T extends { value: string }> {
  /** 列标题 */
  title: string;
  /** 列宽度 (Tailwind class) */
  width: string;
  /** 数据项列表 */
  items: readonly T[];
  /** 当前选中的值 */
  selectedValue: string | number | null;
  /** 选择回调函数 */
  onSelect: (value: string) => void;
  /** 渲染单个列表项的函数 */
  renderItem: (item: T, isSelected: boolean) => React.ReactNode;
  /** 是否显示搜索框 */
  searchable?: boolean;
  /** 是否显示计数 */
  showCount?: boolean;
  /** 是否可见 (条件渲染) */
  isVisible?: boolean;
  /** 空数据提示文本 */
  emptyMessage?: string;
  /** 搜索过滤函数 (自定义搜索逻辑) */
  filterFunction?: (item: T, searchQuery: string) => boolean;
}

/**
 * 通用选择列组件
 * 支持搜索、过滤、自定义渲染
 */
export function SelectionColumn<T extends { value: string }>({
  title,
  width,
  items,
  selectedValue,
  onSelect,
  renderItem,
  searchable = false,
  showCount = false,
  isVisible = true,
  emptyMessage = "无数据",
  filterFunction,
}: SelectionColumnProps<T>) {
  const [search, setSearch] = useState("");

  // 过滤列表项
  const filteredItems = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return items;

    if (filterFunction) {
      return items.filter((item) => filterFunction(item, query));
    }

    // 默认过滤逻辑: 匹配 value 字段
    return items.filter((item) => item.value.toLowerCase().includes(query));
  }, [items, search, filterFunction]);

  // 条件渲染: 不可见时返回 null
  if (!isVisible) return null;

  return (
    <div className={cn(width, "border-r border-border flex flex-col bg-card")}>
      {/* 标题栏 */}
      <div className="px-3 py-2 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm text-card-foreground">{title}</h3>
          {showCount && <span className="text-xs text-muted-foreground">{items.length} 种</span>}
        </div>

        {/* 搜索框 */}
        {searchable && (
          <div className="relative">
            <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="搜索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-7 pr-2 py-1.5 text-xs border border-input rounded bg-background
                       focus:outline-none focus:ring-1 focus:ring-ring
                       placeholder:text-muted-foreground"
            />
          </div>
        )}
      </div>

      {/* 列表 */}
      <div className="flex-1 overflow-y-auto">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isSelected =
              selectedValue !== null &&
              (typeof selectedValue === "number"
                ? item.value === selectedValue.toString()
                : item.value === selectedValue);

            return (
              <button
                key={item.value}
                onClick={() => onSelect(item.value)}
                className={cn(
                  "w-full px-3 py-2 text-left transition-colors border-b border-border",
                  "hover:bg-accent",
                  isSelected && "bg-accent border-l-2 border-l-primary font-medium"
                )}
              >
                {renderItem(item, isSelected)}
              </button>
            );
          })
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">{emptyMessage}</div>
        )}
      </div>
    </div>
  );
}
