/**
 * 提示词代码编辑器
 * 基于 CodeMirror,用于编辑 Markdown 格式的提示词
 */

"use client";

import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { useTheme } from "@/contexts/ThemeContext";
import { indigoLightTheme, indigoDarkTheme } from "@/lib/themes/codemirror-theme";

interface Props {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function PromptCodeEditor({ value, onChange, readOnly = false }: Props) {
  const { isDark } = useTheme();

  return (
    <div className="h-full w-full overflow-auto bg-card">
      <CodeMirror
        value={value}
        height="100%"
        theme={isDark ? indigoDarkTheme : indigoLightTheme}
        extensions={[markdown()]}
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
  );
}
