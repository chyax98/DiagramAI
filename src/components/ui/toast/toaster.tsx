/**
 * Toaster 组件 - Toast 容器和管理器
 */

"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Toast, type ToastProps } from "./toast";

// Toast 状态管理

type ToastItem = Omit<ToastProps, "onClose">;

let toastCount = 0;

const listeners: Array<(toasts: ToastItem[]) => void> = [];
let memoryState: ToastItem[] = [];

function dispatch(toasts: ToastItem[]) {
  memoryState = toasts;
  listeners.forEach((listener) => listener(toasts));
}

function addToast(toast: Omit<ToastItem, "id">) {
  const id = `toast-${++toastCount}`;
  const newToast: ToastItem = { ...toast, id };
  dispatch([...memoryState, newToast]);
  return id;
}

function removeToast(id: string) {
  dispatch(memoryState.filter((t) => t.id !== id));
}

function removeAllToasts() {
  dispatch([]);
}

// useToast Hook

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastItem[]>(memoryState);

  React.useEffect(() => {
    listeners.push(setToasts);
    return () => {
      const index = listeners.indexOf(setToasts);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
  };
}

// Toaster 组件

export function Toaster() {
  const { toasts, removeToast } = useToast();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className="pointer-events-none fixed top-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:flex-col md:max-w-[420px]"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>,
    document.body
  );
}

// Toast API - 导出便捷方法

export const toast = {
  success: (description: string, options?: { title?: string; duration?: number }) => {
    return addToast({
      variant: "success",
      description,
      ...options,
    });
  },

  error: (description: string, options?: { title?: string; duration?: number }) => {
    return addToast({
      variant: "error",
      description,
      ...options,
    });
  },

  warning: (description: string, options?: { title?: string; duration?: number }) => {
    return addToast({
      variant: "warning",
      description,
      ...options,
    });
  },

  info: (description: string, options?: { title?: string; duration?: number }) => {
    return addToast({
      variant: "info",
      description,
      ...options,
    });
  },

  custom: (toast: Omit<ToastItem, "id">) => {
    return addToast(toast);
  },

  dismiss: (id?: string) => {
    if (id) {
      removeToast(id);
    } else {
      removeAllToasts();
    }
  },
};
