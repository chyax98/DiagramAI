/**
 * 提示词编辑器
 * 包含工具栏、版本选择器、CodeMirror 编辑器和状态栏
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Save, RotateCcw } from "lucide-react";
import type { PromptSelection } from "@/types/prompt";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { usePrompt } from "@/hooks/usePrompt";
import { generateNextVersion } from "@/lib/utils/version";
import { VersionSelector } from "./VersionSelector";
import { PromptCodeEditor } from "./PromptCodeEditor";
import { VersionSaveDialog } from "./VersionSaveDialog";
import { EmptyState } from "./EmptyState";

interface Props {
  selection: PromptSelection;
}

export function PromptEditor({ selection }: Props) {
  const { prompt, versions, loading, error, savePrompt, activateVersion } = usePrompt(selection);
  const [content, setContent] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // 当 prompt 加载完成后更新内容
  useEffect(() => {
    if (prompt) {
      setContent(prompt.content);
      setHasChanges(false);
    } else {
      setContent("");
      setHasChanges(false);
    }
  }, [prompt]);

  // ✅ 性能优化: 缓存原始内容,避免每次输入都重新获取
  const originalContent = useMemo(() => prompt?.content || "", [prompt]);

  // ✅ 性能优化: 使用 useCallback 缓存函数引用
  const handleContentChange = useCallback(
    (newContent: string) => {
      setContent(newContent);
      setHasChanges(newContent !== originalContent);
    },
    [originalContent]
  );

  // ✅ 性能优化: 使用 useMemo 预计算下一个版本号
  const nextVersion = useMemo(() => generateNextVersion(versions), [versions]);

  // ✅ 性能优化: 使用 useCallback 缓存函数引用
  const handleSaveClick = useCallback(() => {
    if (!hasChanges) {
      toast.info("没有需要保存的更改");
      return;
    }
    setShowSaveDialog(true);
  }, [hasChanges]);

  // 确认保存
  const handleConfirmSave = async (versionName: string, _tags?: string[]) => {
    setShowSaveDialog(false);

    try {
      const savedVersion = await savePrompt(content, versionName);
      toast.success(`提示词已保存为版本 ${savedVersion}`);
      setHasChanges(false);
    } catch (_err) {
      toast.error("保存失败");
    }
  };

  // 重置内容
  const handleReset = () => {
    if (prompt) {
      setContent(prompt.content);
      setHasChanges(false);
      toast.info("已重置到原始内容");
    }
  };

  // ✅ 使用 EmptyState 组件替换重复的空状态 UI
  if (!selection.level) {
    return (
      <EmptyState
        title="欢迎使用 Prompt 管理"
        description="请按照以下步骤操作:"
        steps={[
          { label: "选择提示词层级 (L1/L2/L3)" },
          { label: "选择渲染语言 (如 Mermaid, PlantUML)" },
          { label: "选择图表类型 (L3 自动选择第一个)" },
          { label: "编辑并保存为新版本" },
        ]}
      />
    );
  }

  // L2 或 L3 需要选择语言
  if ((selection.level === 2 || selection.level === 3) && !selection.language) {
    return <EmptyState title="请选择渲染语言" description="从左侧语言列表中选择一个渲染语言" />;
  }

  // L3 需要选择类型 (但这个不会触发,因为有自动选择逻辑)
  if (selection.level === 3 && !selection.type) {
    return <EmptyState title="正在加载..." description="自动选择第一个图表类型" />;
  }

  // 构建标题
  const getTitle = () => {
    const parts = [`L${selection.level}`];
    if (selection.language) parts.push(selection.language);
    if (selection.type) parts.push(selection.type);
    return parts.join(" > ");
  };

  return (
    <div className="flex-1 flex flex-col bg-card">
      {/* 顶部工具栏 */}
      <div className="h-14 shrink-0 px-4 border-b border-border flex items-center justify-between bg-card">
        {/* 左侧: 标题 + 版本选择器 */}
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-base text-card-foreground">{getTitle()}</h3>

          <VersionSelector
            versions={versions}
            currentVersion={prompt?.version}
            onSelect={activateVersion}
            disabled={loading}
          />

          {/* 加载指示器 */}
          {loading && (
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              加载中...
            </div>
          )}

          {/* 错误提示 */}
          {error && <div className="text-xs text-destructive">{error}</div>}
        </div>

        {/* 右侧: 操作按钮 */}
        <div className="flex items-center gap-2">
          {/* 重置按钮 */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={!hasChanges || loading}
            className="h-8 gap-1.5 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            重置
          </Button>

          {/* 保存按钮 */}
          <Button
            size="sm"
            onClick={handleSaveClick}
            disabled={!hasChanges || loading}
            loading={loading}
            className="h-8 gap-1.5 text-xs"
          >
            <Save className="h-3.5 w-3.5" />
            保存
          </Button>
        </div>
      </div>

      {/* CodeMirror 编辑器 */}
      <div className="flex-1 overflow-hidden">
        <PromptCodeEditor value={content} onChange={handleContentChange} readOnly={loading} />
      </div>

      {/* 底部状态栏 */}
      <div className="h-10 shrink-0 px-4 border-t border-border flex items-center justify-between bg-card text-xs text-muted-foreground">
        {/* 左侧: 字符统计 */}
        <div className="flex items-center gap-4">
          <span>
            字符数: {content.length} / 20000
            {content.length > 20000 && <span className="text-destructive ml-2">超出限制!</span>}
          </span>
          <span>行数: {content.split("\n").length}</span>
          {hasChanges && <span className="text-amber-600">● 未保存</span>}
        </div>

        {/* 右侧: 操作 */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            查看默认值对比
          </Button>
        </div>
      </div>

      {/* 版本保存对话框 */}
      <VersionSaveDialog
        nextVersion={nextVersion}
        open={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onConfirm={handleConfirmSave}
      />
    </div>
  );
}
