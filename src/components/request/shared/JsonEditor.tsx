"use client";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import { linter, lintGutter } from "@codemirror/lint";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Code2, Copy, Check } from "lucide-react";
import { useState } from "react";

function JsonEditor({
  value,
  onChange = () => {},
  editing = true,
}: {
  value: string;
  onChange?: (value: string) => void;
  editing?: boolean;
}) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const customTheme = EditorView.theme(
    {
      "&": {
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      },
      ".cm-content": {
        padding: "12px",
        color: "hsl(var(--foreground))",
        caretColor: "hsl(var(--foreground))",
      },
      ".cm-focused": {
        outline: "none",
      },
      ".cm-editor": {
        fontSize: "14px",
      },
      ".cm-scroller": {
        backgroundColor: "transparent",
      },
      ".cm-gutters": {
        backgroundColor: "hsl(var(--muted))",
        color: "hsl(var(--muted-foreground))",
        border: "none",
      },
      ".cm-activeLineGutter": {
        backgroundColor: "hsl(var(--accent))",
      },
      ".cm-activeLine": {
        backgroundColor: "hsl(var(--accent) / 0.1)",
      },
      ".cm-selectionBackground, ::selection": {
        backgroundColor: "hsl(var(--accent) / 0.3)",
      },
      "&.cm-focused .cm-selectionBackground": {
        backgroundColor: "hsl(var(--accent) / 0.3)",
      },
      ".cm-searchMatch": {
        backgroundColor: "hsl(var(--accent) / 0.2)",
        outline: "1px solid hsl(var(--accent))",
      },
      ".cm-searchMatch.cm-searchMatch-selected": {
        backgroundColor: "hsl(var(--accent) / 0.4)",
      },
      // JSON syntax highlighting
      ".tok-property": {
        color: "hsl(var(--primary))",
      },
      ".tok-string": {
        color: "hsl(var(--destructive))",
      },
      ".tok-number": {
        color: "hsl(var(--chart-1))",
      },
      ".tok-keyword": {
        color: "hsl(var(--chart-2))",
      },
      ".tok-null": {
        color: "hsl(var(--muted-foreground))",
      },
      ".tok-bool": {
        color: "hsl(var(--chart-3))",
      },
      ".tok-bracket": {
        color: "hsl(var(--foreground))",
      },
      // Lint/Error styling
      ".cm-diagnostic": {
        padding: "3px 6px 3px 8px",
        marginLeft: "-1px",
        display: "block",
        whiteSpace: "pre-wrap",
      },
      ".cm-diagnostic-error": {
        borderLeft: "5px solid hsl(var(--destructive))",
        backgroundColor: "hsl(var(--destructive) / 0.1)",
      },
      ".cm-diagnostic-warning": {
        borderLeft: "5px solid hsl(var(--warning))",
        backgroundColor: "hsl(var(--warning) / 0.1)",
      },
      ".cm-diagnosticText": {
        fontSize: "12px",
        color: "hsl(var(--foreground))",
      },
      ".cm-lintRange": {
        backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="6" height="3"><path d="m0 3 l2 -2 l1 0 l2 2 l1 0" stroke="hsl(${
          theme === "dark" ? "0 84% 60%" : "0 84% 50%"
        })" fill="none" stroke-width="1"/></svg>')`,
        backgroundRepeat: "repeat-x",
        backgroundPosition: "left bottom",
      },
      ".cm-lintRange-error": {
        backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="6" height="3"><path d="m0 3 l2 -2 l1 0 l2 2 l1 0" stroke="hsl(${
          theme === "dark" ? "0 84% 60%" : "0 84% 50%"
        })" fill="none" stroke-width="1"/></svg>')`,
      },
      ".cm-lintRange-warning": {
        backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="6" height="3"><path d="m0 3 l2 -2 l1 0 l2 2 l1 0" stroke="hsl(${
          theme === "dark" ? "45 93% 60%" : "45 93% 50%"
        })" fill="none" stroke-width="1"/></svg>')`,
      },
      ".cm-tooltip.cm-tooltip-lint": {
        backgroundColor: "hsl(var(--popover))",
        color: "hsl(var(--popover-foreground))",
        border: "1px solid hsl(var(--border))",
        borderRadius: "6px",
        padding: "4px 8px",
        fontSize: "12px",
      },
    },
    { dark: theme === "dark" }
  );

  const formatJson = () => {
    try {
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);
      onChange(formatted);
    } catch (error) {
      // If JSON is invalid, do nothing or show a toast
      console.warn("Cannot format invalid JSON");
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(value);
      const minified = JSON.stringify(parsed);
      onChange(minified);
    } catch (error) {
      console.warn("Cannot minify invalid JSON");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn("Failed to copy to clipboard");
    }
  };

  return (
    <div className="relative">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/30">
        <div className="text-xs font-medium text-muted-foreground">JSON</div>
        <div className="flex items-center gap-1">
          {editing && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={formatJson}
                className="h-7 px-2 text-xs"
              >
                <Code2 className="h-3 w-3 mr-1" />
                Format
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={minifyJson}
                className="h-7 px-2 text-xs"
              >
                Minify
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-7 px-2 text-xs"
          >
            {copied ? (
              <Check className="h-3 w-3 mr-1" />
            ) : (
              <Copy className="h-3 w-3 mr-1" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="border rounded-b-md overflow-hidden">
        <CodeMirror
          value={value}
          height="200px"
          onChange={(value) => {
            if (editing) onChange(value);
          }}
          extensions={[json(), linter(jsonParseLinter()), lintGutter()]}
          theme={customTheme}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            highlightSelectionMatches: false,
          }}
          readOnly={!editing}
        />
      </div>
    </div>
  );
}

export default JsonEditor;