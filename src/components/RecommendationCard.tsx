/** 推荐卡片组件 - 显示 AI 推荐的语言和类型组合 */

"use client";

import { useState } from "react";
import { X, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RecommendationResult } from "@/types/recommendation";
import { RENDER_LANGUAGES, LANGUAGE_DIAGRAM_TYPES } from "@/lib/constants/diagram-types";

interface RecommendationCardProps {
  recommendation: RecommendationResult;
  onApply: () => void;
  onClose: () => void;
}

export function RecommendationCard({ recommendation, onApply, onClose }: RecommendationCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  // 获取语言和类型的显示名称
  const languageInfo = RENDER_LANGUAGES.find((l) => l.value === recommendation.renderLanguage);
  const typeInfo = LANGUAGE_DIAGRAM_TYPES[recommendation.renderLanguage]?.find(
    (t) => t.value === recommendation.diagramType
  );

  const languageLabel = languageInfo?.label || recommendation.renderLanguage;
  const typeLabel = typeInfo?.label || recommendation.diagramType;
  const confidence = Math.round(recommendation.confidence * 100);

  return (
    <div
      className="relative w-full z-50
                 bg-card/95 backdrop-blur-lg border rounded-xl
                 shadow-2xl animate-in slide-in-from-top-2 duration-300
                 max-h-[600px] overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          <span className="font-semibold text-lg">AI 推荐</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 rounded-full hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* 推荐结果 */}
        <div>
          <div className="text-sm text-muted-foreground mb-2">推荐组合</div>
          <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {languageLabel} - {typeLabel}
          </div>
        </div>

        {/* 匹配度 */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">匹配度</span>
            <span className="font-semibold text-indigo-600">{confidence}%</span>
          </div>
          {/* 进度条 */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        {/* 详细理由 (可折叠) */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-between hover:bg-muted/50"
            onClick={() => setShowDetails(!showDetails)}
          >
            <span className="text-sm font-medium">查看推荐理由</span>
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {showDetails && (
            <div className="mt-3 space-y-2 animate-in slide-in-from-top-1 duration-200">
              {recommendation.reasons.map((reason, i) => (
                <div key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-indigo-500">•</span>
                  <span>{reason}</span>
                </div>
              ))}

              {/* 备选方案 */}
              {recommendation.alternatives && recommendation.alternatives.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm font-medium mb-2">其他选择</div>
                  {recommendation.alternatives.map((alt, i) => {
                    const altLang = RENDER_LANGUAGES.find((l) => l.value === alt.language);
                    const altType = LANGUAGE_DIAGRAM_TYPES[alt.language]?.find(
                      (t) => t.value === alt.type
                    );
                    return (
                      <div key={i} className="flex items-start gap-2 text-sm mb-2">
                        <span className="text-muted-foreground">→</span>
                        <div>
                          <div className="font-medium">
                            {altLang?.label} - {altType?.label} ({Math.round(alt.confidence * 100)}
                            %)
                          </div>
                          <div className="text-xs text-muted-foreground">{alt.reason}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 应用按钮 */}
        <Button onClick={onApply} className="w-full" size="lg" variant="gradient">
          <span className="font-semibold">✓ 应用推荐</span>
        </Button>
      </div>
    </div>
  );
}
