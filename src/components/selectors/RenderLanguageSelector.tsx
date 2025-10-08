/** 渲染语言选择器 - 支持10种图表语言,使用shadcn/ui Select+官方图标 */

"use client";

import type { RenderLanguage } from "@/types/database";
import { getRenderLanguages } from "@/lib/constants/diagram-types";
import { LanguageImageIcon } from "@/components/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LANGUAGE_OPTIONS = getRenderLanguages();

interface RenderLanguageSelectorProps {
  value: RenderLanguage;
  onChange: (language: RenderLanguage) => void;
  disabled?: boolean;
  className?: string;
}

export function RenderLanguageSelector({
  value,
  onChange,
  disabled = false,
  className = "",
}: RenderLanguageSelectorProps) {
  const selectedOption = LANGUAGE_OPTIONS.find((opt) => opt.value === value);

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={`w-full transition-colors ${className}`} aria-label="选择渲染语言">
        <SelectValue>
          {selectedOption && (
            <div className="flex items-center gap-2.5">
              <LanguageImageIcon language={selectedOption.value} size={20} className="shrink-0" />
              <span className="font-medium">{selectedOption.label}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {LANGUAGE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value} className="cursor-pointer">
            <div className="flex items-center gap-3 py-0.5">
              <LanguageImageIcon language={option.value} size={24} className="shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-sm leading-tight text-foreground">
                  {option.label}
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  {option.description}
                </span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
