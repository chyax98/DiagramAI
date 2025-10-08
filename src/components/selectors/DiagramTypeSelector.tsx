/** 图表类型选择器 - 根据渲染语言动态展示可用类型,使用shadcn/ui Select */

"use client";

import { useMemo } from "react";
import type { RenderLanguage } from "@/types/database";
import { getSupportedDiagramTypes } from "@/lib/constants/diagram-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DiagramTypeSelectorProps {
  renderLanguage: RenderLanguage;
  value: string;
  onChange: (type: string) => void;
  disabled?: boolean;
  className?: string;
}

export function DiagramTypeSelector({
  renderLanguage,
  value,
  onChange,
  disabled = false,
  className = "",
}: DiagramTypeSelectorProps) {
  const diagramTypes = useMemo(() => getSupportedDiagramTypes(renderLanguage), [renderLanguage]);

  const selectedType = diagramTypes.find((type) => type.value === value);
  const isDisabled = disabled || diagramTypes.length === 0;
  const isAutoSelect = value === "auto";

  return (
    <Select value={value} onValueChange={onChange} disabled={isDisabled}>
      <SelectTrigger className={`w-full transition-colors ${className}`} aria-label="选择图表类型">
        <SelectValue placeholder="选择图表类型">
          {isAutoSelect ? (
            <div className="flex items-center gap-2">
              <img src="/icons/lightbulb.svg" alt="" className="w-5 h-5" />
              <span className="font-semibold text-indigo-600">智能选型</span>
            </div>
          ) : selectedType ? (
            <div className="flex items-center gap-2">
              <span className="font-medium">{selectedType.label}</span>
            </div>
          ) : null}
        </SelectValue>
      </SelectTrigger>

      <SelectContent className="max-h-[320px]">
        {diagramTypes.length === 0 ? (
          <div className="px-3 py-2 text-sm text-muted-foreground text-center">
            暂无可用图表类型
          </div>
        ) : (
          <>
            <SelectItem value="auto" className="cursor-pointer border-b">
              <div className="flex items-center gap-2 py-0.5">
                <img src="/icons/lightbulb.svg" alt="" className="w-5 h-5" />
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-sm leading-tight text-indigo-600">
                    智能选型
                  </span>
                  <span className="text-xs text-muted-foreground leading-tight">
                    AI 自动选择最合适的图表类型
                  </span>
                </div>
              </div>
            </SelectItem>

            {diagramTypes.map((type) => (
              <SelectItem key={type.value} value={type.value} className="cursor-pointer">
                <div className="flex flex-col gap-1 py-0.5">
                  <span className="font-medium text-sm leading-tight text-foreground">
                    {type.label}
                  </span>
                  {type.description && (
                    <span className="text-xs text-muted-foreground leading-tight">
                      {type.description}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </>
        )}
      </SelectContent>
    </Select>
  );
}
