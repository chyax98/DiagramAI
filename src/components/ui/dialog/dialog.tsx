/**
 * Dialog 对话框组件
 *
 * 提供模态对话框功能，替代原生 alert() 和 confirm()
 */

"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "../button";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export interface DialogHeaderProps {
  children: React.ReactNode;
}

export interface DialogTitleProps {
  children: React.ReactNode;
}

export interface DialogDescriptionProps {
  children: React.ReactNode;
}

export interface DialogFooterProps {
  children: React.ReactNode;
}

// Dialog Context

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within Dialog");
  }
  return context;
}

// Dialog Root

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const contextValue = React.useMemo(() => ({ open, onOpenChange }), [open, onOpenChange]);

  return <DialogContext.Provider value={contextValue}>{children}</DialogContext.Provider>;
}

// Dialog Content

export function DialogContent({ children, className = "" }: DialogContentProps) {
  const { open, onOpenChange } = useDialog();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 锁定 body 滚动
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ESC 键关闭
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onOpenChange]);

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity animate-in fade-in"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* 对话框内容 */}
      <div
        className={`relative z-50 w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {/* 关闭按钮 */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="关闭"
        >
          <X className="h-4 w-4" />
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
}

// Dialog 子组件

export function DialogHeader({ children }: DialogHeaderProps) {
  return <div className="flex flex-col gap-1.5 text-center sm:text-left">{children}</div>;
}

export function DialogTitle({ children }: DialogTitleProps) {
  return <h2 className="text-lg font-semibold text-foreground">{children}</h2>;
}

export function DialogDescription({ children }: DialogDescriptionProps) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

export function DialogFooter({ children }: DialogFooterProps) {
  return (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2 mt-6">
      {children}
    </div>
  );
}

// 便捷 API

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "secondary" | "gradient";
}

export const dialog = {
  /**
   * 确认对话框
   */
  confirm: (options: ConfirmOptions): Promise<boolean> => {
    return new Promise(async (resolve) => {
      const dialogId = `dialog-${Date.now()}`;
      const div = document.createElement("div");
      div.id = dialogId;
      document.body.appendChild(div);

      const cleanup = () => {
        const element = document.getElementById(dialogId);
        if (element) {
          element.remove();
        }
      };

      const ConfirmDialog = () => {
        const [open, setOpen] = React.useState(true);

        const handleConfirm = () => {
          setOpen(false);
          setTimeout(() => {
            cleanup();
            resolve(true);
          }, 200);
        };

        const handleCancel = () => {
          setOpen(false);
          setTimeout(() => {
            cleanup();
            resolve(false);
          }, 200);
        };

        return (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{options.title}</DialogTitle>
                <DialogDescription>{options.description}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost" onClick={handleCancel}>
                  {options.cancelText || "取消"}
                </Button>
                <Button variant={options.variant || "default"} onClick={handleConfirm}>
                  {options.confirmText || "确认"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      };

      // 渲染对话框
      const root = (await import("react-dom/client")).createRoot(div);
      root.render(<ConfirmDialog />);
    });
  },

  /**
   * 警告对话框
   */
  alert: (title: string, description: string): Promise<void> => {
    return new Promise(async (resolve) => {
      const dialogId = `dialog-${Date.now()}`;
      const div = document.createElement("div");
      div.id = dialogId;
      document.body.appendChild(div);

      const cleanup = () => {
        const element = document.getElementById(dialogId);
        if (element) {
          element.remove();
        }
      };

      const AlertDialog = () => {
        const [open, setOpen] = React.useState(true);

        const handleOk = () => {
          setOpen(false);
          setTimeout(() => {
            cleanup();
            resolve();
          }, 200);
        };

        return (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="default" onClick={handleOk}>
                  确定
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      };

      // 渲染对话框
      const root = (await import("react-dom/client")).createRoot(div);
      root.render(<AlertDialog />);
    });
  },
};
