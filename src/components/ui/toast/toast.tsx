/**
 * Toast 通知组件
 *
 * 提供非阻塞式的用户反馈
 */

"use client";

import * as React from "react";
import { X, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import { cva } from "class-variance-authority";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  title?: string;
  description: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: (id: string) => void;
}

// 样式变体

const toastVariants = cva(
  "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg transition-all",
  {
    variants: {
      variant: {
        success: "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950",
        error: "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950",
        warning: "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950",
        info: "border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const iconVariants = cva("h-5 w-5 flex-shrink-0", {
  variants: {
    variant: {
      success: "text-green-600 dark:text-green-400",
      error: "text-red-600 dark:text-red-400",
      warning: "text-yellow-600 dark:text-yellow-400",
      info: "text-indigo-600 dark:text-indigo-400",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

const titleVariants = cva("text-sm font-medium", {
  variants: {
    variant: {
      success: "text-green-900 dark:text-green-100",
      error: "text-red-900 dark:text-red-100",
      warning: "text-yellow-900 dark:text-yellow-100",
      info: "text-indigo-900 dark:text-indigo-100",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

const descriptionVariants = cva("text-sm", {
  variants: {
    variant: {
      success: "text-green-700 dark:text-green-300",
      error: "text-red-700 dark:text-red-300",
      warning: "text-yellow-700 dark:text-yellow-300",
      info: "text-indigo-700 dark:text-indigo-300",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

// 图标映射

const icons: Record<ToastVariant, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

// Toast 组件

export function Toast({
  id,
  title,
  description,
  variant = "info",
  duration = 5000,
  onClose,
}: ToastProps) {
  const Icon = icons[variant];

  // 自动关闭
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [id, duration, onClose]);

  return (
    <div className={toastVariants({ variant })}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Icon className={iconVariants({ variant })} />

          <div className="flex-1">
            {title && <p className={titleVariants({ variant })}>{title}</p>}
            <p className={descriptionVariants({ variant })}>{description}</p>
          </div>

          <button
            onClick={() => onClose(id)}
            className="ml-2 flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="关闭通知"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
