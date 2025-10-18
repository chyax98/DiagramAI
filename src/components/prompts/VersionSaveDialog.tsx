/**
 * 版本保存对话框
 * 让用户输入版本说明和可选的自定义标签
 */

"use client";

import { useState } from "react";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  /** 下一个版本号 (自动生成,不可编辑) */
  nextVersion: string;
  /** 是否显示对话框 */
  open: boolean;
  /** 关闭对话框回调 */
  onClose: () => void;
  /** 确认保存回调 */
  onConfirm: (versionName: string, tags?: string[]) => void;
}

export function VersionSaveDialog({ nextVersion, open, onClose, onConfirm }: Props) {
  const [versionName, setVersionName] = useState("");
  const [tags, setTags] = useState("");

  if (!open) return null;

  const handleConfirm = () => {
    // 解析标签 (逗号分隔)
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onConfirm(versionName || `更新于 ${new Date().toLocaleString("zh-CN")}`, tagList);

    // 重置状态
    setVersionName("");
    setTags("");
  };

  const handleCancel = () => {
    setVersionName("");
    setTags("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-6">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">保存新版本</h3>
          <Button variant="ghost" size="sm" onClick={handleCancel} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 版本号显示 (不可编辑) */}
        <div className="mb-4">
          <Label htmlFor="version" className="text-sm font-medium">
            版本号
          </Label>
          <Input
            id="version"
            value={nextVersion}
            disabled
            className="mt-1.5 bg-muted text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground mt-1">系统自动生成</p>
        </div>

        {/* 版本说明输入 (必填) */}
        <div className="mb-4">
          <Label htmlFor="versionName" className="text-sm font-medium">
            版本说明 <span className="text-muted-foreground">(推荐填写)</span>
          </Label>
          <Textarea
            id="versionName"
            value={versionName}
            onChange={(e) => setVersionName(e.target.value)}
            placeholder="例如: 优化流程图箭头样式、修复语法错误、添加注释规范"
            className="mt-1.5 min-h-[80px] resize-none"
            autoFocus
          />
          <p className="text-xs text-muted-foreground mt-1">
            {versionName.length > 0
              ? `${versionName.length} / 100 字符`
              : "留空则自动生成: 更新于 2025-10-18 14:30"}
          </p>
        </div>

        {/* 标签输入 (可选) */}
        <div className="mb-6">
          <Label htmlFor="tags" className="text-sm font-medium">
            标签 <span className="text-muted-foreground">(可选)</span>
          </Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="例如: 性能优化, 样式调整, 重要"
            className="mt-1.5"
          />
          <p className="text-xs text-muted-foreground mt-1">多个标签用逗号分隔</p>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-3 justify-end">
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button onClick={handleConfirm} className="gap-2">
            <Save className="h-4 w-4" />
            保存
          </Button>
        </div>
      </div>
    </div>
  );
}
