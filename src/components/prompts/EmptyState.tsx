/**
 * 空状态提示组件
 * 用于显示引导性空状态,支持图标、标题、描述和步骤列表
 */

import { FileText } from "lucide-react";

interface Step {
  label: string;
}

interface EmptyStateProps {
  /** 图标组件 (默认 FileText) */
  icon?: React.ComponentType<{ className?: string }>;
  /** 主标题 */
  title: string;
  /** 描述文本 (可选) */
  description?: string;
  /** 步骤列表 (可选) */
  steps?: Step[];
}

/**
 * 空状态组件
 * 显示一个居中的空状态提示,包含图标、标题、描述和可选的步骤列表
 */
export function EmptyState({ icon: Icon = FileText, title, description, steps }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-muted/20">
      {/* 图标 */}
      <Icon className="h-16 w-16 text-muted-foreground/50 mb-4" />

      {/* 主标题 */}
      <p className="text-lg font-medium text-card-foreground">{title}</p>

      {/* 描述文本 */}
      {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}

      {/* 步骤列表 */}
      {steps && steps.length > 0 && (
        <div className="mt-6 space-y-3 text-sm text-muted-foreground">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              {/* 步骤编号 */}
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                {index + 1}
              </div>
              {/* 步骤描述 */}
              <span>{step.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
