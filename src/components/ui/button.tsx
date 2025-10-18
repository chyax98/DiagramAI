/**
 * Button 组件
 *
 * 统一样式系统，使用 Indigo-Violet 主题色
 * 集成 shadcn/ui 的 HSL 变量系统
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // 基础样式
  "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        // 默认按钮 - 使用 shadcn/ui 的 primary 变量 (Indigo)
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 focus-visible:ring-primary",

        // Secondary 按钮 - Violet
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90 focus-visible:ring-secondary",

        // Ghost 按钮 - 透明背景，适用于暗色背景
        ghost:
          "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent",

        // Outline 按钮
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-primary",

        // Destructive 按钮 - 危险操作
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive",

        // Link 按钮
        link: "text-primary underline-offset-4 hover:underline focus-visible:ring-primary",

        // Gradient 按钮 - Indigo to Violet 渐变
        gradient:
          "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 focus-visible:ring-indigo-500",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 px-3 py-1.5 text-xs",
        lg: "h-12 px-8 py-3 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

// Button 组件

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
