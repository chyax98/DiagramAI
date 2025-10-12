/**
 * 可复用的错误边界组件
 *
 * 用于包裹可能出错的组件，提供局部错误处理
 * 避免单个组件错误影响整个页面
 */

"use client";

import React, { Component, type ReactNode } from "react";

import { AlertCircle } from "lucide-react";
import { logger } from "@/lib/utils/logger";

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** 组件名称 (用于错误日志) */
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新 state 以便下次渲染显示降级 UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录错误日志
    logger.error("ErrorBoundary caught error:", {
      componentName: this.props.componentName || "Unknown",
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      // 默认错误 UI
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
            <div className="flex-1">
              <h3 className="font-medium text-red-800">组件加载失败</h3>
              <p className="mt-1 text-sm text-red-600">{this.state.error.message}</p>
              <button
                onClick={this.reset}
                className="mt-3 rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200"
              >
                重新加载
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 使用示例：
// <ErrorBoundary>
//   <SomeComponentThatMightFail />
// </ErrorBoundary>

// <ErrorBoundary
//   fallback={(error, reset) => (
//     <div>
//       <p>Error: {error.message}</p>
//       <button onClick={reset}>Try again</button>
//     </div>
//   )}
// >
//   <SomeComponent />
// </ErrorBoundary>
