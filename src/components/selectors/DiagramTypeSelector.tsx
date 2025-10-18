/** 图表类型选择器 - 根据渲染语言动态展示可用类型,使用shadcn/ui Select */

"use client";

import { useMemo } from "react";
import { getSupportedDiagramTypes, type RenderLanguage } from "@/lib/constants/diagram-types";
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

  return (
    <Select value={value} onValueChange={onChange} disabled={isDisabled}>
      <SelectTrigger className={`w-full transition-colors ${className}`} aria-label="选择图表类型">
        <SelectValue placeholder="选择图表类型">
          {selectedType ? <span className="font-medium">{selectedType.label}</span> : null}
        </SelectValue>
      </SelectTrigger>

      <SelectContent className="max-h-[320px]">
        {diagramTypes.length === 0 ? (
          <div className="px-3 py-2 text-sm text-muted-foreground text-center">
            暂无可用图表类型
          </div>
        ) : (
          diagramTypes.map((type) => (
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
          ))
        )}
      </SelectContent>
    </Select>
  );
}
