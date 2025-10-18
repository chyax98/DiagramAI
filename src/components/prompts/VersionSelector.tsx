/**
 * 版本选择器
 * 显示当前版本和历史版本列表
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { PromptVersionInfo } from "@/types/prompt";

interface Props {
  versions: PromptVersionInfo[];
  currentVersion?: string;
  onSelect: (versionId: number) => void;
  disabled?: boolean;
}

export function VersionSelector({ versions, currentVersion, onSelect, disabled = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleVersionSelect = (versionId: number) => {
    onSelect(versionId);
    setIsOpen(false);
  };

  // 找到当前激活的版本
  const activeVersion = versions.find((v) => v.is_active === 1);
  const displayVersion = currentVersion || activeVersion?.version || "未选择";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 触发按钮 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="h-8 gap-1.5 text-xs"
      >
        <span>版本: {displayVersion}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")} />
      </Button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-popover border border-border rounded-md shadow-lg z-50 max-h-[320px] overflow-y-auto">
          {/* 自定义版本列表 */}
          {versions.length > 0 && (
            <div className="p-1">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                自定义版本
              </div>
              {versions.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleVersionSelect(v.id)}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm rounded-sm",
                    "hover:bg-accent transition-colors",
                    "flex items-start gap-2"
                  )}
                >
                  {/* 选中指示器 */}
                  <div className="mt-0.5 shrink-0">
                    {v.is_active === 1 ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                  </div>

                  {/* 版本信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-card-foreground">{v.version}</span>
                      {v.is_active === 1 && (
                        <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                          当前
                        </span>
                      )}
                    </div>
                    {v.name && <div className="text-xs text-muted-foreground mt-0.5">{v.name}</div>}
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {new Date(v.created_at).toLocaleString("zh-CN")}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* 空状态提示 */}
          {versions.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">暂无自定义版本</div>
          )}
        </div>
      )}
    </div>
  );
}
