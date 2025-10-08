/** 代码编辑器 - 基于CodeMirror 6,支持多图表语言和主题自动切换 */

"use client";

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { indigoLightTheme, indigoDarkTheme } from "@/lib/themes/codemirror-theme";
import type { RenderLanguage } from "@/types/diagram";
import { getRenderLanguages } from "@/lib/constants/diagram-types";
import { useTheme } from "@/contexts/ThemeContext";
import { Copy, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { copyTextToClipboard } from "@/lib/utils/clipboard";
interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: RenderLanguage;
  readOnly?: boolean;
}

function getLanguageInfo(language: RenderLanguage) {
  const languages = getRenderLanguages();
  const languageConfig = languages.find((lang) => lang.value === language);

  return languageConfig
    ? {
        label: languageConfig.label,
        name: `${languageConfig.label} 代码`,
        iconPath: languageConfig.iconPath,
      }
    : {
        label: language,
        name: "代码",
        iconPath: "/icons/languages/mermaid.svg", // 默认图标
      };
}

function formatCode(code: string): string {
  return code
    .split("\n")
    .map((line) => line.trimEnd()) // 移除行尾空格
    .join("\n")
    .replace(/\n{3,}/g, "\n\n"); // 最多保留 2 个连续空行
}

export function CodeEditor({ code, onChange, language, readOnly = false }: CodeEditorProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success">("idle");
  const { isDark } = useTheme(); // 订阅全局主题状态

  const { label, name, iconPath } = getLanguageInfo(language);

  const handleCopy = async () => {
    const success = await copyTextToClipboard(code);
    if (success) {
      setCopyStatus("success");
      setTimeout(() => setCopyStatus("idle"), 2000); // 2 秒后恢复
    }
  };

  const handleFormat = () => {
    const formatted = formatCode(code);
    onChange(formatted);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-card">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 bg-card">
        <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
          <Image src={iconPath} alt={label} width={20} height={20} className="shrink-0" />
          <span>{name}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 gap-1.5 text-xs"
            title="复制代码"
          >
            <Copy className="h-3.5 w-3.5" />
            {copyStatus === "success" ? "已复制" : "复制"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleFormat}
            className="h-8 gap-1.5 text-xs"
            title="格式化代码"
            disabled={readOnly}
          >
            <Code className="h-3.5 w-3.5" />
            格式化
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-card">
        <CodeMirror
          value={code}
          height="100%"
          theme={isDark ? indigoDarkTheme : indigoLightTheme}
          extensions={[javascript()]} // 通用语法高亮,兼容 Mermaid/PlantUML/D2/Graphviz
          onChange={onChange}
          editable={!readOnly}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            foldGutter: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            searchKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
        />
      </div>
    </div>
  );
}
